export const getSemesterName = (semesterNumber: number): string => {
  switch (semesterNumber) {
    case 1:
      return 'Autumn'
    case 2:
      return 'Spring'
    case 3:
      return 'Summer'
    default:
      return `Semester ${semesterNumber}`
  }
}

export const formatRegistrationPeriod = (regYear: number, regSem: number): string => {
  return `${getSemesterName(regSem)} ${regYear}`
}