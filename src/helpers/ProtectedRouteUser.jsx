import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import * as ROUTES from '../constants/Routes';

export default function ProtectedRouteUser({ user, children, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => {
                if (user) {
                    return React.cloneElement(children, { user });
                }
                if (!user) {
                    return (
                        <Redirect
                            to={{
                                pathname: ROUTES.LOGIN,
                                state: { from: location }
                            }}
                        />
                    );
                }

                return null;
            }}
        />
    );
}

ProtectedRouteUser.propTypes = {
    user: PropTypes.object,
    children: PropTypes.object.isRequired
};