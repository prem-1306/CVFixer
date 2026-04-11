import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CheckerPage from './pages/CheckerPage'
import ResultsPage from './pages/ResultsPage'
import BlogPage from './pages/BlogPage'
import { AnalysisProvider } from './hooks/useAnalysis'

export default function App() {
  return (
    <AnalysisProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/check" element={<CheckerPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AnalysisProvider>
  )
}