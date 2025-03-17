import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Avatar, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch } from 'react-redux';
import { createGroupChat } from '../../redux/chat/Action';
function NewGroup({ groupMember,handleOpenCloseGroup }) {
    const jwt = localStorage.getItem('jwt');
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [groupImage, setGroupImage] = useState(null);
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState("");
    const handleCreate = () => {
        const userIds = [];
        for (let user of groupMember) {
            userIds.push(user.userId)
        }
        const group={
            chatName: groupName,
            userIds: userIds,
            chatImage:groupImage
        }
        const chatData={
            data:group,
            jwt:jwt
        }
        dispatch(createGroupChat(chatData))
        handleOpenCloseGroup()
    }
    const uploadToCloudinary=(pics)=>{
        setIsImageUploading(true)
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
                setGroupImage(data.url.toString())
                setIsImageUploading(false)
            })
        }
    return (
        <div className='w-full h-full'>
            <div className='flex items-center justify-center bg-[#0f172a] text-white pt-5 pb-5 px-[20px] w-full gap-[20px]'>
                <KeyboardBackspaceIcon className='cursor-pointer' />
                <p className='cursor-pointer font-semibold text-xl wrap-content'>New Group</p>
            </div>

            <div className='flex flex-col justify-center items-center py-10'>
                <label htmlFor='imgInput' className='relative'>
                    <Avatar src={groupImage} sx={{ width: "150px", height: "150px" }} />
                    {isImageUploading && <CircularProgress className='absolute top-[5rem] left-[6rem]' />}
                </label>
                <input type='file' id='imgInput' accept='image/*' className='hidden' onChange={(e)=>uploadToCloudinary(e.target.files[0])} />
            </div>
            <div className='w-full flex justify-center items-center '>
                <input type="text" onChange={(e) => setGroupName(e.target.value)} className='w-full outline-none border-b-2 border-blue-700 bg-transparent px-2' placeholder='Enter Group Name' value={groupName} />
            </div>
            {
                groupName &&
                <div className='py-10 bg-slate-200 flex justify-center items-center'>
                    <button className='cursor-pointer rounded-full p-4 bg-blue-700' onClick={handleCreate}>
                        <CheckIcon className='text-white text-3xl' />
                    </button>
                </div>
            }
        </div>
    )
}

export default NewGroup