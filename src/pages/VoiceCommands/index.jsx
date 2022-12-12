import axios from "axios"
import { useState, useReducer } from "react";
import NeuriMicro from "components/Microphone"
import NeuriCamera from "components/Video"
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import './voicecommands.style.scss'

const VoiceCommands = () => {
  const [isRecording, setRecording] = useState(true);

  const HandlePost = ( param ) => {
    const data = {
      led: param.led , deg: 0
    }

    console.log('mandando post')
    axios({
      method: 'POST',
      url: 'http://192.168.3.164/',
      data: JSON.stringify(data)
    }).then(function(response){console.log(response)}).catch((error) => console.log(error))
  }

  const reducer = ( state, param ) => {
    console.log(param)
    HandlePost(param)
    return param
  }
  const [state, dispatch] = useReducer( reducer, [{ led: '', deg: '' }]);

  const API_KEY = "OY_R_zYFO0Czn3Lm76Iau7uaC1QhvQAxIA";
  const SAMPLE_RATE = 16000;
  const LANG = "es-mx";
  const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
  let recorder;
  let socket;

  const run = async () => {
    setRecording(!isRecording);

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
      socket.onmessage = (event) => {
        // the first message is the connection state
        // try parsing the message as JSON if it fails, it's the connection state
        try {
          const res = JSON.parse(event.data);
          if (res.isFinal === false) {
            console.log(res)
          }
          if (res.isFinal === true) {
            res.entities.map((obj) => {
              if(obj.name === "turn_on_light" && ["enciende", "on"].includes(obj.value)) dispatch({ led: 'on' })
              if(obj.name === "turn_off_light" && ["apaga", "off"].includes(obj.value)) dispatch({ led: 'off' })
            })
            
          }
        } catch (e) {
          console.log(event.data);
        }
      };

      // handle errors
      socket.onerror = (error) => {
        socket.close();
        socket = null;
      };

      // handle closing the socket
      socket.onclose = (event) => {
        console.log(event)
        socket = null; // clean of memory
      };

      // this function is called when the websocket is opened
      socket.onopen = async () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
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
      <button onClick={() => HandlePost()}>Mandar Post</button>
      <NeuriCamera />
      <div className="nvoicecommandmicdiv" onClick={() => run()}>
        <NeuriMicro state={!isRecording} options={{ size: '50px', position: 'slave'}} />
      </div>
    </section>
  )
}

export default VoiceCommands