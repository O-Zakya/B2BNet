
'use client';

import { useState } from 'react';

export default function MessagesDashboard() {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageText, setMessageText] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Maizzou Hanane',
      company: 'Tech Solutions',
      lastMessage: 'Thanks you!',
      time: '5m ago',
      unread: 3,
      online: true,
      messages: [
        { sender: 'them', text: 'Hi, how are you?', time: '10:30 AM', translated: false },
        { sender: 'me', text: 'Hello! I am doing well, thank you. How about you?', time: '10:32 AM', translated: false },
        { sender: 'them', text: 'Great! I wanted to discuss the new project proposal', time: '10:35 AM', translated: false },
        { sender: 'me', text: 'Perfect timing! I just finished reviewing it', time: '10:37 AM', translated: false },
        { sender: 'them', text: 'Thank you!', time: '10:40 AM', translated: false }
      ]
    },
    {
      id: 2,
      name: 'Anouar El Ghali',
      company: 'Global Dynamics',
      lastMessage: 'Can we schedule a call tomorrow?',
      time: '12m ago',
      unread: 1,
      online: true,
      messages: [
        { sender: 'them', text: '你好！我们可以讨论一下合作吗？', time: '9:20 AM', translated: true, original: '你好！我们可以讨论一下合作吗？', translation: 'Hello! Can we discuss cooperation?' },
        { sender: 'me', text: 'Of course! I would love to discuss potential collaboration opportunities', time: '9:25 AM', translated: false },
        { sender: 'them', text: 'Perfect! When would be a good time for you?', time: '9:30 AM', translated: false },
        { sender: 'them', text: 'Can we schedule a call tomorrow?', time: '9:45 AM', translated: false }
      ]
    },
    {
      id: 3,
      name: 'Fatima El Mahdaoui',
      company: 'Innovation Labs',
      lastMessage: 'The documents are ready for review',
      time: '1h ago',
      unread: 0,
      online: false,
      messages: [
        { sender: 'them', text: 'Hi, I have prepared the documents you requested', time: '8:15 AM', translated: false },
        { sender: 'me', text: 'Excellent! Thank you for preparing them so quickly', time: '8:20 AM', translated: false },
        { sender: 'them', text: 'The documents are ready for review', time: '8:50 AM', translated: false }
      ]
    }
  ];

  const currentChat = chats[selectedChat];

  const sendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2">
          <i className="ri-chat-new-fill w-4 h-4 flex items-center justify-center"></i>
          <span>New Chat</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-100 h-[700px] flex">
        {/* Chat List */}
        <div className="w-1/3 border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-full">
            {chats.map((chat, index) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(index)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === index ? 'bg-purple-50 border-purple-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{chat.name}</p>
                      <p className="text-xs text-gray-500">{chat.time}</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.company}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {currentChat.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {currentChat.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentChat.name}</p>
                  <p className="text-sm text-gray-500">{currentChat.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                  <i className="ri-phone-fill w-5 h-5 flex items-center justify-center"></i>
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                  <i className="ri-video-fill w-5 h-5 flex items-center justify-center"></i>
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                  <i className="ri-more-fill w-5 h-5 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentChat.messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'me' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.translated && (
                    <div className="mb-2">
                      <div className="flex items-center space-x-1 mb-1">
                        <i className="ri-translate-2 w-3 h-3 flex items-center justify-center opacity-70"></i>
                        <span className="text-xs opacity-70">Translated from Chinese</span>
                      </div>
                      <p className="text-sm opacity-70 italic">{message.original}</p>
                      <hr className="my-2 opacity-30" />
                    </div>
                  )}
                  <p className="text-sm">{message.translation || message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-purple-600 cursor-pointer">
                <i className="ri-attachment-fill w-5 h-5 flex items-center justify-center"></i>
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-purple-600 cursor-pointer">
                  <i className="ri-translate-2 w-4 h-4 flex items-center justify-center"></i>
                </button>
              </div>
              <button 
                onClick={sendMessage}
                className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors cursor-pointer"
              >
                <i className="ri-send-plane-fill w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1">
                  <input type="checkbox" className="rounded" />
                  <span>Auto-translate</span>
                </label>
                <span>Language: English</span>
              </div>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
