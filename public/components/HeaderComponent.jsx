import React from 'react';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { NavLink } from 'react-router-dom';

class Header extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);

        this.state = {

        }
    }

    render() {
        return (
            <Toolbar className="header">
                <ToolbarGroup firstChild={true}>
                    <NavLink to="/">Kuna info</NavLink>
                </ToolbarGroup>
                <ToolbarGroup>
                    <NavLink to="/btcuah">BTC bot</NavLink>
                </ToolbarGroup>
                <ToolbarGroup>
                    <NavLink to="/ethuah">ETH bot</NavLink>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}



export default Header;