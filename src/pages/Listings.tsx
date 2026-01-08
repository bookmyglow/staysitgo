import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Listings() {
  const listings = [
    {
      id: 1,
      title: 'Experienced Dog Walker Available',
      type: 'Offering',
      status: 'Active',
      price: 35,
      views: 127,
    },
    {
      id: 2,
      title: 'Looking for Cat Sitter in Brooklyn',
      type: 'Seeking',
      status: 'Active',
      price: 30,
      views: 89,
    },
    {
      id: 3,
      title: 'Weekend Pet Care Services',
      type: 'Offering',
      status: 'Active',
      price: 80,
      views: 203,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">Manage your pet care listings</p>
          </div>
          <button className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Create Listing</span>
          </button>
        </div>

        <div className="grid gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{listing.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.type === 'Offering' 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'bg-secondary-100 text-secondary-700'
                    }`}>
                      {listing.type}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {listing.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>Price: <span className="font-semibold text-gray-900">${listing.price}/day</span></span>
                    <span>Views: <span className="font-semibold text-gray-900">{listing.views}</span></span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Listings Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first listing to start connecting with pet parents or sitters
            </p>
            <button className="btn btn-primary">
              Create Your First Listing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
