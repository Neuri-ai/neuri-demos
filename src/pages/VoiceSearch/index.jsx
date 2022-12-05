import axios from "axios";
import { useState } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import NeuriDrawer from "../../components/Drawer";
import NeuriMicro from "../../components/Microphone";
import './voicesearch.style.scss'


const API_KEY = "LHfyH9zSH1CMXCfew3vjsGOhFRSW78sL_w";
const SAMPLE_RATE = 16000;
const LANG = "en-us";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;


const VoiceSearch = () => {
  const ApiKey = 'AIzaSyApybNAog7h8xSuCgP46mfoBEY5brVMXK8';
  const CxKey = '912126383dc3f4c47';
  const [value, setValue] = useState('');
  const [fData, setFData] = useState([])
  const [isRecording, setRecording] = useState(true);


  const FetchData = async ( datatosearch ) => {
    await axios.get(` https://www.googleapis.com/customsearch/v1?key=${ApiKey}&cx=${CxKey}&q=${datatosearch}`).then(data => {
      setFData(data.data.items)
      console.log(data.data.items)
    }).catch(error => {
      console.log(error)
    })
  }

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
      socket.onmessage = async (event) => {
        // the first message is the connection state
        // try parsing the message as JSON if it fails, it's the connection state
        try {
          const res = JSON.parse(event.data);
          if (res.isFinal === false) {
            setValue(res.transcription)
          }
          if (res.isFinal === true) {
            setValue(res.transcription);
            await FetchData(res.transcription);
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

  return (
    <section id="sectionvsearch">
      <div id="searchdiv">
        <p>{value}</p>
        <div id="voicesearchmicro" onClick={() => run()}>
          <NeuriMicro state={!isRecording} options={{ size: '100%'}} />
        </div>
      </div>
      <ul id="searchedcontainer">
        {
          fData.map((item, key) => {
            return (
              <li key={key} className="searchitem">
                <div id="vsseparator">
                  <a className="vssp">{item?.title}</a>
                  <p className="vssp">{item?.snippet}</p>
                  <a className="vssp">{item?.displayLink}</a>
                </div>
                <div id="vsimgseparator">
                  <img src={(item?.pagemap?.cse_thumbnail !== undefined ? item.pagemap.cse_thumbnail[0].src : undefined)} alt="" />
                </div>
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}
export default VoiceSearch