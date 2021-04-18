import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ViewEvents from "./ViewEvents";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';

export default function UniversityEvents(props) {

    const [university, setUniversity] = useState("");
    const [showEvents, setShowEvents] = useState(false);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");
    function validateForm() {
        return university.length > 0;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const payload = {
          university: university,
          id: props.id
      };
      axios.post('http://localhost:5000/api/universityEvents', payload)
          .then((res) => {
              console.log(res);
              if(res.data.error)
              {
                setError(res.data.error);
              }
              console.log(res.data);
              setEvents(res.data.events);
              setShowEvents(true);

          }).catch((error) => {
              console.log(error);
          });
    }
    function handleClick(event) {
      event.preventDefault();
      props.show(false);
    }


  return (
    <div className="UniversityEvents">
        {
            showEvents && 
            <div>
                <h1>Events</h1>
                <ViewEvents id={props.id} events={events} show={props.show}/>
            </div>
        }
      {
        !showEvents &&
        <Form onSubmit={handleSubmit}>
            <Form.Group size="lg" controlId="university">
            <Form.Label>University</Form.Label>
            <Form.Control
                autoFocus
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
            />
            </Form.Group>       
            <Button block size="lg" type="submit" disabled={!validateForm()}>
            Search
            </Button>
            {error}
        
            <Button block size="lg" onClick={handleClick}>
                Cancel
            </Button>
        </Form>
    }
    </div>
  );
}
