export interface Property {
    id: number
    title: string
    price: number
    priceFormatted: string
    address: string
    city: string
    state: string
    zipCode: string
    bedrooms: number
    bathrooms: number
    sqft: number
    lotSize?: string
    yearBuilt: number
    propertyType: 'Single Family' | 'Condo' | 'Townhouse' | 'Multi-Family'
    status: 'For Sale' | 'Pending' | 'Sold' | 'Off Market'
    description: string
    features: string[]
    images: string[]
    agent: {
      name: string
      phone: string
      email: string
      photo: string
      company: string
    }
    coordinates: {
      lat: number
      lng: number
    }
    mapPosition: {
      x: string
      y: string
    }
    daysOnMarket: number
    mlsNumber: string
    virtualTour?: string
    schools?: {
      elementary?: string
      middle?: string
      high?: string
    }
  }