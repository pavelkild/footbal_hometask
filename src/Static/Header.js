import logoImg from '../images/logo.png';  
import { NavLink } from 'react-router-dom';
import './Header.css';
import NavigationLinks from './NavigationLinks';

function Header(){
    return (
        <header id="header">
            <div className="container">
                <div className="row">
                    <NavLink to="/" className="brick logoLink"><img className='logoImage' src={logoImg} alt={process.env.REACT_APP_SITE_TITLE} /></NavLink>
                    <NavigationLinks />
                </div>
            </div>
        </header>
    );
}

export default Header;