import { Search, MessageSquare, Heart, Shield, Star, CheckCircle, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How StaySitGo Works
          </h1>
          <p className="text-xl text-gray-600">
            Connecting pet parents and sitters is simple, safe, and built on trust
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Pet Parents</h2>
            <p className="text-lg text-gray-600">Find trusted care for your furry friend in three easy steps</p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="bg-primary-600 text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  Step 1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Search for Sitters</h3>
                <p className="text-gray-700 leading-relaxed">
                  Enter your location and browse through verified pet sitters in your area. 
                  Filter by pet type, availability, price range, and distance. View detailed 
                  profiles including photos, reviews, and service descriptions.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-secondary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-12 w-12 text-secondary-600" />
                </div>
              </div>
              <div className="md:w-2/3 md:text-right">
                <div className="bg-secondary-600 text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  Step 2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect & Chat</h3>
                <p className="text-gray-700 leading-relaxed">
                  Message sitters directly to discuss your pet's needs, schedule, and any special 
                  requirements. Read reviews from other pet parents and check the sitter's 
                  verification status. Ask questions and get to know them before booking.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="bg-primary-600 text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  Step 3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Book & Relax</h3>
                <p className="text-gray-700 leading-relaxed">
                  Schedule your booking with confidence. Receive updates and photos while you're away. 
                  Our secure platform ensures safe payments and communication. After the service, 
                  leave a review to help other pet parents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Pet Sitters</h2>
            <p className="text-lg text-gray-600">Turn your love for pets into an opportunity</p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-secondary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-12 w-12 text-secondary-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="bg-secondary-600 text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  Step 1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
                <p className="text-gray-700 leading-relaxed">
                  Sign up and build your sitter profile. Add photos, describe your experience, 
                  list the types of pets you care for, and set your rates. Complete verification 
                  to build trust with pet parents.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="md:w-2/3 md:text-right">
                <div className="bg-primary-600 text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  Step 2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Discovered</h3>
                <p className="text-gray-700 leading-relaxed">
                  Pet parents in your area will find your profile when they search. Respond to 
                  messages quickly to increase bookings. Set your availability and let parents 
                  know when you're free to care for their pets.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3">
                <div className="bg-secondary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-12 w-12 text-secondary-600" />
                </div>
              </div>
              <div className="md:w-2/3">
                <div className="bg-secondary-600 text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-3">
                  Step 3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Reputation</h3>
                <p className="text-gray-700 leading-relaxed">
                  Provide excellent care and earn positive reviews. The more great reviews you get, 
                  the more bookings you'll receive. Build a trusted reputation and grow your pet 
                  sitting business on your own terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trust & Safety</h2>
            <p className="text-lg text-gray-600">Your peace of mind is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Profiles</h3>
              <p className="text-gray-600">
                All sitters go through verification including email, phone, and optional ID 
                verification for added security.
              </p>
            </div>

            <div className="card p-6 text-center">
              <Star className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Review System</h3>
              <p className="text-gray-600">
                Read honest reviews from other pet parents. Our transparent rating system helps 
                you make informed decisions.
              </p>
            </div>

            <div className="card p-6 text-center">
              <Globe className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our support team is always available to help with any questions or concerns during 
                your booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Join our global community of pet lovers today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg">
              Sign Up Free
            </Link>
            <Link to="/" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
