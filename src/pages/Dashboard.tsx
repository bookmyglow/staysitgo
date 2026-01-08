import { MessageSquare, Calendar, Heart, TrendingUp, Star, CheckCircle, Shield } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your account.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Active Listings</div>
              <Heart className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <div className="text-sm text-green-600 mt-2">↑ 1 this week</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Unread Messages</div>
              <MessageSquare className="h-5 w-5 text-secondary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-500 mt-2">2 new today</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Upcoming Bookings</div>
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-500 mt-2">Next on Jan 15</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Profile Views</div>
              <TrendingUp className="h-5 w-5 text-secondary-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">127</div>
            <div className="text-sm text-green-600 mt-2">↑ 23% this month</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Email Verified</div>
                      <div className="text-sm text-gray-600">Your email is confirmed</div>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">Complete</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Profile Photo</div>
                      <div className="text-sm text-gray-600">Profile looks great!</div>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">Complete</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-yellow-600" />
                    <div>
                      <div className="font-medium text-gray-900">Identity Verification</div>
                      <div className="text-sm text-gray-600">Complete verification to build trust</div>
                    </div>
                  </div>
                  <button className="text-primary-600 font-medium hover:text-primary-700">
                    Verify Now
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-gray-700">JD</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-gray-900">Jane Doe</div>
                        <div className="text-xs text-gray-500">2h ago</div>
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        Hi! I'm interested in your pet sitting services...
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Active Listings</h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Manage All
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Experienced Dog Walker Available', type: 'Offering', status: 'Active' },
                  { title: 'Looking for Cat Sitter in Brooklyn', type: 'Seeking', status: 'Active' },
                  { title: 'Weekend Pet Care Services', type: 'Offering', status: 'Active' },
                ].map((listing, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{listing.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{listing.type}</div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {listing.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">JS</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">John Smith</div>
                  <div className="text-sm text-gray-600">Pet Parent & Sitter</div>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700 ml-1">4.8 (24 reviews)</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline w-full">Edit Profile</button>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Trust & Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Email Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Phone Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-500">ID Not Verified</span>
                  </div>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    Verify
                  </button>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="text-sm font-medium text-gray-900">Basic</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">Jan 2024</span>
                </div>
              </div>
              <button className="btn btn-primary w-full mt-4">
                Upgrade to Premium
              </button>
            </div>

            <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our support team is here 24/7 to assist you with any questions.
              </p>
              <button className="btn btn-outline w-full">Contact Support</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
