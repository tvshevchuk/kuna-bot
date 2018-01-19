import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './components/HomePage.jsx';
import BtcBotPage from './components/BtcBotPage.jsx';
import EthBotPage from './components/EthBotPage.jsx';
import Header from './components/HeaderComponent.jsx';
import PageNotFound from './components/PageNotFound.jsx';

import './style.css';

const App = () => (
    <MuiThemeProvider>
        <BrowserRouter>
            <div>
                <Header/>    
                <Switch>
                    <Route path='/' component={Home} exact={true} />
                    <Route path='/btcuah' component={BtcBotPage} />
                    <Route path='/ethuah' component={EthBotPage} />
                    <Route component={PageNotFound} />
                </Switch>
            </div>
        </BrowserRouter>
    </MuiThemeProvider>
)

render(<App />, document.getElementById('root'));