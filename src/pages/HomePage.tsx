import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, Globe } from 'lucide-react'
import Header from '../components/Header'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <img 
                src="/iphone_3x_retina_ksj.jpg" 
                alt="King Sejong Institute Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <img 
                src="/iub-logo_2024_color-c303e48f-7406-4c63-8e53-51fb791b2167.png" 
                alt="Independent University Bangladesh Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            King Sejong Institute (KSI)
          </h1>
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-secondary">
            Independent University, Bangladesh (IUB)
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-600">
            Greetings and welcome to the admission portal of King Sejong Institute, IUB! 
            To initiate the admission process, kindly create an account first. Then, you can 
            log in using your Login ID (email) and password to access the admission portal.
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
            <Link to="/register" className="inline-block btn-primary btn-lg font-semibold shadow-md">
              Apply Now
            </Link>
            <Link to="/login" className="inline-block btn-outline btn-lg font-semibold">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-16 text-primary">Admission Process</h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">1. Create Account</h4>
              <p className="text-gray-600">Register with your personal information to get started</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">2. Complete Profile</h4>
              <p className="text-gray-600">Fill out your personal and academic information</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">3. Select Course</h4>
              <p className="text-gray-600">Choose from our available Korean language courses</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-gray-800">4. Pay & Confirm</h4>
              <p className="text-gray-600">Pay the course fee and receive confirmation via email</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-6 text-primary">Ready to Start Your Korean Language Journey?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who have successfully learned Korean through our comprehensive programs.
          </p>
          <Link to="/register" className="btn-primary btn-lg">
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage