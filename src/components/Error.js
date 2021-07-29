import { Link } from "react-router-dom";
import { NavbarComponent } from "./NavbarComponent";

export function Error() {
    return (
        <div>
            <NavbarComponent />
            <div style={{ margin: "120px auto", color: 'rgb(230,180,180)', background: 'rgba(0,0,0,.8)', textAlign: 'center', padding: '40px' }}>
                <h1>Resource not found!</h1>
                <h2><Link to='/'>Return Home</Link></h2>
            </div>
        </div>
    )
}