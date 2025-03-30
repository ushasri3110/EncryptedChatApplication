import { Avatar, Menu, MenuItem } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import ChatCard from '../chatcard/ChatCard';
import RightImage from './RightImage';
import MessageCard from '../message/MessageCard';
import ProfilePage from '../profile/ProfilePage';
import CreateGroup from '../group/CreateGroup';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, logout, searchUser } from '../../redux/auth/Action';
import { useNavigate } from 'react-router-dom';
import { createChat, getUserChats } from '../../redux/chat/Action';
import { createMessage, getAllMessages } from '../../redux/message/Action'
import SockJs from "sockjs-client/dist/sockjs";
import { over } from "stompjs";
import JSEncrypt from 'jsencrypt';
import { ContentCut } from '@mui/icons-material';

function HomePage() {
    const jwt = localStorage.getItem('jwt');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = useSelector(store => store.auth);
    const reqUser = auth.reqUser
    const chat = useSelector(store => store.chat);
    const chats = useSelector(store => store.chat.chats) || [];
    const searchedUsers = useSelector(store => store.auth.searchUser) || [];
    const [query, setQuery] = useState("");
    const [currentChat, setCurrentChat] = useState(null);
    const [isProfile, setIsProfile] = useState(false);
    const [isGroup, setIsGroup] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [isConnect, setIsConnent] = useState(false)
    const [stompClient, setStompClient] = useState()
    const [messages, setMessages] = useState([])
    const message = useSelector(store => store.message)
    const name = currentChat
        ? (currentChat.group
            ? currentChat.chatName
            : reqUser?.userId !== currentChat.users[0]?.userId
                ? currentChat.users[0].fullName
                : currentChat.users[1].fullName)
        : '';

    const image = currentChat
        ? (currentChat.group
            ? currentChat.chatImage
            : reqUser?.userId !== currentChat.users[0]?.userId
                ? currentChat.users[0].profilePic
                : currentChat.users[1].profilePic)
        : '';
    const [content, setContent] = useState();
    const newMessage = useSelector(store => store.message?.newMessage)

    useEffect(() => {
        dispatch(getAllMessages({ chatId: currentChat?.chatId, jwt: jwt }))
    }, [currentChat])

    const encryptMessage = (message, recipientPublicKey) => {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(recipientPublicKey);
        return encryptor.encrypt(message);
    };

    const decryptMessage = (encryptedMessage, privateKey) => {
        const decryptor = new JSEncrypt();
        decryptor.setPrivateKey(privateKey);
        const decrypted = decryptor.decrypt(encryptedMessage);
        return decrypted;
    };

    const handleCreateNewMessage = () => {
        if (currentChat?.chatId) {
            const recipientPublicKey = currentChat.users.find(
                user => user.userId !== reqUser.userId
            )?.publicKey;
            console.log(content)
            // const encryptedMessage = encryptMessage(content, recipientPublicKey);
            dispatch(
                createMessage({
                    data: { chatId: currentChat?.chatId, content: content },
                    jwt,
                })
            );
            setContent('');
        }
    };

    const connect = () => {
        const sock = new SockJs("http://localhost:8090/ws")
        const temp = over(sock)
        setStompClient(temp)
        const headers = {
            Authorization: `Bearer ${jwt}`,
            "X-XSRF-TOKEN": getCookie("XSRF_TOKEN")
        }
        temp.connect(headers, onConnect, onError)
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(";").shift();
        }
    }
    const onConnect = () => {
        console.log("WebSocket Connected");
        setIsConnent(true)
    }
    const onError = (error) => {
        console.log("error", error);
    }
    const handleCurrentChat = (item) => {
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
        dispatch(createChat({ userId, jwt }))
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
    const onMessageReceive = (payload) => {
        console.log(JSON.parse(payload.body))
        const receivedMessage = JSON.parse(payload.body);
        const privateKey=localStorage.getItem('privateKey')
        console.log("Private Key:", privateKey);
        // const decryptedMessage = decryptMessage(receivedMessage.content,privateKey);

        setMessages(prevMessages => [
            ...prevMessages,
            { ...receivedMessage, content: receivedMessage.content },
        ]);
    };

    useEffect(() => {
        if (isConnect && stompClient && auth.reqUser && currentChat) {
            const subscription = stompClient.subscribe(
                `/group/${currentChat.chatId}`,
                onMessageReceive
            );
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnect, stompClient, auth.reqUser, currentChat]);

    useEffect(() => {
        connect();
    }, [])

    useEffect(() => {
        if (jwt) {
            dispatch(currentUser(jwt))
        }
    }, [jwt, dispatch])

    useEffect(() => {
        if (!jwt) {
            navigate("/login")
        }
    }, [auth.reqUser, navigate, jwt])

    useEffect(() => {
        dispatch(getUserChats(jwt))
    }, [chat.createdChat, chat.createdGroup, dispatch])

    useEffect(() => {
        if (message.newMessage && stompClient) {
            setMessages(prev => [...(Array.isArray(prev) ? prev : []), message.newMessage]);
            stompClient.send("/app/message", {}, JSON.stringify(message.newMessage))
        }
    }, [message?.newMessage])

    useEffect(() => {
        setMessages(message.messages)
    }, [message?.messages])

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
                                    <div key={index} onClick={() => handleClickOnCurrentChat(item.userId)}>
                                        <ChatCard name={item.fullName} image={item.profilePic} />
                                    </div>
                                ))}
                                {chats?.length > 0 && !query && Array.isArray(chats) && chats.map((item, index) => (
                                    <div key={index} onClick={() => handleCurrentChat(item)}>
                                        {item.group ? <ChatCard name={item.chatName} image={item.chatImage} /> : <ChatCard
                                            name={auth.reqUser?.userId !== item.users[0]?.userId ? item.users[0].fullName : item.users[1].fullName}
                                            image={auth.reqUser?.userId !== item.users[0]?.userId ? item.users[0].profilePic : item.users[1].profilePic}
                                        />}
                                    </div>
                                ))}
                            </div>
                        </div>}
                </div>
                {/* Right Section */}

                <div className='right w-[68%] h-full'>
                    <div>{currentChat ? <div className="flex justify-center items-center">
                        {/* <MessagePage currentChat={currentChat} reqUser={auth.reqUser} messages={messages}/> */}
                        <div className='w-[100%] border-2'>
                            <div className='flex flex-row justify-between p-1 bg-[#f0f2f5]'>
                                <div className='flex flex-row items-center gap-2'>
                                    <div><Avatar alt="Image" src={image} /></div>
                                    <div>{name}</div>
                                </div>
                                <div className='flex flex-row gap-2 items-center'>
                                    <SearchIcon className='cursor-pointer' />
                                    <MoreVertIcon className='cursor-pointer' />
                                </div>
                            </div>
                            <div className='bg-blue-200 h-[73vh] overflow-y-scroll px-5'>
                                <div className='space-y-1 flex flex-col items-start py-2'>
                                    {messages.length > 0 && messages.map((item, i) => (
                                        <MessageCard key={i} content={item.content} isReqUserMessage={item.user?.userId === reqUser.userId} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className='flex flex-row justify-between px-5 py-2 items-center'>
                                    <TagFacesIcon className='cursor-pointer' />
                                    <AttachFileIcon className='cursor-pointer' />
                                    <input type='text' className='rounded-lg bg-[#d6d3d1] w-[85%] h-[35px] p-2' placeholder='Type a Message' onChange={(e) => setContent(e.target.value)} value={content}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                handleCreateNewMessage();
                                                setContent("");
                                            }
                                        }}
                                    />
                                    <KeyboardVoiceIcon className='cursor-pointer' />
                                </div>
                            </div>
                        </div>
                    </div> :
                        <div className='flex items-center justify-center h-full'>{!currentChat && <RightImage />}</div>}</div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;