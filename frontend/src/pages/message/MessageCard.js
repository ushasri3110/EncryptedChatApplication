import React from 'react'

function MessageCard({ isReqUserMessage, content }) {
  return (
    <div className={`py-2 px-1 rounded-md inline-block max-w-[50%] ${isReqUserMessage ? "self-end bg-[#0f172a] text-white" : 'self-start bg-white'}`}>
      <p>{content}</p>
    </div>
  )
}

export default MessageCard