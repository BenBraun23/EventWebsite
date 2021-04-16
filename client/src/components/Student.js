import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./Home.css";

export default function Student(props) {
    const [showLocationEvents, setShowLocationEvents] = useState(false);
    const [showUniversityEvents, setShowUniversityEvents] = useState(false);
    const [showJoinRSO, setShowJoinRSO] = useState(false);
    return (
        
        <div className="Student">
            {   // show buttons if not showing a form
                !showLocationEvents && !showUniversityEvents && !showJoinRSO &&
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
                     </Form>
                </div>
            }
            {
                // show university form 
                showLocationEvents &&
                <CreateRSO id={props.id} show={setShowLocationEvents}/>
            }
            {
                showUniversityEvents &&
                <CreateRSOEvent id={props.id} show={setShowUniversityEvents}/>
            }
            {
                showJoinRSO &&
                <JoinRSO id={props.id} show={setShowJoinRSO}/>
            }
        </div>
    );
}
