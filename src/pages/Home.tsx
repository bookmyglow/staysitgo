import { Link } from 'react-router-dom';
import { Search, Shield, Globe, DollarSign, Clock, Heart, CheckCircle, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Trusted Pet Care,{' '}
              <span className="text-primary-600">Anywhere</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with loving pet sitters and caring pet parents worldwide. 
              Safe, simple, and built on trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/find-sitters" className="btn btn-primary text-lg">
                Find a Pet Sitter
              </Link>
              <Link to="/find-pet-parents" className="btn btn-secondary text-lg">
                Become a Sitter
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600">10k+</div>
              <div className="text-gray-600 mt-2">Pet Sitters</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">50k+</div>
              <div className="text-gray-600 mt-2">Happy Pets</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">120+</div>
              <div className="text-gray-600 mt-2">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600">4.9★</div>
              <div className="text-gray-600 mt-2">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How StaySitGo Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to find perfect pet care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Search</h3>
              <p className="text-gray-600">
                Browse verified pet sitters in your area or worldwide. 
                Filter by location, availability, and pet type.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Connect</h3>
              <p className="text-gray-600">
                Message sitters directly, view their profiles, and read reviews 
                from other pet parents.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Book</h3>
              <p className="text-gray-600">
                Schedule pet care with confidence. Track bookings and stay 
                connected throughout the service.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                For Pet Parents
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Travel with peace of mind knowing your furry family member is in 
                caring hands. Find trusted sitters who love pets as much as you do.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Verified and reviewed sitters</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Direct messaging and booking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Real-time updates and photos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Secure payment system</span>
                </li>
              </ul>
              <Link to="/find-sitters" className="btn btn-primary mt-8 inline-block">
                Find a Sitter
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary-200 to-secondary-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <Heart className="h-24 w-24 mx-auto mb-4 text-primary-600" />
                <p className="text-lg font-medium">Happy Pet Parent with Dog</p>
                <p className="text-sm">[Placeholder for image]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-gradient-to-br from-secondary-200 to-primary-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <Star className="h-24 w-24 mx-auto mb-4 text-secondary-600" />
                <p className="text-lg font-medium">Pet Sitter with Cat</p>
                <p className="text-sm">[Placeholder for image]</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                For Pet Sitters
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Turn your love for animals into an opportunity. Connect with pet 
                parents who need your care and build a trusted reputation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Set your own schedule and rates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Build your profile and get reviews</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Connect with loving pet parents</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Safe and secure platform</span>
                </li>
              </ul>
              <Link to="/find-pet-parents" className="btn btn-secondary mt-8 inline-block">
                Become a Sitter
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose StaySitGo?
            </h2>
            <p className="text-xl text-gray-600">
              Built with trust, safety, and love for pets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8">
              <Shield className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified & Safe</h3>
              <p className="text-gray-600">
                All sitters are verified with background checks and reviews from 
                the community. Your pet's safety is our priority.
              </p>
            </div>

            <div className="card p-8">
              <Globe className="h-12 w-12 text-secondary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600">
                Find pet care wherever you are in the world. Our community spans 
                120+ countries and growing.
              </p>
            </div>

            <div className="card p-8">
              <DollarSign className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fair Pricing</h3>
              <p className="text-gray-600">
                Transparent pricing with no hidden fees. Sitters set their own 
                rates, and you choose what works for you.
              </p>
            </div>

            <div className="card p-8">
              <Clock className="h-12 w-12 text-secondary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our support team is always here to help. Get assistance anytime 
                you need it.
              </p>
            </div>

            <div className="card p-8">
              <Heart className="h-12 w-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Love</h3>
              <p className="text-gray-600">
                Join a community of pet lovers who genuinely care. Build lasting 
                relationships with trust.
              </p>
            </div>

            <div className="card p-8">
              <Star className="h-12 w-12 text-secondary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Top Quality</h3>
              <p className="text-gray-600">
                Highly rated sitters with proven track records. Read reviews and 
                make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                Free
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Create profile and listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Message other users</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic search filters</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>
              <Link to="/signup" className="btn btn-outline w-full">
                Get Started
              </Link>
            </div>

            <div className="card p-8 border-2 border-primary-600 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="text-4xl font-bold text-primary-600 mb-6">
                $9.99<span className="text-lg text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Everything in Basic</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority in search results</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced filters</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Verified badge</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">24/7 priority support</span>
                </li>
              </ul>
              <Link to="/signup" className="btn btn-primary w-full">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Join thousands of pet parents and sitters in our global community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg">
              Sign Up Free
            </Link>
            <Link to="/how-it-works" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 text-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
