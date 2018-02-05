import React from 'react';
import { NavLink } from 'react-router-dom';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

import Auth from './AuthComponent.jsx';

class Header extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            isDrawerOpened: false
        }

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    openDrawer() {
        this.setState(() => ({ isDrawerOpened: true }));
    }

    closeDrawer() {
        this.setState(() => ({ isDrawerOpened: false }));
    }

    render() {
        return (
            <div>
                <AppBar title={<NavLink to='/'>TRADING BOT</NavLink>} 
                        onLeftIconButtonClick={this.openDrawer}
                        iconElementRight={<Auth />}
                />
                
                <Drawer docked={false} 
                        open={this.state.isDrawerOpened} 
                        onRequestChange={(isDrawerOpened) => this.setState({isDrawerOpened})}>
                    <MenuItem>
                        <NavLink to="/kuna/api" onClick={this.closeDrawer}>Kuna info</NavLink>
                    </MenuItem>
                    <MenuItem>
                        <NavLink to="/kuna/btcuahbot" onClick={this.closeDrawer}>BTC bot</NavLink>
                    </MenuItem>
                    <MenuItem>
                        <NavLink to="/kuna/ethuahbot" onClick={this.closeDrawer}>ETH bot</NavLink>
                    </MenuItem>
                    <MenuItem>
                        <NavLink to="/livecoin/api" onClick={this.closeDrawer}>Livecoin info</NavLink>
                    </MenuItem>
                </Drawer>
            </div>
        );
    }
}



export default Header;