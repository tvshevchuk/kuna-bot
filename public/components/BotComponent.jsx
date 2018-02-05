import React from 'react';

import { GetFetch, PostFetch } from '../fetchUtils.js';

class Bot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            uahBudget: 0,
            timeLimit: 0,
            botStatus: null
        }

        this.onChangeUahBudget = this.onChangeUahBudget.bind(this);
        this.onChangeTimeLimit = this.onChangeTimeLimit.bind(this);
        this.startBot = this.startBot.bind(this);
        this.stopBot = this.stopBot.bind(this);
    }

    onChangeUahBudget(e) {
        e.persist();
        this.setState(() => ({ uahBudget: e.target.value }));
    }

    onChangeTimeLimit(e) {
        e.persist();
        this.setState(() => ({ timeLimit: e.target.value }));
    }

    startBot() {
        PostFetch(`/kuna/startbot/${this.props.market}`, {
            uahBudget: this.state.uahBudget,
            timeLimit: this.state.timeLimit
        }).then(data => {
            this.setState(() => ({ botStatus: data.status }));
        });
    }

    stopBot() {
        GetFetch(`/kuna/stopbot/${this.props.market}`).then(data => {
            this.setState(() => ({ botStatus: data.status }));
        });
    }

    render() {
        return (<div>
            <h3>Manage {this.props.market} bot</h3>
            <span>UAH budget: </span>
            <input type='number' value={this.state.uahBudget} onChange={this.onChangeUahBudget} /><br />
            <span>Time limit in minutes: </span>
            <input type='number' value={this.state.timeLimit} onChange={this.onChangeTimeLimit} /><br />
            <button onClick={this.startBot}>Start {this.props.market} bot</button>
            <button onClick={this.stopBot}>Stop {this.props.market} bot</button>
            <pre>{this.state.botStatus}</pre>
        </div>)
    }
}

export default Bot;