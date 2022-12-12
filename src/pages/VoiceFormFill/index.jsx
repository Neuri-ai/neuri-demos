import { useState, useEffect, useReducer } from "react";
import NMicrophone from "components/Microphone";
import NeuriDrawer from "components/Drawer";
import gsap from "gsap";
import "./style.css";
import "./formfill.style.scss";
import vformcheck from "helpers/VoiceTranscription/VoiceTrans.json"
import RecordRTC, { StereoAudioRecorder } from "recordrtc";


const API_KEY = "sEv5IWnlSCfJ79osIaoLClpZS8nscI2PGw";
const SAMPLE_RATE = 16000;
const LANG = "en-us";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;

const VoiceFormFill = () => {
  const [isRecording, setRecording] = useState(true);
  const initialFormVal = { input1: '', input2: '', date1: '', date2: '', time1: '', time2: '' };
  const [formVal, setFormVal] = useState(initialFormVal)

  const reducer = (state, param) => {
    return param
  }

  const [state, dispatch] = useReducer(reducer, [{ color: false, value: '' }])

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

  const DrawerFormatter = ( trans ) => {
    const splitedtrans = trans.split(' ');
    const formatedtrans = splitedtrans.map(obj => {
      let helper = vformcheck['conv'].filter(subobj => subobj["coincidence"].includes(obj)).map(filtered => {
        return { color: true, value: filtered.result }
      })
      if (Object.keys(helper).length > 0 ) return helper
      return {color: false, value: obj }
    })
    dispatch(formatedtrans.flat())
  }

  const InfProces = ( trans ) => {
// Package from Mexico leaves June 12, 2022 at 1:00 p.m. to Monterrey on July 14, 2022 at 9:00 a.m.
// 
    console.log(trans)
    const splitedtrans = trans["transcription"].split(' ');
    console.log(splitedtrans)
    if ( formVal.input1 === '' && splitedtrans.includes('from')) {
      let city = splitedtrans[splitedtrans.lastIndexOf('from') + 1];
      vformcheck['citys'].filter(filt => filt["coincidence"].includes(city)).map(obj => {
          setFormVal(formVal => ({...formVal, input1: obj["correct"] })) })
    }
    if ( formVal.input2 === '' && splitedtrans.includes('to') ) {
      let city = splitedtrans[splitedtrans.lastIndexOf('to') + 1];
      vformcheck['citys'].filter(filt => filt["coincidence"].includes(city)).map(obj => {
          setFormVal(formVal => ({...formVal, input2: obj["correct"] })) })
    }
    if ( formVal.date1 === '' ) return console.log("")
    if ( formVal.date2 === '' ) return console.log("date 2 esta vacio")
    if ( formVal.time1 === '' ) return console.log("time 1 esta vacio")
    if ( formVal.time2 === '' ) return console.log("time 2 esta vacio")
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
            DrawerFormatter(res.transcription)
          }
          if (res.isFinal === true) {
            InfProces(res)
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

  return (
    <>
      <section id="DemoFFSection">
        <form id="DemoFFGrid">
          <label id="DFG1">
            <p>Pick up location</p>
            <input type="text" className="" value={formVal.input1} readOnly></input>
          </label>
          <label id="DFG2">
            <p>Drop off location</p>
            <input placeholder="Same as pick up location" type="text" value={formVal.input2} readOnly></input>
          </label>
          <div id="DFG3">
            <div className="off">
              <label>Pick up Date</label>
              <div className="inputs">
                <input type="date" value={formVal.date1} readOnly></input>
                <input type="time" value="08:00" readOnly></input>
              </div>
            </div>
            <div className="off">
              <label>Drop off Date</label>
              <div className="inputs">
                <input type="date" value="2022-09-29" readOnly></input>
                <input type="time" value="13:00" readOnly></input>
              </div>
            </div>
          </div>
          <button type="submit" id="dffsbtn">
            Search
          </button>
        </form>
      </section>
      <div id="vffnmicro" onClick={() => run()}>
        <NMicrophone state={!isRecording} />
      </div>
      <NeuriDrawer
        props={{
          transcription: state,
          position: "top-left",
          state: !isRecording,
        }}
      />
    </>
  );
};
export default VoiceFormFill;
