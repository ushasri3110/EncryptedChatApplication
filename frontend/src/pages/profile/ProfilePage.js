import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/auth/Action';
import { Avatar } from '@mui/material';

function ProfilePage({handleOpenCloseProfile}) {
    const jwt=localStorage.getItem('jwt')
    const [flag,setFlag]=useState(false);
    const auth=useSelector(store=>store.auth)
    const [username,setUsername]=useState(auth.reqUser?.fullName);
    const [tempPicture,setTempPicture]=useState(null);
    const dispatch=useDispatch()
    const handleFlag=()=>{
        setFlag(true)
    }
    const handleCheckClick=()=>{
        setFlag(false)
        const dataa={
            jwt:jwt,
            data:{fullName:username}
        }
        dispatch(updateUser(dataa))
    }
    const handleChange=(e)=>{
        setUsername(e.target.value)
    }
    const uploadToCloudinary=(pics)=>{
        const data=new FormData();
        data.append("file",pics);
        data.append("upload_preset", "chatapplication");
        data.append("cloud_name","docjmwbuo")
        fetch("https://api.cloudinary.com/v1_1/docjmwbuo/image/upload",{
            method:"post",
            body:data
        })
        .then((res)=>res.json())
        .then((data)=>{
            setTempPicture(data.url.toString())
            const dataa={
                userId:auth.reqUser.userId,
                jwt:jwt,
                data:{profilePic:data.url.toString()}
            }
            dispatch(updateUser(dataa))
        })
    }
  return (
    <div className='h-full w-full  bg-gray-300'>
        <div className='flex items-center bg-[#0f172a] text-white pt-10 pb-5 px-10 gap-16'>
            <KeyboardBackspaceIcon onClick={handleOpenCloseProfile} className='cursor-pointer'/>
            <p className='cursor-pointer font-semibold text-2xl'>Profile</p>
        </div>
        <div className='flex flex-col items-center justify-center my-8 '>
            <label htmlFor="imgInput">
                <Avatar src={auth.reqUser.profilePic||tempPicture} className='cursor-pointer' sx={{height:"12vw",width:"12vw"}}/>
            </label>
            <input type="file" id="imgInput" className='hidden'  onChange={(e)=>uploadToCloudinary(e.target.files[0])} />
        </div>
        <div className='bg-white px-3'>
            <p>Your Name</p>
            {flag?<div  className='w-full flex justify-between items-center'>
                <input type='text' placeholder='Enter Your Name' className='w-[80%] outline-none border-b-2 border-blue-700 py-3' onChange={handleChange} value={username}/>
                <CheckIcon className='cursor-pointer' onClick={handleCheckClick}/>
            </div>:
            <div className='w-full flex justify-between items-center'>
            <p className='py-3'>{username || "username"}</p>
            <EditIcon className='cursor-pointer' onClick={handleFlag}/>
            </div>}
        </div>
        <div className='px-3 my-5'>
            <p className='text-sm'>This is not your username, this will be visible to your chat contacts.</p>
        </div>
    </div>
  )
}

export default ProfilePage