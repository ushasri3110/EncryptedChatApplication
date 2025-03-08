import { Avatar } from '@mui/material'
import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
function ChatCard({name,image}) {
  return (
    <div className='flex flex-row justify-between p-2 items-center cursor-pointer'>
      <div className='flex flex-row items-center gap-3'>
        <div><Avatar alt="Image" src={image} /></div>
        <div>
          <div className='text-lg'>{name}</div>
          <div className='text-sm'>hiii</div>
        </div>
      </div>
      <div>
        <div>2:30 pm</div>
        {/* <div><p className='rounded-full bg-[#16a34a] px-1 py-1 text-sm'>5</p></div> */}
      </div>
    </div>
  )
}

export default ChatCard
