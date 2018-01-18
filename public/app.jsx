import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './components/HomePage.jsx';

import './style.css';

const App = () => (
    <MuiThemeProvider>
        <BrowserRouter>
            <Switch>
                <Route path='/' component={Home} exact={true} />
            </Switch>
        </BrowserRouter>
    </MuiThemeProvider>
)

render(<App />, document.getElementById('root'));