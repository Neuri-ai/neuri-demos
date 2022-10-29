import Icons from 'helpers/iconscall';
import { useEffect } from 'react';
import { gsap } from "gsap";
import './style.css';
import { useState } from 'react';

const initialtexttest = [
  {
    message: "Hola esto es una prueba",
    pos: "izq"
  },
  {
    message: "A que bueno papu",
    pos: "der"
  },
  {
    message: "Panchito se la come",
    pos: "izq"
  },
  {
    message: "Entera y doblada ajajaja",
    pos: "izq"
  },
  {
    message: "Santa purisima",
    pos: "der"
  },
]

const VoiceSearch = () => {
  const [microText, setText] = useState('jj')
  useEffect(() => {
    let tl = gsap.timeline()
    tl.fromTo(".dvscontainer",
      {
        opacity: 0,
        scale: 0.9,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
      });
    tl.fromTo(".chatinput",
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
      });
  }, [])

  return (
    <div className="dvscontainer">
      <div className="dvschatcontainer">
        {initialtexttest.map((index, key) => {
          return (
            <div className={`chat ${index.pos}`} key={key}>
              {index.pos === "izq" && <img src={Icons.Neuri}></img>}
              <p className={index.pos}>{index.message}</p>
              {index.pos === "der" && <img src={Icons.User}></img>}
            </div>
          )
        })}
      </div>
      <div className="chatinput">
        <p>{microText}</p>
        <img src={Icons.Microphone} alt="microphone" />
      </div>
    </div>
  )
}
export default VoiceSearch