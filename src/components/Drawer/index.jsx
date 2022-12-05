import './drawer.style.scss'

const NeuriDrawer = ({ props }) => {
  const Position = () => {
    if ( props?.position === false ) return 'ndslave'
    if ( props.position === 'top-left' ) return 'ndtop-left'
    if ( props.position === 'top' ) return 'ndtop'
    if ( props.position === 'top-right' ) return 'ndtop-right'
    if ( props.position === 'center-left' ) return 'ndcenter-left'
    if ( props.position === 'center' ) return 'ndcenter'
    if ( props.position === 'center-right' ) return 'ndcenter-right'
    if ( props.position === 'bottom-left' ) return 'ndbottom-left'
    if ( props.position === 'bottom' ) return 'ndbottom'
    if ( props.position === 'bottom-right' ) return 'ndbottom-right'
  }

  const NDConfig = {
    transcription: props?.transcription ? props.transcription : 'No transcription',
    position: Position()
  }
  
  return(
    <div id="ndrawercont" className={`${NDConfig.position}`}>
      <p>{NDConfig.transcription}</p>
    </div>
  )
}

export default NeuriDrawer