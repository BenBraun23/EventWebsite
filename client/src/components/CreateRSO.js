import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
export default function CreateRSO(props) {

    const [name, setName] = useState("");
    const [error, setError] = useState("");
    let history = useHistory();
    function validateForm() {
        return name.length > 0;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const payload = {
          name: name,
          id: props.id
      };
      axios.post('http://localhost:5000/api/createRSO', payload)
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
    <div className="CreateRSO">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
        <Form.Label>RSO Name</Form.Label>
        <Form.Control
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
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
