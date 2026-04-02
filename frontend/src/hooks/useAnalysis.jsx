import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('')
  const [improved, setImproved] = useState(null)

  const reset = () => {
    setResumeText('')
    setFileName('')
    setJobRole('')
    setJobDesc('')
    setResults(null)
    setImproved(null)
    setLoading(false)
    setLoadingStep('')
  }

  return (
    <AnalysisContext.Provider value={{
      resumeText, setResumeText,
      fileName, setFileName,
      jobRole, setJobRole,
      jobDesc, setJobDesc,
      results, setResults,
      loading, setLoading,
      loadingStep, setLoadingStep,
      improved, setImproved,
      reset
    }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  return useContext(AnalysisContext)
}