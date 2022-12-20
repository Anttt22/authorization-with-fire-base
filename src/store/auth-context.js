import React, { useState, useEffect, useCallback } from "react";

var logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (props) => { },
    logout: () => { },
})

const calculateRemainingTime=(expirationTime)=>{
    const currentTime=new Date().getTime();
    const adjExpirationTime=new Date(expirationTime).getTime();
     
    const remainingDuration=adjExpirationTime-currentTime;
    return remainingDuration
}

const retrieveStoredToken = ()=>{
    const storedToken= localStorage.getItem('token');
    const storedExpirationDate=localStorage.getItem('expirationTime')
    
    const remaininTime=calculateRemainingTime(storedExpirationDate)
    if (remaininTime<=60000){
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null;
    }
    return {
        duration: remaininTime,
        token:storedToken
    };
}


export const AuthContextProvider = (props) => {
    const tokenData=retrieveStoredToken();
    let initialToken;
    if(tokenData){
        initialToken=tokenData.token;
    }
    
    const [token, setToken] = useState(initialToken)

    const userIsLoggedIn = !!token;

    const  LoggedOutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        if(logoutTimer){
            clearTimeout(logoutTimer)
        }
    },[]);

    const LoggedInHandler = (token, expirationTime) => {
        localStorage.setItem('token', token)
        localStorage.setItem('expirationTime', expirationTime)
        setToken(token)
        const remainingTime =calculateRemainingTime(expirationTime)
        logoutTimer=setTimeout(LoggedOutHandler, remainingTime )

    };

    useEffect(()=>{
        if(tokenData){
            console.log(tokenData.duration)
            logoutTimer=setTimeout(LoggedOutHandler, tokenData.duration )

        }
    },[tokenData, LoggedOutHandler])

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: LoggedInHandler,
        logout: LoggedOutHandler,
    }


    return <AuthContext.Provider value={contextValue}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext;