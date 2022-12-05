import { useState, useEffect } from "react";
import SWApi from "helpers/StarWarsApi/StarWarsApi.json";
import NeuriMicro from "components/Microphone";
import { Icons } from "helpers/iconscall";
import custommicro from "../../assets/icons/microfono.png";
import "./voicefilter.style.scss";
import { gsap, Power3 } from "gsap";
import NeuriDrawer from "components/Drawer";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

const API_KEY = "3oHB_roFKsI_sjxzjE_C1CeNFxpvhr57PQ";
const SAMPLE_RATE = 16000;
const LANG = "en-us";
const URL = `wss://api.neuri.ai/api/apha/v1/services/audio/realtime?apikey=${API_KEY}&sample_rate=${SAMPLE_RATE}&lang=${LANG}`;
let recorder;
let socket;

const VoiceFilter = () => {
  const [SValue, setSValue] = useState(SWApi["initialFilter"]);
  const DataBase = [...SWApi["people"]];
  const [filtered, setFiltered] = useState(
    DataBase.sort(() => Math.random() - 0.5)
  );
  const [trans, setTrans, transRef] = useState([{ color: false, value: 'Listening...' }]);
  const [isRecording, setRecording] = useState(true);

  useEffect(() => {
    let tl = gsap.timeline();
    let child = document.querySelectorAll(".dpfselect");
    tl.fromTo(
      "#dpfoptions1",
      {
        scale: 0.5,
        opacity: 0,
      },
      { scale: 1, opacity: 1 }
    );
    tl.to(
      child[0],
      { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut },
      "<0.1"
    );
    tl.to(
      child[1],
      { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut },
      "<0.1"
    );
    tl.to(
      child[2],
      { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut },
      "<0.1"
    );
    tl.to(
      child[3],
      { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut },
      "<0.1"
    );
    tl.to(
      child[4],
      { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut },
      "<0.1"
    );
    tl.to(
      child[5],
      { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut },
      "<0.1"
    );
    tl.fromTo(
      "#dpfcardscontainer",
      {
        opacity: 0,
      },
      { opacity: 1 }
    );
    tl.fromTo(
      "#microdiv",
      {
        opacity: 0,
        scale: 1.5,
      },
      { opacity: 1, scale: 1 }
    );
  }, []);

  const [ddownvalue, setDdownValue] = useState("type");
  const filteropt = SWApi["filter-options"];

  const Dropselection = async ( opt1, opt2, props ) => {
    let newSValue = {};
    console.log(props)
    if( props !== undefined ) { props.forEach( element => {
      if ( element.name === 'films' && !filteropt.films.includes( element.value ) ) return console.log('te pille esponja')
      if ( element.name === 'gender' && !filteropt.gender.includes( element.value ) ) return console.log('te pille esponja')
      if ( element.name === 'homeworld' && !filteropt.homeworld.includes( element.value ) ) return console.log('te pille esponja')
      if ( element.name === 'species' && !filteropt.species.includes( element.value ) ) return console.log('te pille esponja')
      if ( element.name === 'hairColor' && !filteropt.hairColor.includes( element.value ) ) return console.log('te pille esponja')
      if ( element.name === 'eyeColor' && !filteropt.eyeColor.includes( element.value ) ) return console.log('te pille esponja')
      newSValue = { ...SValue, ...newSValue, [element.name]: element.value }
    }) }
    if ( Object.keys(newSValue).length <= 0) {newSValue = SWApi["initialFilter"]}
    console.log(newSValue)
    if( props === undefined ) { newSValue = { ...SValue, [opt1]: opt2 } }
    
    let newFilter = DataBase.sort(() => Math.random() - 0.5);

    if (newSValue.films !== "any") {
      newFilter = newFilter.filter((obj) => {
        if (obj.films === undefined) return null;
        if (obj.films.includes(newSValue.films) === true) {
          return obj;
        }
      });
    }
    if (newSValue.gender !== "any")
      newFilter = newFilter.filter((obj) => {
        if (obj.gender === undefined) return null;
        if (obj.gender.includes(newSValue.gender) === true) {
          return obj;
        }
      });
    if (newSValue.homeworld !== "any")
      newFilter = newFilter.filter((obj) => {
        if (obj.homeworld === undefined) return null;
        if (obj.homeworld.includes(newSValue.homeworld) === true) {
          return obj;
        }
      });
    if (newSValue.species !== "any")
      newFilter = newFilter.filter((obj) => {
        if (obj.species === undefined) return null;
        if (obj.species.includes(newSValue.species) === true) {
          return obj;
        }
      });
    if (newSValue.hairColor !== "any")
      newFilter = newFilter.filter((obj) => {
        if (obj.hairColor === undefined) return null;
        if (obj.hairColor.includes(newSValue.hairColor) === true) {
          return obj;
        }
      });
    if (newSValue.eyeColor !== "any") {
      newFilter = newFilter.filter((obj) => {
        if (obj.eyeColor === undefined) return null;
        if (obj.eyeColor.indexOf(newSValue.eyeColor) !== -1) {
          return obj
        }
        return obj
      });

    }
    setSValue(newSValue);
    setFiltered(newFilter);
  };

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
          let sublist = [];
          if (res.isFinal === false) {
            sublist = res.entities.map(element => {
              if ( element.name === 'hairColor' ) return { color: true, value: element.value, name: element.name }
              if ( element.name === 'species' ) return { color: true, value: element.value, name: element.name }
              if ( element.name === 'gender' ) return { color: true, value: element.value, name: element.name }
              return { color: false, value: element.value, name: element.name }
            });
            setTrans(sublist)
          }
          if (res.isFinal === true) {
            sublist = res.entities.map(element => {
              if ( element.name === 'hairColor' ) return { color: true, value: element.value, name: element.name }
              if ( element.name === 'species' ) return { color: true, value: element.value, name: element.name }
              if ( element.name === 'gender' ) return { color: true, value: element.value, name: element.name }
              return { color: false, value: element.value, name: element.name }
            });
            Dropselection( '', '', sublist )
          }
        } catch (e) {
          console.log(e);
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
        setTrans([{ color: false, value: 'Listening...' }])
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
    <section id="sectionvfilter">
      <div id="dpfcontainer">
        <div id="dpfoptions1">
          <div
            tabIndex={2}
            className="dpfselect"
            onClick={() => setDdownValue("films")}
          >
            {SValue.films === "any" ? (
              <>
                {" "}
                <p className="pstandby">Films</p>
                <img
                  className="imgstandby"
                  src={Icons.Arrow}
                  alt="arrow"
                />{" "}
              </>
            ) : (
              <>
                {" "}
                <p className="pshow">{SValue.films}</p>
                <img
                  className="imgshow"
                  src={Icons.X}
                  alt="x"
                  onClick={() => Dropselection("films", "any")}
                />{" "}
              </>
            )}
          </div>
          {SWApi["mapfilters"]["people"].map((item, key) => {
            return (
              <div
                key={key}
                tabIndex={2}
                className="dpfselect"
                onClick={() => setDdownValue(item)}
              >
                {SValue[item] === "any" ? (
                  <>
                    {" "}
                    <p className="pstandby">
                      {item === "gender" && "Gender"}
                      {item === "homeworld" && "Home World"}
                      {item === "species" && "Species"}
                      {item === "hairColor" && "Hair Color"}
                      {item === "eyeColor" && "Eye Color"}
                    </p>
                    <img className="imgstandby" src={Icons.Arrow} alt="arrow" />{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <p className="pshow">{SValue[item]}</p>
                    <img
                      className="imgshow"
                      src={Icons.X}
                      alt="x"
                      onClick={() => Dropselection(item, "any")}
                    />{" "}
                  </>
                )}
              </div>
            );
          })}
          <div className={`dpfddlist`}>
            {filteropt[ddownvalue].map((item, key) => {
              return (
                <p key={key} onClick={() => Dropselection(ddownvalue, item)}>
                  {item}
                </p>
              );
            })}
          </div>
        </div>
        <div id="dpfcardscontainer">
          {filtered.map((item, key) => {
            return (
              <div className="pfcards" key={key}>
                <div className="dpfimage">
                  <img src={item.image} alt="ilustrative" />
                </div>
                <div className="pfinfo">
                  {item.name !== undefined && (
                    <div className="pfseparator">
                      <p>Name:</p>
                      <p>{item.name}</p>
                    </div>
                  )}
                  {item.gender !== undefined && (
                    <div className="pfseparator">
                      <p>Gender:</p>
                      <p>{item.gender}</p>
                    </div>
                  )}
                  {item.height !== undefined && (
                    <div className="pfseparator">
                      <p>Height:</p>
                      <p>{item.height} cm</p>
                    </div>
                  )}
                  {item.homeworld !== undefined && (
                    <div className="pfseparator">
                      <p>Home world:</p>
                      <p>{item.homeworld}</p>
                    </div>
                  )}
                  {item.population !== undefined && (
                    <div className="pfseparator">
                      <p>Population:</p>
                      <p>{item.population}</p>
                    </div>
                  )}
                  {item.gravity !== undefined && (
                    <div className="pfseparator">
                      <p>Gravity:</p>
                      <p>{item.gravity}</p>
                    </div>
                  )}
                  {item.terrain !== undefined && (
                    <div className="pfseparator">
                      <p>Terrain:</p>
                      <p>{item.terrain}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        id="microdiv"
        onClick={() => run()}
      >
        <NeuriMicro state={!isRecording} />
      </div>
      <div id="drawerdiv">
        <NeuriDrawer props={{ transcription: trans, state: !isRecording }} />
      </div>
    </section>
  );
};
export default VoiceFilter;
