import { Link } from "react-router-dom";

export function Error() {
    return (
        <div style={{margin:"auto"}}>
            <h1>Resource not found!</h1>
            <h2><Link to='/'>Return Home</Link></h2>
        </div>
    )
}