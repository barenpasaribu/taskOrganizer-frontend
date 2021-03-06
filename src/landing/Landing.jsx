import React from 'react';
import Button from '@material-ui/core/Button';
import { logoutUser } from '../actions/auth';
import { connect } from 'react-redux';
import TaskContainer from '../task/TaskContainer';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuAppBar from '../reusable/Menu/MenuAppBar';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Profile from '../profile/Profile';
const styles = theme => ({
    headerWrapper: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    marginAround: {
        margin: '1.2rem'
    }
});

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.redirectToProfile = this.redirectToProfile.bind(this);
        this.dashboardRedirect = this.dashboardRedirect.bind(this);
    }

    logout() {
        console.log("logout")
        this.props.dispatch(logoutUser());
    }
    redirectToProfile() {
        this.props.history.push('/app/profile');
    }
    dashboardRedirect() {
        this.props.history.push('/app');
    }
    render() {
        const classes = this.props;
        return (
            <div>
                <MenuAppBar title={"Task Organizer"} logout={this.logout} profileRedirect={this.redirectToProfile} dashboardRedirect={this.dashboardRedirect} />
                <Switch>
                    <Route path="/app/profile" component={Profile} />
                    <Route path="/app" exact component={TaskContainer} />
                </Switch>
                
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        showSuccessSnackbar: state.snackbar.showSuccessSnackbar,
        showErrorSnackbar: state.snackbar.showErrorSnackbar,
        message: state.snackbar.message,
    };
}

export default withRouter(connect(mapStateToProps)(withStyles(styles)(Landing)));
