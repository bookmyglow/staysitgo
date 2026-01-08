import { Search, Send } from 'lucide-react';

export default function Messages() {
  const conversations = [
    { id: 1, name: 'Jane Doe', lastMessage: 'Thanks for your help!', time: '2h', unread: true, avatar: 'JD' },
    { id: 2, name: 'Mike Johnson', lastMessage: 'See you tomorrow', time: '5h', unread: false, avatar: 'MJ' },
    { id: 3, name: 'Sarah Williams', lastMessage: 'How much do you charge?', time: '1d', unread: false, avatar: 'SW' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-700">{conversation.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-gray-900">{conversation.name}</div>
                        <div className="text-xs text-gray-500">{conversation.time}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-sm truncate ${conversation.unread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {conversation.lastMessage}
                        </div>
                        {conversation.unread && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 card overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-700">JD</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Jane Doe</div>
                  <div className="text-sm text-gray-600">Active now</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p className="text-gray-800">Hi! I'm interested in your pet sitting services for next week.</p>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-lg p-3 max-w-xs">
                  <p>Great! I'd be happy to help. What type of pet do you have?</p>
                  <p className="text-xs text-primary-100 mt-1">10:32 AM</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                  <p className="text-gray-800">I have a golden retriever. She's very friendly!</p>
                  <p className="text-xs text-gray-500 mt-1">10:35 AM</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="btn btn-primary">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
