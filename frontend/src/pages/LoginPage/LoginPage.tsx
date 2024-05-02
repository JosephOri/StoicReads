import React,{ useState } from 'react';
import { Nav } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './LoginPage.css';
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);    
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="title">Login</h2>
        <Form onSubmit={handleSubmit}>
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
          <p className="signup-link">
            Don't have an account? <Nav.Link href="/signup">Sign up</Nav.Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;