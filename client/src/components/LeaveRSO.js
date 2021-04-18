import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';

export default function LeaveRSO(props) {

    const [rso, setRso] = useState("");
    const [error, setError] = useState("");
    function validateForm() {
        return rso.length > 0;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const payload = {
          rso: rso,
          id: props.id
      };
      axios.post('http://localhost:5000/api/leaveRSO', payload)
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
    <div className="JoinRSO">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
        <Form.Label>RSO Name</Form.Label>
        <Form.Control
            autoFocus
            value={rso}
            onChange={(e) => setRso(e.target.value)}
        />
        </Form.Group>       
        <Button block size="lg" type="submit" disabled={!validateForm()}>
        Leave
        </Button>
        <Button block size="lg" onClick={handleClick}>
        Cancel
        </Button>
        {error}
    </Form>
    </div>
  );
}
