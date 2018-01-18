import React from 'react';
import Bot from './BotComponent.jsx';

const BtcTab = () => (
    <div>
        <span>Username: </span>
        <input type='text' id='loginInput' />
        <span>Password: </span>
        <input type='password' id='passwordInput' />
        <Bot market={'btcuah'}/>
    </div>);

export default BtcTab;