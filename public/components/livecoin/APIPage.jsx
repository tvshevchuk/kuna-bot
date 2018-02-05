import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';

import { PostFetch } from '../../fetchUtils.js';
import Info from '../InfoComponent.jsx';

class APIPage extends React.Component {
    constructor() {
        super();

        this.state = {
            market: 'btcusd',
            latestTickers: null
        }

        this.changeMarket = this.changeMarket.bind(this);
    }

    changeMarket(event, input, value) {
        this.setState(() => {
            market: value
        })
    }

    render() {
        return (
            <div>
                <SelectField 
                    floatingLabelText="Currency pair"
                    value={this.state.market}
                    onChange={this.changeMarket}>
                    <MenuItem value='btcusd' primaryText='BTC/USD' />
                </SelectField>
                <div className='container'>
                    <div>
                        <Info
                            titleName={'Tickers'}
                            buttonName={'Get tickers'}
                            url={'/livecoin/ticker'}
                            params={ { currencyPair: this.state.market } }
                        />
                    </div>
                </div> 
            </div>
        )
    }
}

export default APIPage;