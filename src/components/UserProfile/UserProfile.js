import React from "react";

function UserProfile(props){
        return (
                <div className="userProfile">
                        <h1>{props.user.name}</h1>
                        <h3>{props.user.email}</h3>
                        <h3>{props.user.country}</h3>
                </div>
        );
}

export default UserProfile;