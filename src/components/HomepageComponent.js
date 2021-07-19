import React from 'react';
import { HeaderComponent } from './HeaderComponent';

export function HomepageComponent() {
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
            </div>
        </div>
    )
}