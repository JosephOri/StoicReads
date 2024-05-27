import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

// const clientID : string = process.env.REACT_APP_Google_OAuth_Client_ID;
// console.log(process.env);
// !!! I cant use the env variables in the frontend, so I have to hardcode the clientID
ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='369022282703-7gjvbrufu0ge489a7uhnqugbcuk7muf5.apps.googleusercontent.com'>
      <React.StrictMode>
    <App />
  </React.StrictMode>,
  </GoogleOAuthProvider>
)
