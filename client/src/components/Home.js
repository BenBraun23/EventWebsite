import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import Superadmin from "./Superadmin";
import Admin from "./Admin";
import "./Home.css";

export default function Home(props) {
  let history = useHistory();
  return (
    <div className="Home">
      <Navbar bg="light" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form inline>
            <Button onClick={(e) => {history.push('/')}}>Log Out</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      {props.role === "Superadmin" &&
        <Superadmin id={props.id}/>
      }
      {
        props.role === "Admin" &&
        <Admin id={props.id} />
      }
    </div>
  );
}
