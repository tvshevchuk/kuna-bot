import React from 'react';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import { PostFetch } from '../fetchUtils.js';
import { setUsername, setPassword, openRegisterDialog, closeRegisterDialog, openLoginDialog, closeLoginDialog } from '../actions/AuthActions.js';

class Auth extends React.Component {
    constructor() {
        super();

        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    registerUser() {
        PostFetch('/user/register', {
            username: this.props.username,
            password: this.props.password
        }).then(() => {
            this.props.dispatch(closeRegisterDialog())
        })
    }

    loginUser() {
        PostFetch('/user/login', {
            username: this.props.username,
            password: this.props.password
        }).then(() => {
            this.props.dispatch(closeLoginDialog())
        })
    }

    render() {
        return (<div>
            <FlatButton label="Register" onClick={() => this.props.dispatch(openRegisterDialog())} />
            <Dialog open={this.props.isRegisterDialogOpened}
                    modal={false}
                    onRequestClose={() => this.props.dispatch(closeRegisterDialog())}>
                <TextField hintText="Username" fullWidth={true} onChange={(e, value) => this.props.dispatch(setUsername(value))} /><br/>
                <TextField type="password" hintText="Password" fullWidth={true} onChange={(e, value) => this.props.dispatch(setPassword(value))} /><br/>
                <FlatButton label="Register" fullWidth={true} onClick={this.registerUser} />
            </Dialog>
            <FlatButton label="Log In" onClick={() => this.props.dispatch(openRegisterDialog())} />
            <Dialog open={this.props.isLoginDialogOpened}
                    modal={false}
                    onRequestClose={() => this.props.dispatch(closeLoginDialog())}>
                <TextField hintText="Username" onChange={(e, value) => this.props.dispatch(setUsername(value))} /><br/>
                <TextField type="password" hintText="Password" onChange={(e, value) => this.props.dispatch(setPassword(value))} /><br/>
                <FlatButton label="Log in" fullWidth={true} onClick={this.loginUser} />
            </Dialog>
        </div>)
    }
}

const mapStateToProps = state => state.auth;

export default connect(mapStateToProps)(Auth);

