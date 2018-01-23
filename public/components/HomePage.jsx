import React from 'react';
import { Link } from 'react-router-dom';

import { GetFetch, PostFetch } from '../fetchUtils.js';
import Auth from './AuthComponent.jsx';
import Info from './InfoComponent.jsx';

class Home extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <h1>Home page</h1>
        )
    }
}

export default Home;