import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core';
import CustomDialog from '../reusable/Dialog/CustomDialog';
import UserProfileForm from './UserProfile';
import {editProfile, resetPasswordInternal} from '../actions/auth';
import ChangePasswordInternalForm from './ChangePasswordInternalForm';

const styles = theme => ({
    button: {
        float: 'right'
    },
    marginAround: {
        margin: '1.2rem'
    }
});
class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state={
            showEditProfileDialog: false,
            initialValues: {},
            showChangePasswordDialog: false
        }
        this.showDialog = this.showDialog.bind(this);
        this.showCPDialog = this.showCPDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.closeCPDialog = this.closeCPDialog.bind(this);
        this.submitProfileForm = this.submitProfileForm.bind(this);
        this.doResetPasswordInternal = this.doResetPasswordInternal.bind(this);
    }
    componentDidMount() {
        console.log(this.props.user)
    }
    showCPDialog() {
        this.setState({
            showChangePasswordDialog: true
        });
    }
    closeCPDialog() {
        this.setState({
            showChangePasswordDialog: false
        });
    }
    showDialog() {
        let payload = this.props.user;
        if(this.props.user && this.props.user.dob){
            let ts = Date.parse(this.props.user.dob);
            let myDate = new Date(ts);
            

            payload["dob"] = myDate.getFullYear() + "-" + ((myDate.getMonth() + 1) <= 9 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)) + "-" + (myDate.getDate() <= 9 ? "0" + myDate.getDate() : myDate.getDate());
        }
        this.setState({
            showEditProfileDialog: true,
            initialValues: payload?payload:{}
        });
    }
    closeDialog() {
        this.setState({
            showEditProfileDialog: false,
            initialValues: null
        });
    }
    submitProfileForm(values) {
        let id = values._id;
        let payload = {
            firstName: values.firstName,
            lastName: values.lastName,
            dob: values.dob,
            role: values.role,
            email: values.email
        };
        this.props.dispatch(editProfile(id, payload));
        this.setState({
            showEditProfileDialog: false
        })
    }
    doResetPasswordInternal(values) {
        console.log(values)
        let id = this.props.user._id;
        let payload = {
            id: id,
            oldPassword: values.oldPassword,
            password: values.password
        };
        this.props.dispatch(resetPasswordInternal(payload));
        this.setState({
            showChangePasswordDialog: false
        });
    }
    render() {
        const { classes } = this.props;
        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", float: "right" }}>
                    <Button onClick={this.showDialog} className={classes.marginAround} alignt="right" variant="contained" color="primary" >Edit Profile</Button>
                    <Button onClick={this.showCPDialog} className={classes.marginAround} alignt="right" variant="contained" color="primary" >Change Password</Button>
                </div>

                {this.props.user && <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ width: '120px' }}>First Name</TableCell>
                            <TableCell>{this.props.user.firstName}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Last Name</TableCell>
                            <TableCell>{this.props.user.lastName}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{this.props.user.email}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Role</TableCell>
                            <TableCell>{this.props.user.role}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Date of Birth</TableCell>
                            <TableCell>{this.props.user.dob}</TableCell>
                        </TableRow>


                    </TableBody>
                </Table>}

                <CustomDialog
                    width="xs"
                    handleMount={this.state.showEditProfileDialog}
                    dialogTitle={"Edit Profile"}
                    dialogContent={<UserProfileForm initialValues={this.state.initialValues ? this.state.initialValues : ""} onSubmit={this.submitProfileForm} buttonText={"Submit"} />}
                    topCloseButton={true}
                    handleUnmount={this.closeDialog}
                />

                <CustomDialog
                    width="xs"
                    handleMount={this.state.showChangePasswordDialog}
                    dialogTitle={"Change Password"}
                    dialogContent={<ChangePasswordInternalForm onSubmit={this.doResetPasswordInternal} />}
                    topCloseButton={true}
                    handleUnmount={this.closeCPDialog}
                />


            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.auth.user.user,
        showSuccessSnackbar: state.snackbar.showSuccessSnackbar,
        showErrorSnackbar: state.snackbar.showErrorSnackbar,
        message: state.snackbar.message,
        tasks: state.task.tasks
    };
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Profile)));  
