import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatBotIcon from '../components/ChatBotIcon'
import ChatForm from '../components/ChatForm'
import ChatMessage from '../components/ChatMessage'
import { storeInfo, products, faqList, promotions, greetings, services } from '../companyinfo'


const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: 'model',
      text: greetings[Math.floor(Math.random() * greetings.length)],
    },
    {
      hideInChat: true,
      role: 'model',
      text: `📍 ${storeInfo.name}\n🏠 ${storeInfo.address}\n🕰️ ${storeInfo.openHours}\n📞 ${storeInfo.hotline}\n🌐 ${storeInfo.website}`,
    },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== 'Thinking...'),
        { role: 'model', text, isError },
      ])
    }

    const lastUserMessage = history[history.length - 1].text.toLowerCase()

    if (lastUserMessage.includes('sản phẩm') || lastUserMessage.includes('giá') || lastUserMessage.includes('áo') || lastUserMessage.includes('quần')) {
      const productList = products
        .map((p) => `- ${p.name} (${p.type}): ${p.price.toLocaleString()}đ`)
        .join('\n')
      updateHistory(`Dưới đây là các sản phẩm của IronPulse:\n${productList}`)
      return
    }

    const matchedFAQ = faqList.find((faq) =>
      lastUserMessage.includes(faq.question.toLowerCase().split(' ')[0])
    )
    if (matchedFAQ) {
      updateHistory(matchedFAQ.answer)
      return
    }

    if (lastUserMessage.includes('ưu đãi') || lastUserMessage.includes('khuyến mãi') || lastUserMessage.includes('voucher')) {
      const promoList = promotions.map((promo) => `- ${promo}`).join('\n')
      updateHistory(`IronPulse hiện đang có các ưu đãi:\n${promoList}`)
      return
    }

    if (lastUserMessage.includes('dịch vụ') || lastUserMessage.includes('hỗ trợ') || lastUserMessage.includes('chính sách')) {
      const serviceList = services.map((s) => `- ${s}`).join('\n')
      updateHistory(`IronPulse hiện đang cung cấp các dịch vụ:\n${serviceList}`)
      return
    }
     

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }))

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: history }),
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error.message || 'Something went wrong!')
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1').trim()
      updateHistory(apiResponseText)
    } catch (error) {
      updateHistory(error.message, true)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [chatHistory, isOpen])

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end z-50">
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-4 rounded-full shadow-xl text-white hover:from-purple-700 hover:to-indigo-700 transition flex items-center justify-center"
      >
        <ChatBotIcon />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-80 max-w-full shadow-xl rounded-3xl overflow-hidden bg-white flex flex-col mt-3 border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <ChatBotIcon />
                <h2 className="text-lg font-semibold tracking-wide">ChatBot</h2>
              </div>
              <button
                onClick={toggleChat}
                className="material-symbols-rounded text-white text-2xl hover:scale-110 transition"
              >
                close
              </button>
            </div>

            {/* Chat Body */}
            <div
              ref={chatBodyRef}
              className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96 bg-gray-50 rounded-b-3xl scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200"
            >
              <div className="flex items-start gap-2">
                <ChatBotIcon />
                <p className="bg-white p-4 rounded-xl shadow-lg text-sm text-gray-800">
                  👋 Chào bạn<br />Mình có thể giúp gì được cho bạn?
                </p>
              </div>

              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t flex items-center gap-2 bg-white">
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chatbot
