import React from 'react'
import ChatBotIcon from './ChatBotIcon'
import { motion } from 'framer-motion'

const ChatMessage = ({ chat }) => {
    return (
        !chat.hideInChat && (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${chat.role === 'model' ? 'justify-start' : 'justify-end'} mb-4`}
            >
                {chat.role === 'model' && <ChatBotIcon />}
                <p
                    className={`p-4 rounded-2xl shadow-lg text-sm max-w-[80%] break-words
                    ${chat.role === 'model' ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}
                >
                    {chat.text}
                </p>
            </motion.div>
        )
    )
}

export default ChatMessage
