import { useState } from 'react'
import { Microphone } from 'helpers/iconscall'
import './Microphone.style.scss'

const Positions = ['top-left', 'top', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom', 'bottom-right', 'slave'];

const NeuriMicro = ({ state, options }) => {
  const sizedog = () => {
    if (options?.size) {
      if (options.size === 'auto') return '100%'
      return options.size
    }
    return '70px'
  }

  const positiondog = () => {
    if ( !options?.position ) return 'slave'
    if ( Positions.includes(options.position) ) return options.position
    return 'slave'
  }

  const imgtest = () => {
    if (options?.custom === undefined) return ''
    return options.custom.sbyimg
  }

  const Microcfg = {
    state: state ? 'active' : '',
    position: positiondog(),
    size: sizedog(),
    custom: {
      sbyimage: imgtest(),
      actimage: imgtest(),
    }
  }

  const NeuriDefaultStyle = () => {
    return (
      <div id="nmicrocontainer" className={`${Microcfg.position}`} style={{ width: `${Microcfg.size}` }}>
        <div id="nmicropos">
          <div id="nmicrosubcontainer" className={`${Microcfg.state}`}>
            <div id="nml1" className={`${Microcfg.state}`}></div>
            <div id="nml2" className={`${Microcfg.state}`}><Microphone /></div>
            <div id="nml3" className={`${Microcfg.state}`}></div>
            <div id="nml4" className={`${Microcfg.state}`}></div>
            <div id="nml5" className={`${Microcfg.state}`}></div>
          </div>
        </div>
      </div>
    )
  }

  const NeuriPartialCustom = () => {
    const NConfig = {
      style: options?.Bcolors ? 'custom' : 'default',
      image: {
        standby: options?.SbyImage ? 'custom' : 'default',
        active: options?.SbyImage ? 'custom' : 'default'
      },
      animation: options?.Animation ? 'custom' : 'default'
    }

    const CustomBase = () => {
      return (
        <></>
      )
    }

    return (
      <div id="nmicrocontainer" className={`${Microcfg.position}`} style={{ width: `${Microcfg.size}` }}>
        <div id="nmicropos">
          <div id="nmicrosubcontainer" className={`${Microcfg.state}`}>
            {NConfig.style === 'custom'
              ? <CustomBase />
              : <div id="nml1" className={`${Microcfg.state}`}></div>
            }
            <div id="nml2" className={`${Microcfg.state}`}><Microphone /></div>
            <div id="nml3" className={`${Microcfg.state}`}></div>
            <div id="nml4" className={`${Microcfg.state}`}></div>
            <div id="nml5" className={`${Microcfg.state}`}></div>
          </div>
        </div>
      </div>
    )
  }

  const NeuriCustom = () => { }
