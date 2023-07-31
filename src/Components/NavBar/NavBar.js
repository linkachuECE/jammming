import React from "react";
import navBarStyles from "./navBar.module.css"

export default function NavBar(){
    return (
        <div className={navBarStyles.navBar}>
            <h1>Jamming</h1>
        </div>
    );
}