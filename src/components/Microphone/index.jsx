
import { useState } from 'react'
import { MicroBase, Microphone } from '../../helpers/iconscall'
import './Microphone.style.scss'

const NMicrophone = ({ state }) => {
  return (
    <div id="nmicrocontainer" className={`${state}`}>
      <div id="nml1" className={`${state}`}><MicroBase /></div>
      <div id="nml2" className={`${state}`}><Microphone /></div>
      <div id="nml3" className={`${state}`}></div>
      <div id="nml4" className={`${state}`}></div>
      <div id="nml5" className={`${state}`}></div>
    </div>
  )
}
export default NMicrophone