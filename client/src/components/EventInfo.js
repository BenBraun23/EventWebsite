import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./EventInfo.css";
import axios from 'axios';

export default function EventInfo(props) {

  return (
    <div className="EventInfo">
       <div>
           Event Name:{props.event.name}
        </div>
        <div>
           Time: {props.event.time}
        </div>
        <div>
           {props.event.description}
        </div>
        <div>
           Location: {props.event.lname}
       </div>
       <Button onClick={props.onClick}>
           View Event
       </Button>
    </div>
  );
}
    
