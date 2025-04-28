import React, { useRef } from 'react'

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const userMessage = inputRef.current.value.trim()
    if (!userMessage) return
    inputRef.current.value = ''

    // Update history user
    setChatHistory((history) => [...history, { role: 'user', text: userMessage }])

    setTimeout(() => {
      // Add a thinking ...
      setChatHistory((history) => [...history, { role: 'model', text: 'Thinking...' }])

      // Call the function to generate the bot's response
      generateBotResponse([
        ...chatHistory,
        { role: 'user', text: `Using the details provided above, please address this query: ${userMessage}` }
      ])
    }, 600)
  }

  return (
    <div className="p-3 bg-white border-t border-gray-200">
      <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
          required
        />
        <button
          type="submit"
          className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300"
        >
          <span className="material-symbols-rounded text-xl">arrow_upward</span>
        </button>
      </form>
    </div>
  )
}

export default ChatForm
