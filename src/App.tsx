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
import { mockProperties } from './data/mockProperties'

const PropertyDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const propertyId = parseInt(id || '1')
  const property = mockProperties.find(p => p.id === propertyId) || mockProperties[0]
  
  console.log('🏠 PropertyDetailsWrapper - URL ID:', id)
  console.log('🏠 PropertyDetailsWrapper - Parsed ID:', propertyId)
  console.log('🏠 PropertyDetailsWrapper - Found property:', property.title)
  
  return <PropertyDetails property={property} />
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
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