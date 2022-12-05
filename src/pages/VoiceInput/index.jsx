import { useState, useEffect } from "react";
import { gsap } from "gsap";
import shortid from "shortid";
import { Icons } from "helpers/iconscall";
import "./style.css";

// import RecordRTC from "recordrtc";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";
import NMicrophone from "../../components/Microphone";

const initialtexttest = [
  {
    message: "Hi",
    pos: "izq",
  },
  {
    message: "How can i help you?",
    pos: "izq",
  },
];

const API_KEY = "LHfyH9zSH1CMXCfew3vjsGOhFRSW78sL_w";
const SAMPLE_RATE = 16000;
const LANG = "en-us";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;

const VoiceInput = () => {
  const [microText, setText] = useState("");
  const [isRecording, setRecording] = useState(true);
  const [messages, setMessages] = useState(initialtexttest);
  const [imgClass, setImgClass] = useState('')
  useEffect(() => {
    let tl = gsap.timeline();
    tl.fromTo(
      ".dvscontainer",
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
      }
    );
    tl.fromTo(
      ".chatinput",
      {
        opacity: 0,
        y: -100,
        scale: 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
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
      socket.onmessage = (event) => {
        // the first message is the connection state
        // try parsing the message as JSON if it fails, it's the connection state
        try {
          const res = JSON.parse(event.data);
          if (res.isFinal === false) {
            setText(res.transcription);
          }
          if (res.isFinal === true) {
            setText(res.transcription);
            setMessages((messages) => [
              ...messages,
              {
                message: res.transcription,
                pos: "der",
                id: shortid.generate()
              },
            ]);
          }
        } catch (e) {
          console.log(event.data);
        }
      };

      // handle errors
      socket.onerror = (error) => {
        socket.close();
        setImgClass('')
        socket = null;
      };

      // handle closing the socket
      socket.onclose = (event) => {
        setImgClass(false)
        console.log(event)
        socket = null; // clean of memory
      };

      // this function is called when the websocket is opened
      socket.onopen = async () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          setImgClass(true)
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
    <div className="dvscontainer">
      <div className="dvschatcontainer">
        {messages.map((index, key) => {
          return (
            <div className={`chat ${index.pos}`} key={key}>
              {index.pos === "izq" && <img src={Icons.Neuri}></img>}
              <p className={index.pos}>{index.message}</p>
              {index.pos === "der" && <img src={Icons.User}></img>}
            </div>
          );
        })}
      </div>
      <div className="chatinput">
        <p>{microText}</p>
        <div id="vsmicrodiv" onClick={() => run()}>
          <NMicrophone state={imgClass} options={{ size: '60px' }} />
        </div>
      </div>
    </div>
  );
};
export default VoiceInput;
