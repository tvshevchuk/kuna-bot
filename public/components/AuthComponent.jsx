import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import { PostFetch } from '../fetchUtils.js';

class Auth extends React.Component {
    constructor() {
        super();

        this.state = {
            isRegisterDialogOpened: false,
            isLoginDialogOpened: false,
            username: '',
            password: ''
        }

        this.openRegisterDialog = this.openRegisterDialog.bind(this);
        this.closeRegisterDialog = this.closeRegisterDialog.bind(this);
        this.openLoginDialog = this.openLoginDialog.bind(this);
        this.closeLoginDialog = this.closeLoginDialog.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    openRegisterDialog() {
        this.setState(() => ({ isRegisterDialogOpened: true }));
    }

    closeRegisterDialog() {
        this.setState(() => ({ isRegisterDialogOpened: false }));
    }

    openLoginDialog() {
        this.setState(() => ({ isLoginDialogOpened: true }));
    }
    
    closeLoginDialog() {
        this.setState(() => ({ isLoginDialogOpened: false }));
    }

    setUsername(event, newValue) {
        this.setState(() => ({ username: newValue }));
    }

    setPassword(event, newValue) {
        this.setState(() => ({ password: newValue }));
    }

    registerUser() {
        PostFetch('/user/register', {
            username: this.state.username,
            password: this.state.password
        }).then(() => {
            this.closeRegisterDialog();
        })
    }

    loginUser() {
        PostFetch('/user/login', {
            username: this.state.username,
            password: this.state.password
        }).then(() => {
            this.closeLoginDialog();
        })
    }

    render() {
        return (<div>
            <FlatButton label="Register" onClick={this.openRegisterDialog} />
            <Dialog open={this.state.isRegisterDialogOpened}
                    modal={false}
                    onRequestClose={this.closeRegisterDialog}>
                <TextField hintText="Username" fullWidth={true} onChange={this.setUsername} /><br/>
                <TextField type="password" hintText="Password" fullWidth={true} onChange={this.setPassword} /><br/>
                <FlatButton label="Register" fullWidth={true} onClick={this.registerUser} />
            </Dialog>
            <FlatButton label="Log In" onClick={this.openLoginDialog} />
            <Dialog open={this.state.isLoginDialogOpened}
                    modal={false}
                    onRequestClose={this.closeLoginDialog}>
                <TextField hintText="Username" onChange={this.setUsername} /><br/>
                <TextField type="password" hintText="Password" onChange={this.setPassword} /><br/>
                <FlatButton label="Log in" fullWidth={true} onClick={this.loginUser} />
            </Dialog>
        </div>)
    }
}

// const Auth = () => (
//     <div>
//         
//     </div>
// );

export default Auth;

