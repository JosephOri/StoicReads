import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import { AUTH_REGISTER_URL } from '../../constants/constants';
import axios, { AxiosError,HttpStatusCode } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './SignupPage.css'

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, username: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, confirmPassword: e.target.value });
  };

  const isFormDataValidCheck = () => {
    const { username, email, password, confirmPassword } = formData;
    const isAllFieldsFilled = username && email && password && confirmPassword;
    const isEmailValid = email.includes('@') && email.includes('.');
    const isUsernameValid = !username.includes(' ') && username.length > 3;
    if(!isUsernameValid) {
      toast.error('Username must be at least 4 characters long and cannot contain spaces');
      return false;
    }
    if(!isAllFieldsFilled) {
      toast.error('Please fill in all fields');
      return false;
    }
    if(password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if(password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if(!isEmailValid) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  }
  const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormDataValid = isFormDataValidCheck();
    if(!isFormDataValid) return;
    const { username, email, password } = formData;
    try {
      const response = await axios.post(AUTH_REGISTER_URL, { username, email, password });
      console.log(response);
      toast.success('User created successfully');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err:unknown) {
      const error = err as AxiosError;
      if(error.response?.status === HttpStatusCode.BadRequest) {
        toast.error('Please fill in all fields');
      } else if(error.response?.status === HttpStatusCode.Conflict) {
        toast.error('User already exists');
      } else {
        toast.error('Server error occurred, please try again later');
      }
    }
  }
  
  return (
  <>
    <div className="container">
      <div className="form-container">
        <h2 className="title">Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 form-group" controlId="formBasicUsername">
            <Form.Label className="form-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              className="form-control"
              value={formData.username}
              onChange={handleUsernameChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="formBasicEmail">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              className="form-control"
              value={formData.email}
              onChange={handleEmailChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              className="form-control"
              value={formData.password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
          <Form.Group className="mb-3 form-group" controlId="formBasicConfirmPassword">
            <Form.Label className="form-label">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="btn-primary">
            Sign Up
          </Button>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Form>
      </div>
    </div>
    <ToastContainer />
  </>
  );
};

export default SignupPage;