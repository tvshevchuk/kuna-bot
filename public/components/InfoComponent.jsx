import React from 'react';

import { GetFetch, PostFetch } from '../fetchUtils.js';

class Info extends React.Component {
    constructor(props) {
        super(props);
        
        let { titleName, buttonName, url, params, getWithParams } = props;
        this.state = {
            titleName, buttonName, url, params,
            viewData: null
        }

        this.getInfo = this.getInfo.bind(this);
    }

    getInfo() {
        GetFetch(this.state.url, this.state.params).then(info => {
            this.setState(() => ({
                viewData: JSON.stringify(info, undefined, 2)
            }))
        })
    }

    render() {
        return (<div>
            <h3>{this.state.titleName}</h3>
            <button onClick={this.getInfo}>{this.state.buttonName}</button>
            <pre>{this.state.viewData}</pre>
        </div>)
    }
}

export default Info;