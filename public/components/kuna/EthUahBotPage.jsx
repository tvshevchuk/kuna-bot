import React from 'react';
import Auth from '../AuthComponent.jsx';
import Bot from '../BotComponent.jsx';

const EthBotPage = () => (
    <div>
        <Auth />
        <Bot market={'ethuah'}/>
    </div>);

export default EthBotPage;