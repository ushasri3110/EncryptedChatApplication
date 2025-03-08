import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
function SelectedMember({ handleRemoveMember, member }) {
  return (
    <div className='flex items-center bg-slate-300 rounded-full'>
      <img src="https://cdn.pixabay.com/photo/2014/04/09/10/31/macaw-320006_1280.jpg" className='w-7 h-7 rounded-full' />
      <p className='px-2'>username</p>
      <CloseIcon onClick={() => handleRemoveMember(member)} className='cursor-pointer pr-1' />
    </div>
  )
}

export default SelectedMember