import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CreateRSOEvent from "./CreateRSOEvent";
import CreateRSO from "./CreateRSO";
import CreateLocation from "./CreateLocation";
import "./Home.css";

export default function Admin(props) {
    const [showRso, setShowRso] = useState(false);
    const [showRsoEvent, setShowRsoEvent] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    return (
        
        <div className="Admin">
            {   // show buttons if not showing a form
                !showRso && !showRsoEvent && !showLocation &&
                 <div>
                     <Form>
                        <Button block size="lg" onClick={() => setShowRso(true)}>
                            Add RSO
                        </Button> 
                        <Button block size="lg" onClick={() => setShowRsoEvent(true)}>
                            Create RSO Event
                        </Button>
                        <Button block size="lg" onClick={() => setShowLocation(true)}>
                            Add Location
                        </Button>
                     </Form>
                </div>
            }
            {
                // show university form 
                showRso &&
                <CreateRSO id={props.id} show={setShowRso}/>
            }
            {
                showRsoEvent &&
                <CreateRSOEvent id={props.id} show={setShowRsoEvent}/>
            }
            {
                showLocation &&
                <CreateLocation id={props.id} show={setShowLocation}/>
            }
        </div>
    );
}
