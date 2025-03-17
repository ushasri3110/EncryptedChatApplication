import { Avatar } from '@mui/material';
import React from 'react';

function ChatCard({ name, image}) {
  return (
    <div className='flex flex-row justify-between p-2 items-center cursor-pointer'>
      <div className='flex flex-row items-center gap-3'>
        <Avatar alt="Image" src={image} />
        <div>
          <div className='text-lg'>{name}</div>
          {/* <div className='text-sm text-gray-600 truncate max-w-[200px]'>
            {lastMessage ? lastMessage.content : 'No messages yet'}
          </div> */}
        </div>
      </div>
      <div className='text-right text-sm text-gray-500'>
        {/* {lastMessage ? formatTime(lastMessage.timestamp) : ''} */}
        {/* Uncomment if you want to show unread count */}
        {/* <div><p className='rounded-full bg-[#16a34a] px-1 py-1 text-sm'>5</p></div> */}
      </div>
    </div>
  );
}

export default ChatCard;
