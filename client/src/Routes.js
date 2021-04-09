import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
export default function Routes() {
    return (
        <Switch>
            <Route exact path='/home'>
                <Home />
            </Route>
            <Route exact path='/'>
                <Login />
            </Route>
            <Route exact path='/Register'>
                <Register />
            </Route>
        </Switch>
    )
}

