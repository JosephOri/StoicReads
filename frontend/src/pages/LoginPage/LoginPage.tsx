import React,{ useState } from 'react';
import Button from 'react-bootstrap/Button';
import { GoogleLoginButton } from 'react-social-login-buttons';
import Form from 'react-bootstrap/Form';
import './LoginPage.css';
import axios, { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AUTH_LOGIN_URL } from '../../constants/constants';
import { Link } from 'react-router-dom';
import { allowCorsForAxios } from '../../utils/allowCorsForAxios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);    
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  const handleLoginSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    try{
    e.preventDefault();
    if(!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    allowCorsForAxios(axios)
    const tokens =await axios.post(AUTH_LOGIN_URL, {email, password})
    console.log(tokens)
    setEmail('');
    setPassword('');
    } catch(err) {
      const error = err as AxiosError;
      if(error.response?.status === 400) {
        toast.error('Please fill in all fields');
      } else if(error.response?.status === 401) {
        toast.error('user was not found or password is incorrect');
      } else if(error.response?.status === 500) {
        toast.error('server error occurred, please try again later');
      }
    }
}

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
                value={email}
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
              <Form.Label className="form-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="btn-primary">
              Submit
            </Button>
            <div className="text-center pt-3">Or</div>
            <GoogleLoginButton className="mt-3 mb-3" />
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