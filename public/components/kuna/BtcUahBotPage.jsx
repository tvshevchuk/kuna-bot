import React from 'react';
import Auth from '../AuthComponent.jsx';
import Bot from '../BotComponent.jsx';

const BtcBotPage = () => (
    <div>
        <Auth />
        <Bot market={'btcuah'}/>
    </div>);

export default BtcBotPage;