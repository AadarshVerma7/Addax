import React from 'react'
import PromptInput from './PromptInput'

function Conversations() {
    return (
        <>
            <div className='flex flex-col w-full border h-full p-4 rounded-2xl border-gray-600/40 justify-between'>
                <div className='text-white'>
                    <p>Ask Chat</p>
                </div>
                <div>
                    <PromptInput />
                </div>
            </div>
        </>
    )
}

export default Conversations