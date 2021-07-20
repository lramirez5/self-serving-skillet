import React, { useState, useEffect } from 'react';
import { HeaderComponent } from './HeaderComponent';
import { Storage } from 'aws-amplify';

export function HomepageComponent() {

    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        const image1 = await Storage.get('homepage0.jpg')
        const image2 = await Storage.get('homepage1.jpg')
        setImages([image1, image2]);
    }

    return (
        <div>
            <HeaderComponent />
            <div>
                <div>
                    <button onClick={function(){document.location.href = document.location.href+"recipes"}}>Food</button>
                </div>
                <div>
                    <button onClick={function(){document.location.href = document.location.href+"drinks"}}>Drink</button>
                </div>
                <div>
                    <button onClick={function(){document.location.href = document.location.href+"blog"}}>Blog</button>
                </div>
                <img src={images[0]} style={{ width: 400 }} alt="Just testing." />
                <img src={images[1]} style={{ width: 400 }} alt="Just testing." />
            </div>
        </div>
    )
}