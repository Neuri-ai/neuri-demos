import Icons from "helpers/iconscall";
import { useEffect } from "react";
import { gsap } from "gsap";
import "./style.css";
import { useState } from "react";

// import RecordRTC from "recordrtc";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const initialtexttest = [
  {
    message: "Panchito se la come",
    pos: "izq",
  },
  {
    message: "Entera y doblada ajajaja",
    pos: "izq",
  },
  {
    message: "Santa purisima",
    pos: "der",
  },
];

const API_KEY = "1CV7SkQtkxT3gfeI42kTJY7uQlSfW24Kng";
const SAMPLE_RATE = 16000;
const LANG = "es-mx";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;

const VoiceSearch = () => {
  const [microText, setText] = useState("");
  const [isRecording, setRecording] = useState(true);
  const [messages, setMessages] = useState(initialtexttest);
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
        duration: 1,
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
        duration: 1,
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
          } else {
            // cuando este bloque se ejecuta es porque se debe de enviar el mensaje
            //console.log(res.transcription);
            const newMessages = [
              ...messages,
              {
                message: res.transcription,
                pos: "der"
              },
            ]
            setMessages(newMessages)
          }
        } catch (e) {
          console.log(event.data);
        }
      };

      // handle errors
      socket.onerror = (error) => {
        console.log(error);
        socket.close();
        socket = null;
      };

      // handle closing the socket
      socket.onclose = (event) => {
        console.log(event);
        socket = null; // clean of memory
      };

      // this function is called when the websocket is opened
      socket.onopen = async () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
          recorder = RecordRTC(stream, {
            type: "audio",
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
        <img onClick={() => run()} src={Icons.Microphone} alt="microphone" />
      </div>
    </div>
  );
};
export default VoiceSearch;
