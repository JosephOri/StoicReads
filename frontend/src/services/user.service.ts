import {User} from "../interfaces/User"
import { CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { AUTH_GOOGLE_URL } from "../utils/constants";

export const googleLogin = (credentialResponse: CredentialResponse) => {
    return new Promise<User>(async (resolve, reject)  => {
      console.log('credentialResponse', credentialResponse);
      try{
        const response = await axios.post<User>(AUTH_GOOGLE_URL, credentialResponse.credential);
        console.log('google credentials', credentialResponse.credential);
        resolve(response.data);
      
      } catch(err: any) {
        console.log('error response', err.message);
        reject(err);
      }
    });
  };