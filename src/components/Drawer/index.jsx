import './drawer.style.scss'

const Positions = ['top-left', 'top', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom', 'bottom-right', 'slave'];

const NeuriDrawer = ({ props }) => {
  const Position = () => {
    if ( !props?.position ) return 'ndslave'
    if ( Positions.includes(props.position) ) return `nd${props.position}`
    return 'ndslave'
  }

  const State = () => {
    if ( props?.state && props.state === true ) return 'show'
    return 'hide'
  }

  const NDConfig = {
    transcription: props?.transcription ? props.transcription : [''],
    position: Position(),
    state: State()
  }
  
  return(
    <div id="ndrawercont" className={`${NDConfig.position} ${NDConfig.state}`}>
      { 
        NDConfig.transcription.map((object, key) => {
        return (
          <p key={key} className={ object.color ? 'color' : '' }>{object.value}</p>
        )})
      }
    </div>
  )
}

export default NeuriDrawer