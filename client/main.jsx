import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { render } from 'react-dom';  
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Button from '@material-ui/core/Button'; 
import App from '/imports/ui/App'; 
import Typography from '@material-ui/core/Typography';
 
 

Meteor.startup(() => { 
    render(
        <Router>
        <div >
            <AppBar  position="static">
              <Toolbar className="topBar"> 
              <Typography variant="h6" >
                <Link to="/">Role Management Demo <small><em>( Manage roles by clicking <strong>Manage Roles Button</strong> )</em></small></Link>
              </Typography>                
              </Toolbar>
            </AppBar>
            <Switch> 
            <Route path="/">
                <App />
            </Route>
            </Switch>
        </div>
        </Router>
        , document.getElementById('react-target'));
  });