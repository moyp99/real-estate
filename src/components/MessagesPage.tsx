import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Message {
  id: number
  agentName: string
  agentPhoto: string
  agentCompany: string
  propertyTitle: string
  propertyAddress: string
  lastMessage: string
  timestamp: string
  unread: boolean
  propertyId: number
}

const MessagesPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeConversation, setActiveConversation] = useState<number | null>(null)

  // Mock messages data
  const messages: Message[] = [
    {
      id: 1,
      agentName: "Sarah Martinez",
      agentPhoto: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      agentCompany: "Pacific Coast Realty",
      propertyTitle: "Stunning Ocean View Home",
      propertyAddress: "7842 Eads Avenue, La Jolla",
      lastMessage: "Hi! I'd be happy to schedule a tour for this weekend. Are you available Saturday at 2 PM?",
      timestamp: "2 hours ago",
      unread: true,
      propertyId: 1
    },
    {
      id: 2,
      agentName: "Michael Chen",
      agentPhoto: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
      agentCompany: "Urban Realty Group",
      propertyTitle: "Modern Downtown Condo",
      propertyAddress: "1240 India Street, San Diego",
      lastMessage: "Thank you for your interest! The building amenities include a rooftop pool and fitness center.",
      timestamp: "1 day ago",
      unread: false,
      propertyId: 2
    },
    {
      id: 3,
      agentName: "Jennifer Lopez",
      agentPhoto: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
      agentCompany: "Heritage Homes Realty",
      propertyTitle: "Charming Craftsman",
      propertyAddress: "3456 30th Street, San Diego",
      lastMessage: "The inspection report is ready. Would you like me to email it to you?",
      timestamp: "3 days ago",
      unread: true,
      propertyId: 3
    }
  ]

  const MessageCard: React.FC<{ message: Message }> = ({ message }) => (
    <div 
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        message.unread ? 'bg-blue-50' : 'bg-white'
      }`}
      onClick={() => setActiveConversation(message.id)}
    >
      <div className="flex items-start space-x-3">
        {/* Agent Photo */}
        <div className="relative">
          <img
            src={message.agentPhoto}
            alt={message.agentName}
            className="w-12 h-12 rounded-full object-cover"
          />
          {message.unread && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full"></div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-sm font-semibold ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
              {message.agentName}
            </h3>
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>
          
          <p className="text-xs text-gray-600 mb-1">{message.agentCompany}</p>
          
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-800 truncate">
              {message.propertyTitle}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {message.propertyAddress}
            </p>
          </div>
          
          <p className={`text-sm truncate ${message.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
            {message.lastMessage}
          </p>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )

  const ConversationView: React.FC<{ messageId: number }> = ({ messageId }) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return null

    return (
      <div className="flex flex-col h-full">
        {/* Conversation Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center">
            <button
              onClick={() => setActiveConversation(null)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <img
              src={message.agentPhoto}
              alt={message.agentName}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{message.agentName}</h3>
              <p className="text-sm text-gray-600">{message.agentCompany}</p>
            </div>
            
            <button
              onClick={() => navigate(`/property/${message.propertyId}`)}
              className="p-2 bg-primary-100 text-primary-600 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
          
          {/* Property Context */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{message.propertyTitle}</p>
            <p className="text-xs text-gray-600">{message.propertyAddress}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-xs bg-primary-600 text-white p-3 rounded-lg rounded-br-none">
              <p className="text-sm">Hi! I'm interested in scheduling a tour for this property. When would be a good time?</p>
              <p className="text-xs opacity-75 mt-1">3 hours ago</p>
            </div>
          </div>

          {/* Agent Message */}
          <div className="flex justify-start">
            <div className="max-w-xs bg-gray-100 text-gray-900 p-3 rounded-lg rounded-bl-none">
              <p className="text-sm">{message.lastMessage}</p>
              <p className="text-xs text-gray-500 mt-1">{message.timestamp}</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (activeConversation) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        <ConversationView messageId={activeConversation} />
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/main')}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            <p className="text-xs text-gray-500">{messages.filter(m => m.unread).length} unread</p>
          </div>
        </div>
        
        <button className="p-2 bg-gray-100 rounded-full">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pt-20 pb-16 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600 text-center mb-6 max-w-sm">
              When you contact agents about properties, your conversations will appear here.
            </p>
            <button
              onClick={() => navigate('/main')}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Explore Properties
            </button>
          </div>
        ) : (
          /* Messages List */
          <div className="bg-white">
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/main')}
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>
          <button
            onClick={() => navigate('/favorites')}
            className="flex flex-col items-center justify-center py-2 px-3 text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Favorites</span>
          </button>
          <button className="flex flex-col items-center justify-center py-2 px-3 text-primary-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Messages</span>
          </button>
          <button className="flex flex-col items-center justify-center py-2 px-3 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage