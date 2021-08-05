import React, { useState, useEffect } from 'react';
//import { HeaderComponent } from './HeaderComponent';
import { Storage } from 'aws-amplify';
import '../styles/Homepage.css';
import board from '../images/sssboard.jpg';
import { VideoListComponent } from './VideoListComponent';
import { Link } from 'react-router-dom';
import { handleHomepageScroll } from '../scripts/handleHomepageScroll';

export function HomepageComponent() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        window.addEventListener('scroll', handleHomepageScroll);
        fetchImages();
    }, []);

    async function fetchImages() {
        const image1 = await Storage.get('homepage0.jpg')
        const image2 = await Storage.get('homepage1.jpg')
        //const background = await Storage.get('background0.jpg')
        //console.log(background);
        //document.body.style.backgroundImage = ;
        //document.getElementById("container").style.backgroundImage = `url(${background})`;
        setImages([image1, image2]);
        //setBackground([background]);
    }

    return (
        <div>
            <div id="container">
                <div id="home-head">
                    <h1>Self Serving Skillet</h1>
                    <h4>Exploring the philosophy and technique of feeding yourself.</h4>
                </div>
                <div id="home-menu">
                    <div id="logo">
                        <a href="https://www.youtube.com/channel/UCb8xPiMtYUox6rk4ONjSCdg" target="_blank" rel="noreferrer"><img src="https://yt3.ggpht.com/ytc/AAUvwngy3103R0HdhHNVoLjs9ecQwmBqPMQ7t1nF6LDA=s176-c-k-c0x00ffffff-no-rj" alt="Watch Self Serving Skillet on Youtube" /></a>
                        <div id="menu-title">
                        </div>
                    </div>
                    <div id="menu-main">
                        <button className="std-btn" tabIndex='-1'><Link to='/recipes'>Food</Link></button>
                        <button className="std-btn" tabIndex='-1'><Link to='/drinks'>Drink</Link></button>
                        <div className="drop-btn" id="menu-more">
                            <button id="more-btn" >More</button>
                            <div id="menu-dropdown" className="dropdown-content">
                                <Link to='/theory'>Cooking Theory</Link>
                                <Link to='/essentials'>Kitchen Essentials</Link>
                                <Link to='/techniques'>Technique Tues.</Link>
                            </div>
                        </div>
                        <button className="std-btn" tabIndex='-1' id="contact-btn" onClick={function () { alert("Coming Soon") }}>Contact</button>
                    </div>
                </div>
                <div id="content">
                    <div id="subcontent1">
                        <div id="food-panel">
                            <h1><i className="arrow right-down"></i>Food</h1>
                            <p>A good recipe should be only a snapshot of your journey.</p>
                            <p>Learn what you like. Make it your own. Improve with time.<br /><br /></p>
                            <p><Link to="/recipes">Explore recipes <i className="arrow right"></i></Link></p>
                        </div>
                        <div id="drink-panel">
                            <h1>Drink<i className="arrow left-down"></i></h1>
                            <p>Whether as simple as opening a bottle, or as complex as opening several, a well paired beverage will heighten any meal.<br /><br /></p>
                            <p><Link to="/drinks">Explore recipes <i className="arrow right"></i></Link></p>
                        </div>
                        <img src={images[0]} id="foodimg" alt="Tasty food." />
                        <img src={images[1]} id="drinkimg" alt="Delicious drink." />
                    </div>
                    <div id="subcontent2">
                        <img src={board} alt="A cutting board." />
                        <div id="more-panels">
                            <div id="theory-panel">
                                <h1>Cooking Theory</h1>
                                <p><Link to='/theory'>Turn ideas into something delicious <i className="arrow right"></i></Link></p>
                            </div>
                            <div id="technique-panel">
                                <h1>Technique Tuesdays</h1>
                                <p><Link to='/essentials'>Hone your skills <i className="arrow right"></i></Link></p>
                            </div>
                            <div id="essentials-panel">
                                <h1>Kitchen Essentials for Every Skill Level</h1>
                                <p><Link to='/techniques'>Find your next kitchen gadget <i className="arrow right"></i></Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <VideoListComponent />
        </div>
    )
}