import React from 'react';

import { GetFetch, PostFetch } from '../../fetchUtils.js';
import Auth from '../AuthComponent.jsx';
import Info from '../InfoComponent.jsx';

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            market: 'btcuah',
            postOrder: null,
            deletedOrder: null
        }

        this.changeMarket = this.changeMarket.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
    }

    changeMarket(event) {
        event.persist();
        this.setState(() => ({market: event.target.value}));
    }

    postOrder(side) {
        PostFetch('/api/postorder', {
            side,
            volume: uahVolumeInput.value / btcPriceInput.value,
            market: this.state.market,
            price: parseInt(btcPriceInput.value)
        }).then(data => {
            this.setState(() => ({postOrder: data}));
        });
    }

    deleteOrder() {
        PostFetch('/api/deleteorder', { id: deleteOrderInput.value })
        .then(data => {
            this.setState(() => ({deletedOrder: data}))
        });
    }

    render() {
        return (
            <div>
                <Auth />
                <h5>Check market</h5>
            <select id='marketSelect' onChange={this.changeMarket}>
                <option value='btcuah' defaultValue>BTC to UAH</option>
                <option value='ethuah'>ETH to UAH</option>
            </select>
            
            <div className='container'>
                <div>
                    <Info
                        titleName={'Latest market data'}
                        buttonName={'Get latest data'}
                        url={`/kuna/tickers/${this.state.market}`}
                    />
                    <Info 
                        titleName={'Order book'}
                        buttonName={'Get order book'}
                        url={`/kuna/orderbook/${this.state.market}`}
                    />
                    <Info 
                        titleName={'Trades'}
                        buttonName={'Get trades'}
                        url={`/kuna/trades/${this.state.market}`}
                    />
                </div>
                <div>
                    <Info 
                        titleName={'My info'}
                        buttonName={'My info'}
                        url={'/kuna/myinfo'}
                    />

                    <h3>Post order:</h3>
                    <span>Uah volume</span>
                    <input type='number' id='uahVolumeInput' /><br />
                    <span>Price for 1 btc</span>
                    <input type='number' id='btcPriceInput' /><br />
                    <button onClick={this.postOrder.bind(this, 'buy')}>Buy</button>
                    <button onClick={this.postOrder.bind(this, 'sell')}>Sell</button>
                    <pre>{this.state.postOrder}</pre>

                    <h3>Delete order:</h3>
                    <input type='text' id='deleteOrderInput' /><br />
                    <button onClick={this.deleteOrder}>Delete order</button>
                    <pre>{this.state.deletedOrder}</pre>

                    <Info 
                        titleName={'My orders'}
                        buttonName={'My orders'}
                        url={`/kuna/myorders/${this.state.market}`}
                    />
                    <Info 
                        titleName={'My history'}
                        buttonName={'My history'}
                        url={`/kuna/myhistory/${this.state.market}`}
                    />
                </div>
            </div>
            </div>);
    }
}

export default Home;