import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
export default function Register(props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [university, setUniversity] = useState("");
    const [role, setRole] = useState("Student");
    let history = useHistory();
    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
    event.preventDefault();
    const payload = {
        email: email,
        password: password,
        role: props.role,
        university: university
    };
    axios.post('http://localhost:5000/api/register', payload)
        .then((res) => {
            console.log(res.data);
            if(res.data.error)
            {
              setError(res.data.error);
            }
            else
            {
              history.push('/');
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    function handleClick(event) {
      event.preventDefault();
      history.push('/');
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
        { props.role === "Admin" &&
          <Form.Group size="lg" controlId="university">
            <Form.Label>University</Form.Label>
            <Form.Control
              value={university}
              onChange={(e) => setUniversity(e.target.value)}

            />
          </Form.Group>
        }
        <Form.Group size="lg" controlId="role">
          <DropdownButton id="dropdown-basic-button" title={role} onSelect={(e) => setRole(e)}>
            <Dropdown.Item eventKey="Student">Student</Dropdown.Item>
            <Dropdown.Item eventKey="Admin">Admin</Dropdown.Item>
            <Dropdown.Item eventKey="Superadmin">Superadmin</Dropdown.Item>
          </DropdownButton>
        </Form.Group>
        
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Register
        </Button>
        <Button block size="lg" type="submit" onClick={handleClick}>
          Back to login
        </Button>
        {error}
      </Form>
    </div>
  );
}
