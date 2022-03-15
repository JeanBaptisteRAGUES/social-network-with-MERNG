import React, { useContext } from 'react';
//Impossible avec react router dom v6..
/*
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function AuthRoute({ component: Component, ...rest }){
    const { user } = useContext(AuthContext);

    return (
        <Route 
            {...rest}
            render={ props => user ? <Redirect to='/' /> : <Component {...props} /> }
        />
    )
}

export default AuthRoute;
*/
