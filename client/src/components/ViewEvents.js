import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import EventInfo from "./EventInfo";
import ViewEvent from "./ViewEvent";
import "./Login.css";
import axios from 'axios';

export default function ViewEvents(props) {

    const [showEvents, setShowEvents] = useState(true);
    const [curEvent, setCurEvent] = useState({});
    function handleClick(event) {
      event.preventDefault();
      props.show(false);
    }
    function handleBack(event) {
      event.preventDefault();
      props.show(false);
    }

  return (
    <div className="ViewEvents">
      {
          showEvents && 
          props.events.map((value, index) => 
              <EventInfo event={value} setCurEvent={setCurEvent} setShowEvents={setShowEvents}
               onClick={(e) => {
                  e.preventDefault();
                  setCurEvent(value);
                  setShowEvents(false);
                }} />
          )
      }
      {
        showEvents &&
        <Button onClick={handleBack}>
        Back
        </Button>
      }
      {
        !showEvents &&
        <ViewEvent id={props.id} event={curEvent} setShowEvents={setShowEvents} show={setShowEvents}/>
      }
    </div>
  );
}
    
