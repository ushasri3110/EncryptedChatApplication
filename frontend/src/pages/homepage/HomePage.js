import { Avatar, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import ChatCard from '../chatcard/ChatCard';
import RightImage from './RightImage';
import MessagePage from '../message/MessagePage';
import ProfilePage from '../profile/ProfilePage';
import CreateGroup from '../group/CreateGroup';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, logout, searchUser } from '../../redux/auth/Action';
import { useNavigate } from 'react-router-dom';
import { createChat, getUserChats } from '../../redux/chat/Action';

function HomePage() {
    const jwt = localStorage.getItem('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth  = useSelector(store => store.auth);
    const chat=useSelector(store=>store.chat);
    const chats=useSelector(store=>store.chat.chats)||[];
    const searchedUsers=useSelector(store=>store.auth.searchUser) || [];
    const [query, setQuery] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [isProfile, setIsProfile] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleCurrentChat=(item)=>{
        setCurrentChat(item)
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleNavigate = () => {
        setIsProfile(true)
    }
    const handleSearch = (searchQuery) => {
        dispatch(searchUser({ query: searchQuery, jwt }));
    };
    const handleClickOnCurrentChat = (userId) => {
        dispatch(createChat({userId,jwt}))
        setQuery("")
    }
    const handleOpenCloseProfile = () => {
        setIsProfile(!isProfile)
    }
    const handleCreateGroup = () => {
        setIsGroup(true)
        handleClose();
    }
    const handleOpenCloseGroup = () => {
        setIsGroup(!isGroup)
    }
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }
    useEffect(() => {
        if (jwt) {
            dispatch(currentUser(jwt))
        }
    }, [jwt])
    useEffect(() => {
        if (!auth.reqUser) {
            navigate("/login")
        }
    }, [auth.reqUser])
    useEffect(()=>{
        dispatch(getUserChats(jwt))
    },[chat.createdChat,chat.createdGroup])
    return (
        <div className='relative'>
            <div className='w-full py-14 bg-[#0f172a]'></div>
            <div className='flex bg-[#f0f2f5] h-[94vh] absolute top-6 left-6 w-[95%] mx-2 justify-between'>

                {/* Left Section with Scrollbar */}

                <div className='left bg-[#f0f2f5] w-[30%] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 border-2'>
                    {isProfile && <ProfilePage handleOpenCloseProfile={handleOpenCloseProfile} />}
                    {isGroup && <CreateGroup handleOpenCloseGroup={handleOpenCloseGroup} />}
                    {!isProfile && !isGroup &&
                        <div>
                            <div className="flex flex-row justify-between p-2 bg-[#d6d3d1]">
                                <div className='flex flex-row items-center gap-3'>
                                    <Avatar alt="Image" src={auth.reqUser?.profilePic} onClick={handleNavigate} className='cursor-pointer' />
                                    <div>{auth.reqUser?.fullName}</div>
                                </div>
                                <div className='flex items-center gap-3 justify-center'>
                                    {/* <MessageIcon className='cursor-pointer' /> */}
                                    <div>
                                        <button
                                            id="basic-button"
                                            aria-controls={open ? 'basic-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon className='cursor-pointer' />
                                        </button>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                                            <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </div>

                            {/* Search Input */}

                            <div className='flex justify-between items-center p-2 gap-1'>
                                <input type="text" placeholder='Search' className='rounded-lg bg-[#d6d3d1] w-[95%] h-[30px] p-2' onChange={(e) => {
                                    setQuery(e.target.value)
                                    handleSearch(e.target.value)
                                }} value={query} />
                                <SearchIcon />
                            </div>

                            {/* Chat List */}

                            <div>
                                {query && Array.isArray(searchedUsers) && searchedUsers.map((item, index) => (
                                    <div key={index} onClick={(item)=>handleClickOnCurrentChat(item.userId)}>
                                        <ChatCard  name={item.fullName} image={item.profilePic}/>
                                    </div>
                                ))}
                                {chats?.length>0 && !query && Array.isArray(chats) && chats.map((item, index) => (
                                    <div key={index} onClick={()=>handleCurrentChat(item)}>
                                        {item.isGroup?<ChatCard name={item.chatName} image={item.chatImage} />:<ChatCard 
                                        name={auth.reqUser?.userId !==item.users[0]?.userId ? item.users[0].fullName:item.users[1].fullName}
                                        image={auth.reqUser?.userId !==item.users[0]?.userId ? item.users[0].profilePic:item.users[1].profilePic}
                                        />}
                                    </div>
                                ))}
                            </div>
                        </div>}
                </div>

                {/* Right Section */}

                <div className='right w-[68%] h-full'>
                    <div>{currentChat ? <div className="flex justify-center items-center">
                        <MessagePage currentChat={currentChat} reqUser={auth.reqUser}/>
                        </div> :
                        <div className='flex items-center justify-center h-full'>{!currentChat && <RightImage />}</div>}</div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;