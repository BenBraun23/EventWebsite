import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LocationEvents from "./LocationEvents";
import UniversityEvents from "./UniversityEvents";
import JoinRSO from "./JoinRSO";
import LeaveRSO from "./LeaveRSO";
import "./Home.css";

export default function Student(props) {
    const [showLocationEvents, setShowLocationEvents] = useState(false);
    const [showUniversityEvents, setShowUniversityEvents] = useState(false);
    const [showJoinRSO, setShowJoinRSO] = useState(false);
    const [showLeaveRSO, setShowLeaveRSO] = useState(false);
    return (
        
        <div className="Student">
            {   // show buttons if not showing a form
                !showLocationEvents && !showUniversityEvents && !showJoinRSO && !showLeaveRSO &&
                 <div>
                     <Form>
                        <Button block size="lg" onClick={() => setShowLocationEvents(true)}>
                            View Events by Location
                        </Button> 
                        <Button block size="lg" onClick={() => setShowUniversityEvents(true)}>
                            View Events by University
                        </Button>
                        <Button block size="lg" onClick={() => setShowJoinRSO(true)}>
                            Join RSO
                        </Button>
                        <Button block size="lg" onClick={() => setShowLeaveRSO(true)}>
                            Leave RSO
                        </Button>
                     </Form>
                </div>
            }
            {
                // show university form 
                showLocationEvents &&
                <LocationEvents id={props.id} show={setShowLocationEvents}/>
            }
            {
                showUniversityEvents &&
                <UniversityEvents id={props.id} show={setShowUniversityEvents}/>
            }
            {
                showJoinRSO &&
                <JoinRSO id={props.id} show={setShowJoinRSO}/>
            }
            {
                showLeaveRSO &&
                <LeaveRSO id={props.id} show={setShowLeaveRSO}/>
            }
        </div>
    );
}
