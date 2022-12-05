import { useState } from "react";
import NMicrophone from "components/Microphone";
import NeuriDrawer from "components/Drawer";
import "./style.css";
import "./formfill.style.scss";
import { useEffect } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import gsap from "gsap";

const API_KEY = "LHfyH9zSH1CMXCfew3vjsGOhFRSW78sL_w";
const SAMPLE_RATE = 16000;
const LANG = "en-us";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;

const VoiceFormFill = () => {
  const [state, setState] = useState(false);
  const [isRecording, setRecording] = useState(true);

  useEffect(() => {
    let tl = gsap.timeline();
    tl.fromTo(
      "#DemoFFSection",
      {
        scale: 0.7,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
      }
    );
    tl.fromTo(
      "#vffnmicro",
      {
        opacity: 0,
      },
      {
        opacity: 1,
      }
    );
  }, []);

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
            console.log(res);
          }
          if (res.isFinal === true) {
            console.log(res);
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
    <>
      <section id="DemoFFSection">
        <form id="DemoFFGrid">
          <label id="DFG1">
            <p>Pick up location</p>
            <input type="text" className=""></input>
          </label>
          <label id="DFG2">
            <p>Drop off location</p>
            <input placeholder="Same as pick up location" type="text"></input>
          </label>
          <div id="DFG3">
            <div className="off">
              <label>Pick up Date</label>
              <div className="inputs">
                <input type="date"></input>
                <input type="time" defaultValue="08:00"></input>
              </div>
            </div>
            <div className="off">
              <label>Drop off Date</label>
              <div className="inputs">
                <input type="date"></input>
                <input type="time" defaultValue="13:00"></input>
              </div>
            </div>
          </div>
          <button type="submit" id="dffsbtn">
            Search
          </button>
        </form>
      </section>
      <div id="vffnmicro" onClick={() => run()}>
        <NMicrophone state={state} />
      </div>
      <NeuriDrawer
        props={{
          transcription: "",
          position: "top-left",
          state: state,
        }}
      />
    </>
  );
};
export default VoiceFormFill;
