import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Avatar } from '@mui/material';
function SelectedMember({ handleRemoveMember, member }) {
  return (
    <div className='flex items-center bg-slate-300 rounded-full'>
      <Avatar src={member.profilePic}  sx={{width:25,height:25}}/>
      <p className='px-2 text-sm'>{member.fullName}</p>
      <CloseIcon onClick={() => handleRemoveMember(member)} className='cursor-pointer pr-1' />
    </div>
  )
}

export default SelectedMember