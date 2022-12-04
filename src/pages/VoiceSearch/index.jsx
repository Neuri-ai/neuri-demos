import axios from "axios";
import { useState } from "react";
import NeuriMicro from "../../components/Microphone";
import './voicesearch.style.scss'

const VoiceSearch = () => {
  const ApiKey = 'AIzaSyApybNAog7h8xSuCgP46mfoBEY5brVMXK8';
  const CxKey = '912126383dc3f4c47';
  const [value, setValue] = useState('');
  const [fData, setFData] = useState([])

  const FetchData = () => {
    axios.get(` https://www.googleapis.com/customsearch/v1?key=${ApiKey}&cx=${CxKey}&q=${value}`).then(data => {
      setFData(data.data.items)
      console.log(data.data.items)
    }).catch(error => {
      console.log(error)
    })
  }
  return (
    <>
      <div id="searchdiv">
        <input type='text' value={value} onChange={(e) => setValue(e.currentTarget.value)}></input>
        <div id="voicesearchmicro" onClick={() => FetchData()}>
          <NeuriMicro state={false} options={{ size: '100%'}} />
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
    </>
  )
}
export default VoiceSearch