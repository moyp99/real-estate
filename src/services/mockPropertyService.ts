import { Property } from '../types/Property'
import { mockProperties } from '../data/mockProperties'

let mockAgentProperties: Property[] = []

export const mockPropertyService = {
  async getAgentProperties(agentId: string): Promise<Property[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Return mock properties for the agent
    if (mockAgentProperties.length === 0) {
      // Initialize with some mock properties
      mockAgentProperties = mockProperties.slice(0, 3).map((p, index) => ({
        ...p,
        id: index + 1000,
        agent: {
          ...p.agent,
          email: 'agent@realestate.com'
        }
      }))
    }
    
    return mockAgentProperties
  },

  async createAgentProperty(
    agentId: string,
    property: any,
    images: string[]
  ): Promise<Property> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newProperty: Property = {
      id: Date.now(),
      title: property.title,
      price: property.price,
      priceFormatted: `$${property.price.toLocaleString()}`,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      lotSize: 0.25,
      yearBuilt: property.yearBuilt,
      propertyType: property.propertyType,
      status: property.status,
      description: property.description,
      features: property.features,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&h=600'],
      agent: {
        name: 'Agent Name',
        phone: '(555) 123-4567',
        email: 'agent@realestate.com',
        photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150',
        company: 'Premier Real Estate'
      },
      coordinates: { lat: 40.7128, lng: -74.0060 },
      mapPosition: { x: '50%', y: '50%' },
      daysOnMarket: 0,
      mlsNumber: `MLS${Date.now()}`,
      virtualTour: undefined,
      schools: {
        elementary: 'Lincoln Elementary',
        middle: 'Washington Middle School',
        high: 'Roosevelt High School'
      }
    }
    
    mockAgentProperties.unshift(newProperty)
    return newProperty
  },

  async updateAgentProperty(
    propertyId: number,
    agentId: string,
    updates: any
  ): Promise<Property> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockAgentProperties.findIndex(p => p.id === propertyId)
    if (index === -1) {
      throw new Error('Property not found')
    }
    
    const updatedProperty = {
      ...mockAgentProperties[index],
      ...updates,
      priceFormatted: updates.price ? `$${updates.price.toLocaleString()}` : mockAgentProperties[index].priceFormatted
    }
    
    mockAgentProperties[index] = updatedProperty
    return updatedProperty
  },

  async deleteAgentProperty(propertyId: number, agentId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockAgentProperties.findIndex(p => p.id === propertyId)
    if (index === -1) {
      throw new Error('Property not found')
    }
    
    mockAgentProperties.splice(index, 1)
    return true
  }
}