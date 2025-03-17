import { Alert, Button, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { currentUser, register } from '../../redux/auth/Action';

function Signup() {
    const [inputData, setInputData] = useState({ fullName: "", email: "", password: "" });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const {auth}=useSelector(store=>store)
    const jwt=localStorage.getItem('jwt');
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("data",inputData)
        dispatch(register(inputData))
    }
    const handleChange = (e) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false)
    }
    useEffect(()=>{
        if (jwt){
            dispatch(currentUser(jwt))
        }
    },[jwt])
    useEffect(()=>{
        if (auth.reqUser?.fullName || jwt!=null){
            setOpenSnackbar(true); 
            setTimeout(() => navigate('/'), 1000); 
        }
    },[auth.reqUser])
    return (
        <div className='flex justify-center h-screen items-center'>
            <div className='w-[30%] p-10 shadow-md bg-white border-2 border-[#0f172a]'>
                <form onSubmit={handleSubmit} className='space-y-3'>
                    <div>
                        <p className='mb-2'>Username</p>
                        <input type="text" className='py-1 border-2 border-[#0f172a] w-full rounded-md  px-1' name='fullName'
                            placeholder='Enter Your Username' onChange={(e)=>handleChange(e)} value={inputData.fullName}
                        />
                    </div>
                    <div>
                        <p className='mb-2'>Email</p>
                        <input type="email" className='py-1 border-2 border-[#0f172a] w-full rounded-md  px-1' name='email'
                            placeholder='Enter Your Email' onChange={(e)=>handleChange(e)} value={inputData.email}
                        />
                    </div>
                    <div>
                        <p className='mb-2'>Password</p>
                        <input type="password" className='py-1 border-2 border-[#0f172a] w-full rounded-md  px-1' name='password'
                            placeholder='Enter Your Password' onChange={(e)=>handleChange(e)} value={inputData.password}
                        />
                    </div>
                    <div>
                        <Button type="submit" className="w-full" variant="contained" sx={{ bgcolor: "#0f172a" }} >SIGNUP</Button>
                    </div>
                </form>
                <div className='flex space-x-3 items-center mt-5'>
                    <p className="m-0">Already Have Account</p>
                    <button onClick={() => navigate("/login")} className='text-[#0f172a]'>LOGIN</button>
                </div>
            </div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Signup Successfull!
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Signup