import React from 'react';
import Bot from './BotComponent.jsx';

const EthBotPage = () => (
    <div>
        <span>Username: </span>
        <input type='text' id='loginInput' />
        <span>Password: </span>
        <input type='password' id='passwordInput' />
        <Bot market={'ethuah'}/>
    </div>);

export default EthBotPage;