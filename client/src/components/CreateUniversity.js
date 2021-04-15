import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
export default function CreateUniversity(props) {

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [numStudents, setNumStudents] = useState();
    const [error, setError] = useState("");
    let history = useHistory();
    function validateForm() {
        return name.length > 0 && location.length > 0;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const payload = {
          name: name,
          location: location,
          description: description,
          numStudents: numStudents
      };
      axios.post('http://localhost:5000/api/createUniversity', payload)
          .then((res) => {
              console.log(res.data);
              if(res.data.error)
              {
                setError(res.data.error);
              }
              else
              {
                props.show(false);
              }
          }).catch((error) => {
              console.log(error);
          });
    }
    function handleClick(event) {
      event.preventDefault();
      props.show(false);
    }


  return (
    <div className="CreateUniversity">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
        <Form.Label>University Name</Form.Label>
        <Form.Control
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control
            value={location}
            onChange={(e) => setLocation(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}

            />
        </Form.Group>
        <Form.Group size="lg" controlId="numStudents">
            <Form.Label>Number of Students</Form.Label>
            <Form.Control
            value={numStudents}
            onChange={(e) => setNumStudents(e.target.value)}

            />
        </Form.Group>        
        <Button block size="lg" type="submit" disabled={!validateForm()}>
        Add
        </Button>
        <Button block size="lg" onClick={handleClick}>
        Cancel
        </Button>
        {error}
    </Form>
    </div>
  );
}
