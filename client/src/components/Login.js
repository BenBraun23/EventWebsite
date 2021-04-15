import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";
import axios from 'axios';
import {useHistory} from "react-router-dom";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let history = useHistory(); 
  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const payload = {
        email: email,
        password: password
    };
    axios.post('http://localhost:5000/api/login', payload)
        .then((res) => {
            console.log(res.data);
            if(!res.data.error)
            {
              props.setId(res.data.id);
              console.log(res.data.id);
              props.setRole(res.data.role);
              history.push('/home');
            }
            else 
            {
              setError(res.data.error);
            }
        }).catch((error) => {
            console.log(error);
        });
  }

  function handleClick(event) {
    event.preventDefault();
    history.push('/register');
  }
  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Login
        </Button>
        <Button block size="lg" onClick={handleClick}>
          Click here to create an account
        </Button>
        {error}
      </Form>
    </div>
  );
}
