import { Star, MapPin, Shield, CheckCircle, Calendar, Heart, MessageSquare, Mail, Phone } from 'lucide-react';

export default function Profile() {
  const isOwnProfile = true;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-gray-700">JS</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">John Smith</h1>
                <p className="text-gray-600 mb-3">Pet Parent & Sitter</p>
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-semibold text-gray-900">4.8</span>
                  <span className="ml-1 text-sm text-gray-600">(24 reviews)</span>
                </div>
                <div className="flex items-center justify-center text-gray-600 mb-6">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Brooklyn, New York</span>
                </div>

                {isOwnProfile ? (
                  <button className="btn btn-outline w-full">Edit Profile</button>
                ) : (
                  <div className="space-y-2">
                    <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Send Message</span>
                    </button>
                    <button className="btn btn-outline w-full">Book Now</button>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Trust & Verification</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Email Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Phone Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Premium Member</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">ID Verified</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">john.smith@email.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-semibold text-gray-900">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-semibold text-gray-900">~2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-semibold text-gray-900">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed Jobs</span>
                  <span className="text-sm font-semibold text-gray-900">42</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Hi there! I'm John, a lifelong pet lover with over 5 years of experience caring for dogs and cats of all sizes and breeds. 
                I understand that pets are family, and I treat every furry friend with the same love and attention I give my own pets.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                I offer flexible pet sitting services including daily walks, overnight stays, and drop-in visits. 
                Whether you're going on vacation or just need help during the day, I'm here to provide reliable and loving care for your pets.
              </p>
              <p className="text-gray-700 leading-relaxed">
                I have experience with senior pets, puppies, and pets with special needs. I'm comfortable administering medications 
                and following specific care routines. Your pet's safety, happiness, and well-being are my top priorities.
              </p>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Pet Care Experience</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pet Types I Care For</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Dogs', 'Cats', 'Birds', 'Small Pets'].map((type) => (
                      <span key={type} className="px-4 py-2 bg-primary-50 text-primary-700 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Dog Walking', 'Pet Sitting', 'House Sitting', 'Drop-in Visits', 'Overnight Care'].map((service) => (
                      <span key={service} className="px-4 py-2 bg-secondary-50 text-secondary-700 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Active Listings</h2>
                {isOwnProfile && (
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Manage
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: 'Experienced Dog Walker Available',
                    description: 'Daily walks, flexible schedule, 5+ years experience',
                    price: 35,
                  },
                  {
                    title: 'Weekend Pet Sitting Services',
                    description: 'Full weekend care including walks, feeding, and playtime',
                    price: 80,
                  },
                ].map((listing, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
                        <div className="text-lg font-bold text-primary-600">
                          ${listing.price}<span className="text-sm text-gray-600 font-normal">/day</span>
                        </div>
                      </div>
                      <Heart className="h-6 w-6 text-gray-400 hover:text-primary-600 cursor-pointer flex-shrink-0 ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability Calendar</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Calendar view coming soon</p>
                <p className="text-sm text-gray-500">Check availability and book directly</p>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews (24)</h2>
              <div className="space-y-6">
                {[
                  {
                    name: 'Sarah Williams',
                    rating: 5,
                    date: 'December 2023',
                    comment: 'John was absolutely wonderful with our dog Max! He sent updates and photos every day, and Max came home happy and well-cared for. Highly recommend!',
                  },
                  {
                    name: 'Michael Brown',
                    rating: 5,
                    date: 'November 2023',
                    comment: 'Very professional and caring. Our cat Luna is usually shy with strangers, but John was patient and gentle. We will definitely book again!',
                  },
                  {
                    name: 'Emily Davis',
                    rating: 4,
                    date: 'October 2023',
                    comment: 'Great experience overall. John was punctual and followed all our instructions perfectly. Would recommend to other pet parents.',
                  },
                ].map((review, i) => (
                  <div key={i} className="pb-6 border-b border-gray-200 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{review.name}</div>
                          <div className="text-sm text-gray-600">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
              <button className="btn btn-outline w-full mt-6">
                View All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
