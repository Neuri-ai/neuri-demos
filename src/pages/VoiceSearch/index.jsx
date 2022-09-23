import './style.css';

const VoiceSearch = () => {
  return (
    <div className="container">
      <form className="bar-search">
        <input type="search" placeholder="Search..."></input>
        <button type="submit" className="search-iconbutton">Search</button>
      </form>

    </div>
  )
}
export default VoiceSearch