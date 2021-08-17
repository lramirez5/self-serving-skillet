import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

export function NavbarComponent() {
    return (
        <div>
            <div id="nav-menu">
                <div id="nav-logo">
                    <a href="https://www.youtube.com/channel/UCb8xPiMtYUox6rk4ONjSCdg" target="_blank" rel="noreferrer"><img src="https://yt3.ggpht.com/ytc/AAUvwngy3103R0HdhHNVoLjs9ecQwmBqPMQ7t1nF6LDA=s176-c-k-c0x00ffffff-no-rj" alt="Watch Self Serving Skillet on Youtube" /></a>
                    <div id="nav-title">Self Serving Skillet</div>
                </div>
                <div id="nav-main">
                    <button className="nav-std-btn" tabIndex='-1'><Link to='/'>Home</Link></button>
                    <button className="nav-std-btn" tabIndex='-1'><Link to='/recipes'>Food</Link></button>
                    <button className="nav-std-btn" tabIndex='-1'><Link to='/drinks'>Drink</Link></button>
                    <div className="nav-drop-btn" id="nav-menu-more">
                        <button id="nav-more-btn" >More</button>
                        <div id="nav-dropdown" className="nav-dropdown-content">
                            <Link to='/theory'>Cooking Theory</Link>
                            <Link to='/essentials'>Kitchen Essentials</Link>
                            <Link to='/techniques'>Technique Tuesdays</Link>
                        </div>
                    </div>
                    <button className="nav-std-btn" tabIndex='-1' id="nav-contact-btn"><Link to='/contact'>Contact</Link></button>
                </div>
            </div>
            <div id="nav-buffer"></div>
        </div>
    )
}