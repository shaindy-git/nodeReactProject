import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../redux/tokenSlice';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logOut());
        navigate('/'); // או "/Auth/Auth" או כל נתיב אחר לקומפוננטה App שלך
    }, [dispatch, navigate]);

    return null; // אין תוכן להחזיר כאן
}

export default Logout;
