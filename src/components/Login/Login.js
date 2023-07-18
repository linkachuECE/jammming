import React from "react";

function Login(props){

    return (
        <div className="login">
            <button onClick={props.onClick}>Login</button>
        </div>
    );
}

export default Login;