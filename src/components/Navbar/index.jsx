import './navbar.style.scss';
import { Link } from 'react-router-dom';
import Logo from 'images/Logo.svg'

const Navbar = ({ demos }) => {
  return (
    <nav id='dnnavbarcontainer'>
      <div id="dnnavbar">
        <Link to="/">
          <img src={Logo} alt="Neuri" className='neurilogo' />
        </Link>
        <div id="demo-menu-dropdown">
          <button id="demo-menu">Demos</button>
          <ul className="demoslist">
            {
              demos.map((demo, index) => <li key={index}> <Link className="nav-link" to={demo.path}>{demo.name}</Link></li>)
            }
          </ul>
        </div>
      </div>
    </nav >
  )
};

export default Navbar;