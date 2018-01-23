import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from './components/HeaderComponent.jsx';
import Home from './components/HomePage.jsx';
import KunaAPIPage from './components/kuna/APIPage.jsx';
import KunaBtcUahBotPage from './components/kuna/BtcUahBotPage.jsx';
import KunaEthUahBotPage from './components/kuna/EthUahBotPage.jsx';
import LivecoinAPIPage from './components/livecoin/APIPage.jsx';
import PageNotFound from './components/PageNotFound.jsx';

import './style.css';

const App = () => (
    <MuiThemeProvider>
        <BrowserRouter>
            <div>
                <Header/>    
                <Switch>
                    <Route path='/' component={Home} exact={true} />
                    <Route path='/kuna/api' component={KunaAPIPage} />
                    <Route path='/kuna/btcuahbot' component={KunaBtcUahBotPage} />
                    <Route path='/kuna/ethuahbot' component={KunaEthUahBotPage} />
                    <Route path='/livecoin/api' component={LivecoinAPIPage} />
                    <Route component={PageNotFound} />
                </Switch>
            </div>
        </BrowserRouter>
    </MuiThemeProvider>
)

render(<App />, document.getElementById('root'));