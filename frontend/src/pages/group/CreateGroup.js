import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SelectedMember from './SelectedMember';
import ChatCard from '../chatcard/ChatCard';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NewGroup from './NewGroup';
function CreateGroup({ handleOpenCloseGroup }) {
    const [newGroup, setNewGroup] = useState(false);
    const [groupMember, setGroupMember] = useState(new Set())
    const [query, setQuery] = useState('');
    const handleRemoveMember = () => {

    }
    const handleSearch = (value) => {

    }
    return (
        <div className='w-full h-full'>
            {
                !newGroup &&
                <div>
                    <div className='flex items-center justify-center bg-[#0f172a] text-white pt-5 pb-5 px-[20px] w-full gap-[20px]'>
                        <KeyboardBackspaceIcon className='cursor-pointer' onClick={handleOpenCloseGroup} />
                        <p className='cursor-pointer font-semibold text-xl wrap-content'>Add Group Participants</p>
                    </div>
                    <div className='relative bg-white py-4 px-3'>
                        <div className='flex space-x-2 flex-wrap space-y-1'>
                            {
                                groupMember.size > 0 &&
                                Array.from(groupMember).map((item) => (
                                    <SelectedMember handleRemoveMember={() => handleRemoveMember(item)} member={item} />
                                ))
                            }
                        </div>
                    </div>
                    <div>
                        <input type="text" onChange={(e) => {
                            handleSearch(e.target.value)
                            setQuery(e.target.value)
                        }} className='outline-none border-b border-[#8888] p-2 w-[100%]'
                            placeholder='Search' value={query} />
                    </div>
                    <div className='bg-white overflow-y-scroll h-[40.2vh]'>
                        {query && [1, 1, 1, 1, 1].map((item) => <div onClick={() => {
                            groupMember.add(item)
                            setGroupMember(groupMember)
                            setQuery('')
                        }} key={item?.id}>
                            <hr />
                            <ChatCard />
                        </div>)}
                    </div>

                    <div className='bottom-10 py-10 bg-slate-200 flex items-center justify-center'>
                        <div className="bg-blue-500 rounded-full p-4 cursor-pointer " onClick={() => {
                            setNewGroup(true)
                        }}>
                            <ArrowForwardIcon className='text-white font-bold text-3xl cursor-pointer' />
                        </div>
                    </div>

                </div>
            }
            {newGroup && <NewGroup />}
        </div>
    )
}

export default CreateGroup