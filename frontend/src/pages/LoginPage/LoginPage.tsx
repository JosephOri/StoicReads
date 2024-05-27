import React,{ useState } from 'react';
import Button from 'react-bootstrap/Button';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { Link,useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import './LoginPage.css';
import axios, { AxiosError,HttpStatusCode } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AUTH_LOGIN_URL } from '../../utils/constants';
import { allowCorsForAxios } from '../../utils/allowCorsForAxios';
import AuthTokens from '../../interfaces/AuthTokens';
import { saveTokens } from '../../services/auth.service';
import LoginFormData from '../../interfaces/LoginFormData';
import isEmailValidCheck from '../../utils/isEmailValidCheck';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { AUTH_GOOGLE_URL } from '../../utils/constants';


const LoginPage = () => {
  const navigate = useNavigate();

  const [loginFormData,setLoginFormData] = useState<LoginFormData>({ email: '', password: '' });

  const handleInputChange = (fieldName:string, value:string) => {
    setLoginFormData({ ...loginFormData, [fieldName]: value });
  };

  const isInputValidCheck = (email:string, password:string) => {
    if(!email || !password) {
      toast.error('Please fill in all fields');
      return false;
    }
    const isEmailValid = isEmailValidCheck(email);
    if(!isEmailValid) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  }
  
  
  const handleLoginSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    try{
      e.preventDefault();
      const { email, password } = loginFormData;
      const isInputValid = isInputValidCheck(email, password);
      if(!isInputValid) return;
      allowCorsForAxios(axios)
      const tokens = await axios.post(AUTH_LOGIN_URL, {email, password})
      saveTokens(tokens.data as AuthTokens);
      setLoginFormData({ email: '', password: '' });
      toast.success('Logged in successfully');
      navigate('/');
    } catch(err) {
        const error = err as AxiosError;
        const errorStatusCode = error.response?.status;
        console.log('error response', error.response);
        if(errorStatusCode === HttpStatusCode.BadRequest) {
          toast.error('Please fill in all fields');
        } else if(errorStatusCode === HttpStatusCode.Unauthorized) {
          toast.error('user was not found or password is incorrect');
        } else if(errorStatusCode === HttpStatusCode.InternalServerError) {
          toast.error('server error occurred, please try again later');
        }
    }
}

  const onGoogleLoginSuccess = async(credentialResponse: CredentialResponse) => {
    allowCorsForAxios(axios);
    const credential = credentialResponse.credential;
    const tokens = await axios.post(AUTH_GOOGLE_URL, {credential});
    saveTokens(tokens.data as AuthTokens);
    toast.success('Logged in with Google successfully');
    navigate('/');
  };

  const onGoogleLoginFailure = () => {
    console.log('google login failure');
    toast.error('Failed to login with Google');
  };

  return (
    <>
      <div className="container">
        <div className="form-container">
          <h2 className="title">Login</h2>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3 form-group" controlId="formBasicEmail">
              <Form.Label className="form-label">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="form-control"
                value={loginFormData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
              <Form.Label className="form-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="form-control"
                value={loginFormData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-primary">
              Submit
            </Button>
            <div className="text-center pt-3">Or</div>
            {/* <GoogleLoginButton className="mt-5 mb-3" /> */}
            <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure}></GoogleLogin>
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;