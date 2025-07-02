import React from 'react'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import { fetchExecutivePrograms } from '../../store/slices/executiveProgramSlice'
import Header from '../../components/Header'
import { Clock, Users, Calendar, Star, BookOpen } from 'lucide-react'
import { useEffect } from 'react'

const CoursePage: React.FC = () => {
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

  const getDescription = (programName: string) => {
    if (programName.includes('Level 1A')) {
      return 'Learn basic Korean alphabet (Hangul), basic greetings, and simple conversations. Perfect for absolute beginners.'
    } else if (programName.includes('Level 1B')) {
      return 'Build upon Level 1A knowledge with more vocabulary and basic grammar patterns.'
    } else if (programName.includes('Level 2A')) {
      return 'Develop intermediate speaking and listening skills with focus on practical communication.'
    } else if (programName.includes('Level 2B')) {
      return 'Advanced intermediate level with complex grammar and extended vocabulary.'
    } else if (programName.includes('Level 3A')) {
      return 'Master advanced Korean with focus on academic and professional communication.'
    } else if (programName.includes('Level 3B')) {
      return 'Highest level with advanced literature analysis and professional Korean.'
    }
    return 'Comprehensive Korean language course designed to enhance your language skills.'
  }

  const getFeatures = (programName: string) => {
    if (programName.includes('Level 1')) {
      return [
        'Hangul reading and writing',
        'Basic vocabulary (500+ words)',
        'Simple sentence structures',
        'Cultural introduction',
        'Interactive speaking practice'
      ]
    } else if (programName.includes('Level 2')) {
      return [
        'Advanced grammar patterns',
        'Extended vocabulary (1000+ words)',
        'Past and future tenses',
        'Daily conversation practice',
        'Korean culture deep dive'
      ]
    } else if (programName.includes('Level 3')) {
      return [
        'Academic Korean writing',
        'Professional communication',
        'Literature analysis',
        'Advanced grammar mastery',
        'TOPIK Level 5-6 preparation'
      ]
    }
    return [
      'Comprehensive curriculum',
      'Expert instruction',
      'Interactive learning',
      'Cultural immersion',
      'Progress tracking'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Available Korean Language Courses</h1>
          <p className="text-gray-600 mt-2">
            Explore our comprehensive Korean language programs designed for all skill levels.
          </p>
        </div>

        {programLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading courses...</span>
          </div>
        )}

        {programError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {programError}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {programs && programs?.length > 0 ? (
            programs.filter(program => program.isRunning).map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg card-shadow p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(program.programsName)}`}>
                        {getLevel(program.programsName)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{program.programsName}</h3>
                    <p className="text-gray-600 mb-4">{getDescription(program.programsName)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{program.totalHours} hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{program.classCount} classes</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Starts: {program.startDateDescription}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Schedule:</span> {program.classSchedule || 'TBA'}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Course Features:</h4>
                  <ul className="space-y-1">
                    {getFeatures(program.programsName).map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">৳{program.regCost.toLocaleString()}</span>
                    <span className="text-gray-600 ml-1">BDT</span>
                    {program.discoutPC > 0 && (
                      <div className="text-sm text-green-600">
                        {program.discoutPC}% discount available
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {program.isSuccessfullyEPRegistration ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Available
                      </span>
                    )}
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
          <div className="mt-12 bg-white rounded-lg card-shadow p-8 text-center">
            <h3 className="text-2xl font-bold text-primary mb-4">Ready to Start Learning Korean?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our comprehensive Korean language programs and embark on an exciting journey to master one of the world's most fascinating languages.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                For registration and payment, please visit your dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursePage