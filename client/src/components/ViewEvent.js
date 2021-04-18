import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Comment from "./Comment";
import "./ViewEvent.css";
import axios from 'axios';

export default function ViewEvent(props) {
    const [showComments, setShowComments] = useState(false);
    const [text, setText] = useState("");
    const [rating, setRating] = useState("");
    const [curComment, setCurComment] = useState({});
    const [comments, setComments] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const payload = {
            eid: props.event.eid
        };
        axios.post('http://localhost:5000/api/getComments', payload)
        .then((res) => {
            console.log(res.data.comments);
            setShowComments(false);
            setComments(res.data.comments);
            setShowComments(true);
            setText("");
            setRating("");
        }).catch((e) => console.log(e));
    }, [refresh])
    
    function handleEdit(e) {
        e.preventDefault();
        const payload = {
            cid: curComment.cid,
            text: text,
            rating: rating
        };
        axios.post('http://localhost:5000/api/editComment', payload)
        .then((res) => {
            setRefresh(refresh+1);
        })
        .catch((e) => console.log(e));
    }
    function handleAdd(e) {
        e.preventDefault();
        const payload = {
            uid: props.id,
            eid: props.event.eid,
            text: text,
            rating: rating
        }
        axios.post('http://localhost:5000/api/addComment', payload)
        .then((res) => {
            setText("");
            setRating("");
            setRefresh(refresh+1);
        })
        .catch((e) => console.log(e));
    }
    function handleDelete(e) {
        e.preventDefault();
        const payload = {
            cid: curComment.cid
        }
        axios.post('http://localhost:5000/api/deleteComment', payload)
        .then((res) => {
            setRefresh(refresh+1);
        })
        .catch((e) => console.log(e));
    }

  return (
    <div className="ViewEvent">
       <div className="Event">
           <div>
            Event Name:{props.event.name}
            </div>
            <div>
            Time: {props.event.day + " " + props.event.time + ":00"} 
            </div>
            <div>
            {props.event.description}
            </div>
            <div>
            Location: {props.event.lname}
            </div>
            <h2>
            Comments
            </h2>
        </div>
        
        {
            showComments &&
            comments.map((value, index) => 
                <Comment 
                comment={value} 
                    isOwner={value.uid === props.id}
                    onEdit={(e) => {
                        setShowComments(false);
                        setCurComment(value);
                        setText(value.text);
                        setRating(value.rating);
                    }}
             />)
        }
        {
            showComments &&
            <Form>
                <Form.Group>
                    <Form.Label>Text</Form.Label>
                    <Form.Control value={text} onChange={(e) => setText(e.target.value)} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control value={rating} onChange={(e) => setRating(e.target.value)} />
                </Form.Group>
                <Button onClick={handleAdd}>
                    Add
                </Button>
            </Form>
        }
        {
            !showComments &&
            <Form>
                <Form.Group>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control value={rating} 
                        onChange={(e) => setRating(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control 
                        value={text} 
                        onChange={(e) => setText(e.target.value)}
                    />
                </Form.Group>
                <Button onClick={handleEdit}>
                    Save
                </Button>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </Form>
        }
        {
            <Button onClick={(e) => {

                e.preventDefault();
                props.show(true);
            }}>
                Back
            </Button>
        }
    </div>
  );
}
    
