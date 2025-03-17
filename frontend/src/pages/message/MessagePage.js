// import { Avatar } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import SearchIcon from '@mui/icons-material/Search';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import TagFacesIcon from '@mui/icons-material/TagFaces';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
// import MessageCard from './MessageCard';
// import { useDispatch, useSelector } from 'react-redux';
// import { createMessage, getAllMessages } from '../../redux/message/Action';
// function MessagePage({currentChat,reqUser,messages}) {
//     console.log(messages)
//     const jwt=localStorage.getItem('jwt');
//     const {message}=useSelector(store=>store)
//     const name=currentChat.group?currentChat.chatName:reqUser?.userId !==currentChat.users[0]?.userId ? currentChat.users[0].fullName:currentChat.users[1].fullName;
//     const image=currentChat.group?currentChat.chatImage:reqUser?.userId!==currentChat.users[0]?.userId? currentChat.users[0].profilePic:currentChat.users[1].profilePic;
//     const [content,setContent]=useState();
//     const newMessage=useSelector(store=>store.message?.newMessage)
//     const dispatch=useDispatch();
//     useEffect(()=>{
//      dispatch(getAllMessages({chatId:currentChat?.chatId,jwt:jwt}))
//     },[newMessage,currentChat])
//     const handleCreateNewMessage=()=>{
//         if (currentChat?.chatId)
//         dispatch(createMessage({data:{chatId:currentChat?.chatId,content:content},jwt:jwt}))
//     }
//     return (
//         <div className='w-[100%] border-2'>
//             <div className='flex flex-row justify-between p-1 bg-[#f0f2f5]'>
//                 <div className='flex flex-row items-center gap-2'>
//                     <div><Avatar alt="Image" src={image} /></div>
//                     <div>{name}</div>
//                 </div>
//                 <div className='flex flex-row gap-2 items-center'>
//                     <SearchIcon  className='cursor-pointer'/>
//                     <MoreVertIcon  className='cursor-pointer'/>
//                 </div>
//             </div>
//             <div className='bg-blue-200 h-[73vh] overflow-y-scroll px-5'>
//                 <div className='space-y-1 flex flex-col items-start py-2'>
//                     {messages.length>0 && messages.map((item, i) => (
//                         <MessageCard key={i} content={item.content} isReqUserMessage={item.user?.userId===reqUser.userId} />
//                     ))}
//                 </div>
//             </div>
//             <div>
//                 <div className='flex flex-row justify-between px-5 py-2 items-center'>
//                     <TagFacesIcon className='cursor-pointer'/>
//                     <AttachFileIcon className='cursor-pointer' />
//                     <input type='text' className='rounded-lg bg-[#d6d3d1] w-[85%] h-[35px] p-2' placeholder='Type a Message' onChange={(e)=>setContent(e.target.value)} value={content}
//                     onKeyPress={(e)=>{
//                         if (e.key==="Enter"){
//                             handleCreateNewMessage();
//                             setContent("");
//                         }
//                     }}
//                     />
//                     <KeyboardVoiceIcon className='cursor-pointer'/>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default MessagePage
