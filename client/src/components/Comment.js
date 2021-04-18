import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Comment.css";
import axios from 'axios';

export default function Comment(props) {
    useEffect(() => {
        console.log("inside comment");
    }, [])
  return (
    <div className="Comment">
       <div className="Event">
            <div>
            Rating: {props.comment.rating}
            </div>
            <div>
                {props.comment.text}
            </div>
            <div>
            Time: {props.comment.time.toLocaleString()}
            </div>
        </div>
        {
            props.isOwner &&
            <div>
                <Button size="sm" onClick={props.onEdit}>
                    Edit
                </Button>
            </div>
        }
    </div>
  );
}
    
