import NavigationLinks from './NavigationLinks';
import './Footer.css';

function Footer () {
    return (
        <footer id="footer">
            <div className="container">
                <div className="row">
                    <div className="col-6 pushLeft">
                        <h4 className='nomargin'>{process.env.REACT_APP_SITE_TITLE}, {(new Date()).getFullYear()}</h4>
                    </div>
                    <div className="col-6 pushLeft">
                        <b className="navTitle brick">Навигация: </b>
                        <NavigationLinks />
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;