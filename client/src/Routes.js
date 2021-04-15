import React, {useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';


export default function Routes() {
    const [role, setRole] = useState("");
    const [id, setId] = useState();
    return (
        <Switch>
            <Route exact path='/home'>
                <Home role={role} id={id}/>
            </Route>
            <Route exact path='/'>
                <Login setId={setId} setRole={setRole}/>
            </Route>
            <Route exact path='/Register'>
                <Register role={role} />
            </Route>
        </Switch>
    )
}

