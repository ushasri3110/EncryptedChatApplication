import { Alert, Button, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentUser, login } from '../../redux/auth/Action';

function Login() {
    const [inputData, setInputData] = useState({ email: "", password: "" });
    const jwt = localStorage.getItem('jwt');
    const  auth  = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(inputData));
    };

    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (jwt) {
            dispatch(currentUser(jwt));
        }
    }, [jwt, dispatch]);

    useEffect(() => {
        if (auth.reqUser?.fullName || jwt!=null) {
            setOpenSnackbar(true); 
            setTimeout(() => navigate('/'), 1000); 
        }
    }, [auth.reqUser, navigate]);

    return (
        <div className='flex justify-center h-screen items-center'>
            <div className='w-[30%] p-10 shadow-md bg-white border-2 border-[#0f172a]'>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <p className='mb-2'>Email</p>
                        <input 
                            type="email" 
                            className='py-1 border-2 border-[#0f172a] w-full rounded-md px-1' 
                            name='email'
                            placeholder='Enter Your Email' 
                            onChange={handleChange} 
                            value={inputData.email} 
                        />
                    </div>
                    <div>
                        <p className='mb-2'>Password</p>
                        <input 
                            type="password" 
                            className='py-1 border-2 border-[#0f172a] w-full rounded-md px-1' 
                            name='password'
                            placeholder='Enter Your Password' 
                            onChange={handleChange} 
                            value={inputData.password} 
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full" variant="contained" sx={{ bgcolor: "#0f172a" }}>Login</Button>
                    </div>
                </form>
                <div className='flex space-x-3 items-center mt-5'>
                    <p className="m-0">Create New Account</p>
                    <button onClick={() => navigate("/signup")} className='text-[#0f172a]'>SIGNUP</button>
                </div>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    variant="filled" 
                    sx={{ width: '100%' }}
                >
                    Login Successful!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;
