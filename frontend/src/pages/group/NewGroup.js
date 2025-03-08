import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
function NewGroup() {
    const [isImageUploading, setIsImageUploading] = useState(false)
    const [groupName, setGroupName] = useState("")
    return (
        <div className='w-full h-full'>
            <div className='flex items-center justify-center bg-[#0f172a] text-white pt-5 pb-5 px-[20px] w-full gap-[20px]'>
                <KeyboardBackspaceIcon className='cursor-pointer' />
                <p className='cursor-pointer font-semibold text-xl wrap-content'>New Group</p>
            </div>

            <div className='flex flex-col justify-center items-center py-10'>
                <label htmlFor='imgInput' className='relative'>
                    <img src="https://cdn.pixabay.com/photo/2014/04/09/10/31/macaw-320006_1280.jpg" className='w-[150px] h-[150px] rounded-full' />
                    {isImageUploading && <CircularProgress className='absolute top-[5rem] left-[6rem]' />}
                </label>
                <input type='file' id='imgInput' accept='image/*' className='hidden' onChange={() => console.log("image change")} />
            </div>
            <div className='w-full flex justify-center items-center '>
                <input type="text" onChange={(e) => setGroupName(e.target.value)} className='w-full outline-none border-b-2 border-blue-700 bg-transparent px-2' placeholder='Enter Group Name' value={groupName} />
            </div>
            {
                groupName &&
                <div className='py-10 bg-slate-200 flex justify-center items-center'>
                    <button className='cursor-pointer rounded-full p-4 bg-blue-700'>
                        <CheckIcon className='text-white text-3xl' />
                    </button>
                </div>
            }
        </div>
    )
}

export default NewGroup