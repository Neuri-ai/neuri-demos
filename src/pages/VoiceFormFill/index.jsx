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

  const DateFormatter = ( trans, pos ) => {
    // preparando el Mes
    let month = []
    trans.forEach(elm => {
      let newMonth = vformcheck['month'].filter(fil => fil['coincidence'].includes(elm))
      if(Object.keys(newMonth).length > 0) {
        newMonth.map(obj => {
          trans.splice(trans.lastIndexOf(elm), 1); month.push(obj['number']) })
      }
    })

    // preparando el dia
    console.log('trans en dia ->', trans)
    let day = [];
  
    trans.forEach( elm => {
      let dog = vformcheck['date-permited'].filter(fil => fil['coincidence'].includes(elm)).map(obj => {
        return obj
      })
      if (Object.keys(dog).length > 0) {
        // console.log("dog ->", dog)
      } else {
        trans.splice(trans.lastIndexOf(elm), 1)
      }
    })

    if(Object.keys(trans).length <= 2){
      let shifted = trans.join(" ")
      let newDay = vformcheck['day'].filter(fil => fil['coincidence'].includes(shifted))
      newDay.map(obj => day.push(obj['number']))
      let year = new Date().getFullYear()
      let NewDate = [year, ...month, ...day].join('-')
      return setFormVal(formVal => ({...formVal, [pos]: NewDate}))
    }

    let shifted;
    if ( trans[0] === "twenty" || trans[0] === "twentieth" ) {
      let checker = [trans[0], trans[1]].join(" ")
      let whatchdog = vformcheck['day'].filter(fil => fil['coincidence'].includes(checker))
      whatchdog.map(obj => obj?.number ? shifted = trans.splice(0, 2).join(" ") : null )
    }

    if ( (trans[0] === "thirty" || trans[0] === "thirtieth") && (trans[1] === "one" || trans[1] === "first") ) { 
      shifted = trans.splice(0, 2).join(" ") }

    if ( Object.keys(shifted).length <= 0 ) { 
      shifted = trans.splice(0, 1).join(" ") }

    let newDay = vformcheck['day'].filter(fil => fil['coincidence'].includes(shifted))
    newDay.map(obj => day.push(obj['number']))

    // preparando el año
    let year = []
    if(Object.keys(trans).length === 3){
      let one = []; let firstpart = trans.shift();
      let newOne = vformcheck['day'].filter(fil => fil['coincidence'].includes(firstpart))
      newOne.map(obj => one.push(obj['number']))
      let two = []
      let newTwo = vformcheck['day'].filter(fil => fil['coincidence'].includes([...trans].join(' ')))
      newTwo.map(obj => two.push(obj['number']))

      year = [...one, ...two].join('').split(' ')
    }
    if(Object.keys(trans).length > 3){
      return console.log('working on')
    }

    //adquiriendo date completo
    let NewDate = [year, ...month, ...day].flat().join('-')
    setFormVal(formVal => ({...formVal, [pos]: NewDate}))
  }

  const TimeFormatter = ( trans, pos ) => {
    // preparando hora
    let Hour = []; let timetype;
    if ( trans.includes('am') ) { timetype = trans.splice(trans.lastIndexOf('am'), 1) }
    if ( trans.includes('pm') ) { timetype = trans.splice(trans.lastIndexOf('pm'), 1) }

    if ( trans[0] === "twenty" ) {
      let checker = [trans[0], trans[1]].join(" ")
      let watchdog = vformcheck['hour'].filter(fil => fil['coincidence'].includes(checker))
      if ( Object.keys(watchdog).length > 0 ) {
        watchdog.map(obj => Hour.push(obj["num"]))
        trans.splice(0, 2)
      }
    }

    if ( Object.keys(Hour).length <= 0 ) {
      let hourshift = trans.shift();
      vformcheck['hour'].filter(fil => fil['coincidence'].includes(hourshift)).map(obj => Hour.push(obj['num']))
    }

    if ( Object.keys(trans).length <= 0 ) {
      let Time = [...Hour, "00"].join(":")
      return setFormVal(formVal => ({...formVal, [pos]: Time}))
    }

    if ( Object.keys(trans).length > 2 ) {
      trans.splice(2, Object.keys(trans).length - 2)
    }

    // preparando minutos
    let Minute = []; let min = trans.join(" ")
    vformcheck['min'].filter(fil => fil['coincidence'].includes(min)).map(obj => Minute.push(obj['num']))
    let Time = [...Hour, ...Minute].join(":")
    // console.log(`min: ${min}, Time: ${Time}`)
    setFormVal(formVal => ({...formVal, [pos]: Time}))
  }

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
    const splitedtrans = trans["transcription"].split(' ');

    if ( splitedtrans.includes('clear') ) return setFormVal(initialFormVal)

    // Location 1
    if ( Object.keys(formVal.input1).length <= 0 && splitedtrans.includes('location')) {
      splitedtrans.splice(splitedtrans.lastIndexOf('location'), 1)
      let index = splitedtrans.lastIndexOf('location');
      delete splitedtrans[index]
      let location = splitedtrans.filter(elm => elm).join(' ')
      setFormVal(formVal => ({...formVal, input1: location }))
    }

    // Date 1
    if ( Object.keys(formVal.date1).length <= 0 && splitedtrans.includes('date')) {
      splitedtrans.splice(splitedtrans.lastIndexOf('date'), 1)
      DateFormatter( splitedtrans, "date1" )
    }

    // Time 1
    if ( Object.keys(formVal.time1).length <= 0 && splitedtrans.includes('time')) {
      splitedtrans.splice(splitedtrans.lastIndexOf('time'), 1)
      TimeFormatter( splitedtrans, "time1" )
    }

    // Location 2
    if ( Object.keys(formVal.input2).length <= 0 && splitedtrans.includes('location') ) {
      splitedtrans.splice(splitedtrans.lastIndexOf('location'), 1)
      let index = splitedtrans.lastIndexOf('location');
      delete splitedtrans[index]
      let location = splitedtrans.filter(elm => elm).join(' ')
      setFormVal(formVal => ({...formVal, input2: location }))
    }

    // Date 2
    if ( Object.keys(formVal.date2).length <= 0 && splitedtrans.includes('date')) {
      splitedtrans.splice(splitedtrans.lastIndexOf('date'), 1)
      DateFormatter( splitedtrans, "date2" )
    }

    // Time 2
    if ( Object.keys(formVal.time2).length <= 0 && splitedtrans.includes('time')) {
      splitedtrans.splice(splitedtrans.lastIndexOf('time'), 1)
      TimeFormatter( splitedtrans, "time2" )
    }
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
        <h1>Rent a Car</h1>
        <form id="DemoFFGrid">

          <div id="pickup">
            <div className={`locationdiv ${formVal.input1 !== "" ? 'formcolor' : ''}`}>
              <p>Location</p>
              <input type="text" placeholder="Airport" className="" value={formVal.input1} readOnly></input>
            </div>
            <div className={`datediv ${formVal.date1 !== "" ? 'formcolor' : ''}`}>
              <p>Date</p>
              <input type="date" value={formVal.date1} readOnly></input>
            </div>
            <div className={`timediv ${formVal.time1 !== "" ? 'formcolor' : ''}`}>
              <p>Time</p>
              <input type="time" value={formVal.time1} readOnly></input>
            </div>
          </div>

          <div id="dropoff" className={`${(formVal.input1 !== "" && formVal.date1 !== "" && formVal.time1 !== "") ? '' : 'scale'}`}>
            <div className={`locationdiv ${formVal.input2 !== "" ? 'formcolor' : ''}`}>
                <p>Location</p>
                <input placeholder="Bus transport" type="text" value={formVal.input2} readOnly></input>
            </div>
            <div className={`datediv ${formVal.date2 !== "" ? 'formcolor' : ''}`}>
              <p>Date</p>
              <input type="date" value={formVal.date2} readOnly></input>
            </div>
            <div className={`timediv ${formVal.time2 !== "" ? 'formcolor' : ''}`}>
              <p>Time</p>
              <input type="time" value={formVal.time2} readOnly></input>
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
