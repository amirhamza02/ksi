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

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs && programs?.length > 0 ? (
              programs.filter(program => program.isRunning).map((program) => (
                <div key={program.id} className="border border-gray-100 rounded-lg p-4 hover:border-[#00c0ef] hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(program.programsName)}`}>
                      {getLevel(program.programsName)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{program.programsName}</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>{program.totalHours} hours total</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{program.classCount} classes</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>Starts: {program.startDateDescription}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">৳{program.regCost.toLocaleString()}</span>
                      <span className="text-gray-600 text-sm ml-1">BDT</span>
                      {program.discoutPC > 0 && (
                        <div className="text-xs text-green-600">
                          {program.discoutPC}% discount available
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {program.isSuccessfullyEPRegistration ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Registered
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <h3 className="text-xl font-bold text-primary mb-3">Ready to Start Learning Korean?</h3>
              <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
                Join our comprehensive Korean language programs and embark on an exciting journey to master one of the world's most fascinating languages.
              </p>
              <p className="text-sm text-gray-500">
                For registration and payment, please visit your dashboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursePage