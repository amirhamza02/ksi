import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { Clock, Users, Calendar, CheckCircle, Star } from 'lucide-react'

const CoursePage: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const navigate = useNavigate()

  const courses = [
    {
      id: 'beginner-1',
      title: 'Korean Language Beginner Level 1',
      level: 'Beginner',
      duration: '3 months',
      schedule: 'Mon, Wed, Fri - 6:00 PM to 8:00 PM',
      students: 25,
      fee: 15000,
      description: 'Learn basic Korean alphabet (Hangul), basic greetings, and simple conversations. Perfect for absolute beginners.',
      features: [
        'Hangul reading and writing',
        'Basic vocabulary (500+ words)',
        'Simple sentence structures',
        'Cultural introduction',
        'Interactive speaking practice'
      ],
      instructor: 'Ms. Park Ji-hye',
      rating: 4.8
    },
    {
      id: 'beginner-2',
      title: 'Korean Language Beginner Level 2',
      level: 'Beginner',
      duration: '3 months',
      schedule: 'Tue, Thu, Sat - 6:00 PM to 8:00 PM',
      students: 20,
      fee: 16000,
      description: 'Build upon Level 1 knowledge with more complex grammar patterns and expanded vocabulary.',
      features: [
        'Advanced grammar patterns',
        'Extended vocabulary (1000+ words)',
        'Past and future tenses',
        'Daily conversation practice',
        'Korean culture deep dive'
      ],
      instructor: 'Mr. Kim Min-jun',
      rating: 4.9
    },
    {
      id: 'intermediate-1',
      title: 'Korean Language Intermediate Level 1',
      level: 'Intermediate',
      duration: '4 months',
      schedule: 'Mon, Wed, Fri - 7:00 PM to 9:00 PM',
      students: 18,
      fee: 20000,
      description: 'Develop intermediate speaking and listening skills with focus on practical communication.',
      features: [
        'Complex sentence structures',
        'Business Korean basics',
        'Media comprehension',
        'Presentation skills',
        'TOPIK Level 3-4 preparation'
      ],
      instructor: 'Ms. Lee So-young',
      rating: 4.7
    },
    {
      id: 'advanced-1',
      title: 'Korean Language Advanced Level 1',
      level: 'Advanced',
      duration: '4 months',
      schedule: 'Tue, Thu, Sat - 7:00 PM to 9:00 PM',
      students: 15,
      fee: 25000,
      description: 'Master advanced Korean with focus on academic and professional communication.',
      features: [
        'Academic Korean writing',
        'Professional communication',
        'Literature analysis',
        'Advanced grammar mastery',
        'TOPIK Level 5-6 preparation'
      ],
      instructor: 'Dr. Choi Hyun-woo',
      rating: 4.9
    }
  ]

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
    localStorage.setItem('selected_course', courseId)
  }

  const handleProceedToPayment = () => {
    if (selectedCourse) {
      navigate('/payment')
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Available Courses</h1>
          <p className="text-gray-600 mt-2">
            Choose the Korean language course that best fits your current level and schedule.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-white rounded-lg card-shadow p-6 cursor-pointer transition-all duration-200 ${
                selectedCourse === course.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleCourseSelect(course.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{course.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                </div>
                
                {selectedCourse === course.id && (
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 ml-4" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">{course.schedule}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Instructor:</span> {course.instructor}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Course Features:</h4>
                <ul className="space-y-1">
                  {course.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <span className="text-2xl font-bold text-gray-900">৳{course.fee.toLocaleString()}</span>
                  <span className="text-gray-600 ml-1">BDT</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCourseSelect(course.id)
                  }}
                  className={`btn-sm font-medium transition-colors ${
                    selectedCourse === course.id
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {selectedCourse === course.id ? 'Selected' : 'Select Course'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedCourse && (
          <div className="mt-8 bg-white rounded-lg card-shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Course Selected</h3>
                <p className="text-gray-600">
                  {courses.find(c => c.id === selectedCourse)?.title}
                </p>
              </div>
              <button
                onClick={handleProceedToPayment}
                className="btn-primary"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursePage