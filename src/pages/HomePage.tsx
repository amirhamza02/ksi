import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, Globe, Clock, Calendar, Star } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import { fetchExecutivePrograms } from '../store/slices/executiveProgramSlice'
import Header from '../components/Header'

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch()
  
  const { 
    programs, 
    loading: programLoading, 
    error: programError 
  } = useAppSelector((state) => state.executiveProgram)

  useEffect(() => {
    dispatch(fetchExecutivePrograms())
  }, [dispatch])

  const getLevelColor = (programName: string) => {
    if (programName.includes('Level 1')) {
      return 'bg-green-100 text-green-800'
    } else if (programName.includes('Level 2')) {
      return 'bg-yellow-100 text-yellow-800'
    } else if (programName.includes('Level 3')) {
      return 'bg-red-100 text-red-800'
    }
    return 'bg-gray-100 text-gray-800'
  }

  const getLevel = (programName: string) => {
    if (programName.includes('Level 1')) return 'Beginner'
    if (programName.includes('Level 2')) return 'Intermediate'
    if (programName.includes('Level 3')) return 'Advanced'
    return 'Unknown'
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="gradient-bg text-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <img 
                src="./king-sejong.jpg" 
                alt="King Sejong Institute Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
              <img 
                 src="./iub-logo.png" 
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

      {/* Available Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-primary mb-4">Available Korean Language Courses</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive Korean language programs designed for all skill levels. 
              Join thousands of students who have successfully learned Korean through our expert-led courses.
            </p>
          </div>

          {programLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Loading courses...</span>
            </div>
          )}

          {programError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
              {programError}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs && programs?.length > 0 ? (
              programs.filter(program => program.isRunning).map((program) => (
                <div key={program.id} className="bg-white border border-gray-100 rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all duration-200 card-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(program.programsName)}`}>
                      {getLevel(program.programsName)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{program.programsName}</h4>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{program.totalHours} hours total</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{program.classCount} classes</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Starts: {program.startDateDescription}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">৳{program.regCost.toLocaleString()}</span>
                      <span className="text-gray-600 text-sm ml-1">BDT</span>
                      {program.discoutPC > 0 && (
                        <div className="text-sm text-green-600 font-medium">
                          {program.discoutPC}% discount available
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              !programLoading && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Available</h3>
                  <p className="text-gray-500">Please check back later for new course offerings.</p>
                </div>
              )
            )}
          </div>

          {programs?.length > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-gray-50 rounded-lg p-8">
                <h4 className="text-xl font-bold text-primary mb-3">Ready to Start Learning Korean?</h4>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join our comprehensive Korean language programs and embark on an exciting journey to master one of the world's most fascinating languages.
                </p>
                <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                  <Link to="/register" className="inline-block btn-primary btn-lg">
                    Apply Now
                  </Link>
                  <Link to="/courses" className="inline-block btn-outline btn-lg">
                    View All Courses
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-white">
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