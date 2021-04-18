import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
export default function CreateEvent(props) {

    const [name, setName] = useState("");
    const [time, setTime] = useState("time");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [university, setUniversity] = useState("");
    const [day, setDay] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [error, setError] = useState("");
    let history = useHistory();
    function validateForm() {
        return name.length > 0 && location.length > 0 && time !== "time" && university.length > 0 && day.length > 0;
    }
    const times = getTimes();

    function getTimes() {
        var arr = [];
        for(var i = 0; i < 24; i++)
        {
            arr.push(i.toString() + ":00");
        }
        return arr;
    }
    function handleSubmit(event) {
      event.preventDefault();
      const payload = {
          name: name,
          time: time,
          location: location,
          description: description,
          university: university,
          day: day,
          visibility: visibility,
          id:props.id
      };
      console.log(payload);
      axios.post('http://localhost:5000/api/createEvent', payload)
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
    <div className="CreateEvent">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
        <Form.Label>Event Name</Form.Label>
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
        <Form.Group size="lg" controlId="university">
            <Form.Label>University</Form.Label>
            <Form.Control
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="day">
            <Form.Label>Day</Form.Label>
            <Form.Control
            value={day}
            onChange={(e) => setDay(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="time">
          <DropdownButton id="dropdown-basic-button" title={time} onSelect={(e) => setTime(e)}>
              {
                  times.map((value, index) => 
                    <Dropdown.Item eventKey={index}>{value}</Dropdown.Item>
                )
              }
          </DropdownButton>
        </Form.Group>    
        <Form.Group size="lg" controlId="visibility">
          <DropdownButton id="dropdown-basic-button" title={visibility} onSelect={(e) => setVisibility(e)}>
              <Dropdown.Item eventKey="public">{"public"}</Dropdown.Item>
              <Dropdown.Item eventKey="private">{"private"}</Dropdown.Item>
          </DropdownButton>
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
