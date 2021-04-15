import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CreateUniversity from "./CreateUniversity";
import CreateEvent from "./CreateEvent";
import CreateLocation from "./CreateLocation";
import "./Home.css";

export default function Superadmin(props) {
    const [showUni, setShowUni] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [showLocation, setShowLocation] = useState(false);
    return (
        
        <div className="Superadmin">
            {   // show buttons if not showing a form
                !showUni && !showEventForm && !showLocation &&
                 <div>
                     <Form>
                        <Button block size="lg" onClick={() => setShowUni(true)}>
                            Add University
                        </Button> 
                        <Button block size="lg" onClick={() => setShowEventForm(true)}>
                            Create Event
                        </Button>
                        <Button block size="lg" onClick={() => setShowLocation(true)}>
                            Add Location
                        </Button>
                     </Form>
                </div>
            }
            {
                // show university form 
                showUni &&
                <CreateUniversity id={props.id} show={setShowUni}/>
            }
            {
                showEventForm &&
                <CreateEvent id={props.id} show={setShowEventForm}/>
            }
            {
                showLocation &&
                <CreateLocation id={props.id} show={setShowLocation}/>
            }
        </div>
    );
}
