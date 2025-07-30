import { Property } from '../types/Property'

export const mockProperties: Property[] = [
  {
    id: 1,
    title: "Stunning Ocean View Home in La Jolla",
    price: 875000,
    priceFormatted: "$875K",
    address: "7842 Eads Avenue",
    city: "La Jolla",
    state: "CA",
    zipCode: "92037",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1850,
    lotSize: "0.25 acres",
    yearBuilt: 2018,
    propertyType: "Single Family",
    status: "For Sale",
    description: "Beautiful modern home with breathtaking ocean views. This stunning property features an open floor plan, gourmet kitchen with quartz countertops, and a master suite with panoramic views. Located in the prestigious La Jolla area, just minutes from the beach.",
    features: [
      "Ocean Views",
      "Modern Kitchen",
      "Hardwood Floors",
      "Two-Car Garage",
      "Private Patio",
      "Walk to Beach",
      "Updated Bathrooms",
      "Central AC"
    ],
    images: [
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    agent: {
      name: "Sarah Martinez",
      phone: "(619) 555-0123",
      email: "agent@realestate.com",
      photo: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Pacific Coast Realty"
    },
    coordinates: { lat: 32.8328, lng: -117.2713 },
    mapPosition: { x: "25%", y: "15%" },
    daysOnMarket: 12,
    mlsNumber: "SD1234567",
    virtualTour: "https://example.com/virtual-tour",
    schools: {
      elementary: "La Jolla Elementary",
      middle: "Muirlands Middle School",
      high: "La Jolla High School"
    }
  },
  {
    id: 2,
    title: "Modern Downtown Condo with City Views",
    price: 650000,
    priceFormatted: "$650K",
    address: "1240 India Street #502",
    city: "San Diego",
    state: "CA",
    zipCode: "92101",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    yearBuilt: 2020,
    propertyType: "Condo",
    status: "For Sale",
    description: "Luxury high-rise condo in the heart of downtown San Diego. Features floor-to-ceiling windows, premium finishes, and stunning city views. Building amenities include rooftop pool, fitness center, and concierge service.",
    features: [
      "City Views",
      "High-Rise Living",
      "Rooftop Pool",
      "Fitness Center",
      "Concierge",
      "In-Unit Laundry",
      "Stainless Appliances",
      "Balcony"
    ],
    images: [
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    agent: {
      name: "Michael Chen",
      phone: "(619) 555-0456",
      email: "john.agent@estate.com",
      photo: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Urban Realty Group"
    },
    coordinates: { lat: 32.7157, lng: -117.1611 },
    mapPosition: { x: "65%", y: "20%" },
    daysOnMarket: 8,
    mlsNumber: "SD2345678"
  },
  {
    id: 3,
    title: "Charming Craftsman in North Park",
    price: 720000,
    priceFormatted: "$720K",
    address: "3456 30th Street",
    city: "San Diego",
    state: "CA",
    zipCode: "92104",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1650,
    lotSize: "0.15 acres",
    yearBuilt: 1925,
    propertyType: "Single Family",
    status: "For Sale",
    description: "Beautifully restored Craftsman home in trendy North Park. Original hardwood floors, built-in cabinetry, and period details throughout. Updated kitchen and bathrooms while maintaining historic charm.",
    features: [
      "Historic Charm",
      "Hardwood Floors",
      "Built-in Cabinetry",
      "Updated Kitchen",
      "Front Porch",
      "Mature Trees",
      "Walk to Restaurants",
      "Original Details"
    ],
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    agent: {
      name: "Jennifer Lopez",
      phone: "(619) 555-0789",
      email: "jennifer.lopez@heritagehomes.com",
      photo: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Heritage Homes Realty"
    },
    coordinates: { lat: 32.7441, lng: -117.1294 },
    mapPosition: { x: "45%", y: "35%" },
    daysOnMarket: 25,
    mlsNumber: "SD3456789"
  },
  {
    id: 4,
    title: "Family Home in Scripps Ranch",
    price: 425000,
    priceFormatted: "$425K",
    address: "10234 Scripps Lake Drive",
    city: "San Diego",
    state: "CA",
    zipCode: "92131",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    lotSize: "0.3 acres",
    yearBuilt: 1995,
    propertyType: "Single Family",
    status: "For Sale",
    description: "Spacious family home in desirable Scripps Ranch community. Features include vaulted ceilings, fireplace, and large backyard perfect for entertaining. Excellent schools and family-friendly neighborhood.",
    features: [
      "Vaulted Ceilings",
      "Fireplace",
      "Large Backyard",
      "Two-Car Garage",
      "Family Room",
      "Excellent Schools",
      "Quiet Street",
      "Storage Space"
    ],
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    agent: {
      name: "David Wilson",
      phone: "(858) 555-0321",
      email: "david.wilson@familyhomes.com",
      photo: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Family Homes Realty"
    },
    coordinates: { lat: 32.9089, lng: -117.1311 },
    mapPosition: { x: "20%", y: "65%" },
    daysOnMarket: 18,
    mlsNumber: "SD4567890",
    schools: {
      elementary: "Scripps Elementary",
      middle: "Marshall Middle School",
      high: "Scripps Ranch High School"
    }
  },
  {
    id: 5,
    title: "Beachside Townhouse in Mission Beach",
    price: 590000,
    priceFormatted: "$590K",
    address: "742 Seagull Court",
    city: "San Diego",
    state: "CA",
    zipCode: "92109",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    yearBuilt: 2010,
    propertyType: "Townhouse",
    status: "For Sale",
    description: "Rare opportunity to own a townhouse just steps from Mission Beach! This modern unit features an open layout, private patio, and is perfect for beach lovers. Walk to restaurants, shops, and the famous Mission Beach boardwalk.",
    features: [
      "Steps to Beach",
      "Private Patio",
      "Open Layout",
      "Modern Design",
      "Walk to Boardwalk",
      "Beach Community",
      "Low Maintenance",
      "Assigned Parking"
    ],
    images: [
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    agent: {
      name: "Amanda Rodriguez",
      phone: "(619) 555-0654",
      email: "amanda.rodriguez@beachrealty.com",
      photo: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100",
      company: "Beach Realty Co."
    },
    coordinates: { lat: 32.7701, lng: -117.2528 },
    mapPosition: { x: "70%", y: "70%" },
    daysOnMarket: 6,
    mlsNumber: "SD5678901"
  }
]