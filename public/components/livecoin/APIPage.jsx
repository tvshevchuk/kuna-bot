import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem/MenuItem';

class APIPage extends React.Component {
    constructor() {
        super();

        this.state = {
            market: 'btcusd'
        }
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
            </div>
        )
    }
}

export default APIPage;