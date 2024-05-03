import React,{ useState } from 'react';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { GoogleLoginButton } from 'react-social-login-buttons';
import Form from 'react-bootstrap/Form';
import './LoginPage.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AUTH_LOGIN_URL } from '../../constants/constants';

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
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'; 
    const tokens =await axios.post(AUTH_LOGIN_URL, {email, password})
    console.log(tokens)
    setEmail('');
    setPassword('');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('No such user found, please check your credentials');
      }
      if (error.response && error.response.status === 500) {
        toast.error('Server error, please try again later');
      } 
  }
}

  return (
    <div>
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
              Don't have an account? <Nav.Link href="/signup">Sign up</Nav.Link>
            </p>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;