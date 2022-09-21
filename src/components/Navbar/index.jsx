import './Navbar.css';
import { Link } from 'react-router-dom';
import Logo from 'images/Logo.png'

const Navbar = ({ demos }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex" to="/">
                    <img src={Logo} alt="Neuri" width="30" height="30"/>

                    <span className='ms-2'>Neuri</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                        {/*Show on mobile */}
                        {
                            demos.map((demo, index) => <li className="nav-item d-block d-sm-none" key={index}> <a className="nav-link" href={demo.path}>{demo.name}</a></li>)
                        }

                        {/*Show on Desktop */}
                        <li className="nav-item dropdown d-none d-sm-block">
                            <button className="btn btn-outline-primary" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Demos
                            </button>
                            <ul className="dropdown-menu" style={{ top: "100%", left: "0%", transform: "translateX(-50%)" }}>
                                {
                                    demos.map((demo, index) => <li className="dropdown-item" key={index}> <Link className="nav-link" to={demo.path}>{demo.name}</Link></li>)
                                }
                            </ul>
                        </li>
                    </ul>

                </div>
            </div>
        </nav>
    )
};

export default Navbar;