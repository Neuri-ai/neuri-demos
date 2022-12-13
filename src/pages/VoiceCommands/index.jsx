import axios from "axios"
import { useState, useReducer } from "react";
import NeuriMicro from "components/Microphone"
import NeuriCamera from "components/Video"
import NeuriDrawer from "components/Drawer";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import './voicecommands.style.scss'

const API_KEY = "OY_R_zYFO0Czn3Lm76Iau7uaC1QhvQAxIA";
const SAMPLE_RATE = 16000;
const LANG = "es-mx";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;

const VoiceCommands = () => {
  const [isRecording, setRecording] = useState(true);
  const [arduinoVal, setArduinoVal] = useState({ led: 'off', deg: 0 })

  const HandlePost = (param) => {
    const newdata = {
      led: param?.led ? param.led : arduinoVal.led,
      deg: param?.deg ? param.deg : arduinoVal.deg
    }

    console.log('mandando post')
    axios({
      method: 'POST',
      url: 'http://192.168.3.164/',
      data: JSON.stringify(newdata)
    }).then(function(response){console.log(response)}).catch((error) => console.log(error))
    setArduinoVal(newdata)
  }

  const reducer = ( state, param ) => {
    return param
  }
  const [state, dispatch] = useReducer( reducer, [{ led: '', deg: '' }]);

  const DrawerFormater = ( trans ) => {
    let splited = trans["transcription"].split(' ')
    let newDrawer = splited.map(obj => {
      if ( obj === "enciende" ) return { color: true, value: 'Enciende' }
      if ( obj === "apaga" ) return { color: true, value: 'Apaga' }
      return { color: false, value: obj }
    })
    dispatch(newDrawer)
  }

  const run = async () => {
    setRecording(!isRecording);
    dispatch([{ color: false, value: 'initializing' }])

    if (!isRecording) {
      // si el microfono esta grabando detener y limpiar la memoria
      if (recorder) {
        recorder.pauseRecording();
        recorder = null;
      }

      if (socket) {
        socket.send(JSON.stringify({ terminate_session: true }));
        socket.close();
        socket = null;
      }
    } else {
      // connect to the websocket
      socket = new WebSocket(URL);

      // this function is called when the websocket receives a message
      socket.onmessage = async (event) => {
        // the first message is the connection state
        // try parsing the message as JSON if it fails, it's the connection state
        try {
          const res = JSON.parse(event.data);
          if (res.isFinal === false) {
            DrawerFormater(res)
          }
          if (res.isFinal === true) {
            let newdata = arduinoVal
            console.log(newdata)
            res["entities"].forEach(obj => {
              if( obj.name === "turn_on_light" ) newdata = {...newdata, led: 'on'}
              if( obj.name === "turn_off_light" ) newdata = {...newdata, led: 'off'}
            })
            HandlePost(newdata)
          }
        } catch (e) {
          //console.log(event.data);
        }
      };

      // handle errors
      socket.onerror = (error) => {
        socket.close();
        socket = null;
      };

      // handle closing the socket
      socket.onclose = (event) => {
        socket = null; // clean of memory
      };

      // this function is called when the websocket is opened
      socket.onopen = async () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          dispatch([{ color: false, value: 'Listening . . .' }])
          recorder = RecordRTC(stream, {
            type: "audio",
            disableLogs: true,
            recorderType: StereoAudioRecorder,
            mimeType: "audio/wav",
            numberOfAudioChannels: 1,
            desiredSampRate: SAMPLE_RATE,
            bufferSize: 4096,
            timeSlice: 250,
            ondataavailable: (blob) => {
              const reader = new FileReader();

              reader.onload = () => {
                // convert the audio to base64
                const base64data = reader.result;
                // audio data must be sent as a base64 encoded string
                if (socket) {
                  if (socket) {
                    socket.send(
                      JSON.stringify({
                        audio_data: base64data.split("base64,")[1],
                      })
                    );
                  }
                }
              };
              reader.readAsDataURL(blob);
            },
          });
          recorder.startRecording();
        });
      };
    }
  };

  return(
    <section id="SectionVCommands">
      <div id="vcommandcontainer">
        <NeuriCamera />
        <div className="nvoicecommandmicdiv" onClick={() => run()}>
          <NeuriMicro state={!isRecording} options={{ size: '50px', position: 'slave'}} />
        </div>
        <NeuriDrawer
          props={{
            transcription: state,
            position: "top-left",
            state: !isRecording,
          }}
        />
      </div>
    </section>
  )
}

export default VoiceCommands