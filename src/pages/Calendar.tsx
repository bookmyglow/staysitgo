import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">Manage your bookings and availability</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">January 2024</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="btn btn-outline text-sm">Today</button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      i === 14 ? 'bg-primary-50 border-primary-300' : ''
                    } ${i === 15 || i === 16 ? 'bg-secondary-50 border-secondary-300' : ''}`}
                  >
                    <div className="text-sm font-medium text-gray-900">{((i % 31) + 1)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-primary-100 border border-primary-300 rounded"></div>
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-secondary-100 border border-secondary-300 rounded"></div>
                  <span className="text-gray-600">Booked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Upcoming Bookings</h3>
              <div className="space-y-4">
                {[
                  { pet: 'Max (Dog)', date: 'Jan 15', owner: 'Sarah W.' },
                  { pet: 'Luna (Cat)', date: 'Jan 16-17', owner: 'Mike J.' },
                ].map((booking, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900 mb-1">{booking.pet}</div>
                    <div className="text-sm text-gray-600">{booking.date}</div>
                    <div className="text-sm text-gray-600">{booking.owner}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn btn-primary w-full">Set Availability</button>
                <button className="btn btn-outline w-full">View All Bookings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
