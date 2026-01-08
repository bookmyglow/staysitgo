import { useState } from 'react';
import { Search, MapPin, Star, Heart, Filter, Shield, CheckCircle } from 'lucide-react';

export default function FindSitters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const mockSitters = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Brooklyn, NY',
      distance: '2.3 miles',
      rating: 4.9,
      reviews: 47,
      price: 35,
      verified: true,
      premium: true,
      petTypes: ['Dogs', 'Cats'],
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Manhattan, NY',
      distance: '4.1 miles',
      rating: 4.8,
      reviews: 32,
      price: 30,
      verified: true,
      premium: false,
      petTypes: ['Dogs'],
      avatar: 'MC',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      location: 'Queens, NY',
      distance: '5.7 miles',
      rating: 5.0,
      reviews: 18,
      price: 40,
      verified: true,
      premium: true,
      petTypes: ['Dogs', 'Cats', 'Birds'],
      avatar: 'ER',
    },
    {
      id: 4,
      name: 'David Thompson',
      location: 'Bronx, NY',
      distance: '7.2 miles',
      rating: 4.7,
      reviews: 25,
      price: 28,
      verified: false,
      premium: false,
      petTypes: ['Cats', 'Small Pets'],
      avatar: 'DT',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Pet Sitters</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location (city, zip code, or address)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <button className="btn btn-primary flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center justify-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Type
                  </label>
                  <select className="input">
                    <option>All Types</option>
                    <option>Dogs</option>
                    <option>Cats</option>
                    <option>Birds</option>
                    <option>Small Pets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select className="input">
                    <option>Any Price</option>
                    <option>$0 - $25</option>
                    <option>$25 - $50</option>
                    <option>$50+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance
                  </label>
                  <select className="input">
                    <option>Any Distance</option>
                    <option>Under 5 miles</option>
                    <option>Under 10 miles</option>
                    <option>Under 25 miles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select className="input">
                    <option>Any Rating</option>
                    <option>4.5+ Stars</option>
                    <option>4.0+ Stars</option>
                    <option>3.5+ Stars</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Verified Only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Premium Members</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{mockSitters.length}</span> pet sitters near you
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option>Best Match</option>
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Closest Distance</option>
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockSitters.map((sitter) => (
            <div key={sitter.id} className="card p-6 hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-gray-700">{sitter.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-gray-900">{sitter.name}</h3>
                        {sitter.verified && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {sitter.premium && (
                          <Shield className="h-5 w-5 text-primary-600" />
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{sitter.location}</span>
                        <span className="mx-2">•</span>
                        <span>{sitter.distance}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-primary-600 transition-colors">
                      <Heart className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-semibold text-gray-900">{sitter.rating}</span>
                    <span className="ml-1 text-sm text-gray-600">({sitter.reviews} reviews)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {sitter.petTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">${sitter.price}</span>
                      <span className="text-gray-600 text-sm">/day</span>
                    </div>
                    <button className="btn btn-primary text-sm">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mockSitters.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No sitters found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or location
            </p>
            <button className="btn btn-primary">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
