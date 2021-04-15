import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Login.css";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
export default function CreateLocation(props) {

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [error, setError] = useState("");
    let history = useHistory();
    function validateForm() {
        return name.length > 0;
    }

    function handleSubmit(event) {
      event.preventDefault();
      const payload = {
          name: name,
          address: address,
          latitude: latitude,
          longitude: longitude
      };
      axios.post('http://localhost:5000/api/createLocation', payload)
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
        console.log("hi");
      event.preventDefault();
      console.log("hello");
      props.show(false);
    }


  return (
    <div className="CreateLocation">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="name">
        <Form.Label>Location Name</Form.Label>
        <Form.Control
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
            value={address}
            onChange={(e) => setAddress(e.target.value)}
        />
        </Form.Group>
        <Form.Group size="lg" controlId="latitude">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}

            />
        </Form.Group>
        <Form.Group size="lg" controlId="longitude">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}

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
