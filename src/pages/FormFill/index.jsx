import './style.css';

const FormFill = () => {
    return (
        <form class="search-container">
            <input type="text" id="search-bar" placeholder="What can I help you with today?"/>
            <button>
                <img class="search-icon" src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"/>
            </button>
        </form>
    )
}
export default FormFill