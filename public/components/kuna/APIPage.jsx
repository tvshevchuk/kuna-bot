import React from 'react';

import { GetFetch, PostFetch } from '../../fetchUtils.js';
import Auth from '../AuthComponent.jsx';
import Info from '../InfoComponent.jsx';

class Home extends React.Component {

    constructor() {
        super();
        this.state = {
            market: 'btcuah',
            latestMarketData: null,
            orderBook: null,
            trades: null,
            myInfo: null,
            myOrders: null,
            myHistory: null,
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

    getInfo(url, property) {
        GetFetch(url).then(data => {
            this.setState(() => ({
                [property]: JSON.stringify(data, undefined, 2)
            }));
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
                        onButtonClick={this.getInfo.bind(this, `/api/tickers/${this.state.market}`, 'latestMarketData')}
                        viewData={this.state.latestMarketData}
                    />
                    <Info 
                        titleName={'Order book'}
                        buttonName={'Get order book'}
                        onButtonClick={this.getInfo.bind(this, `/api/orderbook/${this.state.market}`, 'orderBook')}
                        viewData={this.state.orderBook}
                    />
                    <Info 
                        titleName={'Trades'}
                        buttonName={'Get trades'}
                        onButtonClick={this.getInfo.bind(this, `/api/trades/${this.state.market}`, 'trades')}
                        viewData={this.state.trades}
                    />
                </div>
                <div>
                    <Info 
                        titleName={'My info'}
                        buttonName={'My info'}
                        onButtonClick={this.getInfo.bind(this, '/api/myinfo', 'myInfo')}
                        viewData={this.state.myInfo}
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
                        onButtonClick={this.getInfo.bind(this, `/api/myorders/${this.state.market}`, 'myOrders')}
                        viewData={this.state.myOrders}
                    />
                    <Info 
                        titleName={'My history'}
                        buttonName={'My history'}
                        onButtonClick={this.getInfo.bind(this, `/api/myhistory/${this.state.market}`, 'myHistory')}
                        viewData={this.state.myHistory}
                    />
                </div>
            </div>
            </div>);
    }
}

export default Home;