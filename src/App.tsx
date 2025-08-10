import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import MainView from './components/MainView'
import PropertyDetails from './components/PropertyDetails'
import FavoritesPage from './components/FavoritesPage'
import MessagesPage from './components/MessagesPage'
import AgentDashboard from './components/AgentDashboard'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { useProperty } from './hooks/useProperties'
import LoadingSpinner from './components/LoadingSpinner'

const PropertyDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const propertyId = parseInt(id || '1')
  const { property, isLoading, error } = useProperty(propertyId)
  
  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  
  if (error || !property) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Property not found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }
  
  return <PropertyDetails property={property} />
}

function App() {
  const basename = import.meta.env.MODE === 'production' ? '/real-estate' : '/'
  
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router basename={basename}>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/agent-signup" element={<SignupPage isAgentSignup={true} />} />
              <Route path="/main" element={<MainView />} />
              <Route path="/property/:id" element={<PropertyDetailsWrapper />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App