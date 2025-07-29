import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import { Property } from '../types/Property'
import '../types/global'

interface GoogleMapProps {
  properties: Property[]
  onPropertyClick: (propertyId: number) => void
}

const GoogleMap: React.FC<GoogleMapProps> = ({ properties, onPropertyClick }) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  useEffect(() => {
    console.log('🗺️ GoogleMap component mounted')
    console.log('📍 Properties received:', properties.length)
    console.log('🔑 API Key exists:', !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
    console.log('🔑 API Key value:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing')
    
    const initMap = async () => {
      console.log('🚀 Starting map initialization...')
      
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places']
      })

      try {
        console.log('📦 Loading Google Maps API...')
        await loader.load()
        console.log('✅ Google Maps API loaded successfully')
        
        if (mapRef.current) {
          console.log('🎯 Map container found, creating map instance...')
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 32.7157, lng: -117.1611 }, // San Diego center
            zoom: 11,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          })
          
          console.log('🗺️ Map instance created successfully')
          setMap(mapInstance)
        } else {
          console.error('❌ Map container ref is null')
        }
      } catch (error) {
        console.error('❌ Error loading Google Maps:', error)
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
      }
    }

    initMap()
  }, [])

  useEffect(() => {
    console.log('🔄 Properties or map changed')
    console.log('Map instance:', !!map)
    console.log('Properties count:', properties.length)
    
    if (map && properties.length > 0) {
      console.log('🧹 Clearing existing markers...')
      // Clear existing markers
      markers.forEach(marker => {
        if ((marker as any).overlay) {
          ;(marker as any).overlay.setMap(null)
        }
        marker.setMap(null)
      })
      
      console.log('📍 Creating new markers for properties...')
      
      const newMarkers = properties.map(property => {
        console.log(`Creating marker for property: ${property.title} at`, property.coordinates)
        
        // Create custom marker with price using InfoWindow approach
        const marker = new google.maps.Marker({
          position: property.coordinates,
          map: map,
          title: property.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0, // Hide the default marker
          }
        })

        // Create custom HTML marker
        const markerDiv = document.createElement('div')
        markerDiv.innerHTML = `
          <div style="
            background: #1E40AF;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            white-space: nowrap;
            font-family: Inter, sans-serif;
            transition: all 0.2s ease;
            border: 2px solid white;
            position: relative;
            z-index: 1000;
          ">
            ${property.priceFormatted}
          </div>
        `

        // Create overlay for custom marker
        const overlay = new google.maps.OverlayView()
        
        overlay.onAdd = function() {
          const panes = this.getPanes()
          if (panes && panes.overlayMouseTarget) {
            panes.overlayMouseTarget.appendChild(markerDiv)
          }
        }

        overlay.draw = function() {
          const projection = this.getProjection()
          if (projection && markerDiv.parentNode) {
            const position = projection.fromLatLngToDivPixel(property.coordinates)
            if (position) {
              markerDiv.style.position = 'absolute'
              markerDiv.style.left = (position.x - markerDiv.offsetWidth / 2) + 'px'
              markerDiv.style.top = (position.y - markerDiv.offsetHeight / 2) + 'px'
            }
          }
        }

        overlay.onRemove = function() {
          if (markerDiv.parentNode) {
            markerDiv.parentNode.removeChild(markerDiv)
          }
        }

        overlay.setMap(map)
        
        // Add hover effects
        markerDiv.addEventListener('mouseenter', () => {
          markerDiv.style.transform = 'scale(1.1)'
          markerDiv.style.zIndex = '1001'
        })
        
        markerDiv.addEventListener('mouseleave', () => {
          markerDiv.style.transform = 'scale(1)'
          markerDiv.style.zIndex = '1000'
        })
        
        // Add click listener
        markerDiv.addEventListener('click', (e) => {
          e.stopPropagation()
          console.log(`🖱️ Marker clicked for property: ${property.title} (ID: ${property.id})`)
          onPropertyClick(property.id)
        })

        // Store overlay reference for cleanup
        ;(marker as any).overlay = overlay
        ;(marker as any).propertyId = property.id

        return marker
      })

      console.log(`✅ Created ${newMarkers.length} markers`)
      setMarkers(newMarkers)

      // Fit map to show all markers with proper bounds
      if (newMarkers.length > 0) {
        console.log('🎯 Fitting map bounds to show all markers...')
        const bounds = new google.maps.LatLngBounds()
        properties.forEach(property => {
          bounds.extend(property.coordinates)
        })
        
        // Add padding to bounds
        map.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        })
        
        // Set reasonable zoom limits
        google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
          const zoom = map.getZoom()
          if (zoom && zoom > 15) {
            map.setZoom(15)
          } else if (zoom && zoom < 10) {
            map.setZoom(10)
          }
        })
      }
    } else {
      console.log('⏳ Waiting for map and properties...')
    }
  }, [map, properties, onPropertyClick])

  // Cleanup markers when component unmounts
  useEffect(() => {
    return () => {
      console.log('🧹 Cleaning up markers on unmount')
      markers.forEach(marker => {
        if ((marker as any).overlay) {
          ;(marker as any).overlay.setMap(null)
        }
        marker.setMap(null)
      })
    }
  }, [markers])

  console.log('🎨 Rendering GoogleMap component')
  
  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 11) + 1)}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button 
          onClick={() => map?.setZoom((map.getZoom() || 11) - 1)}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button 
          onClick={() => {
            console.log('📍 Getting user location...')
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                console.log('📍 User location found:', position.coords)
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                map?.setCenter(userLocation)
                map?.setZoom(14)
              }, (error) => {
                console.error('❌ Error getting user location:', error)
              })
            } else {
              console.error('❌ Geolocation not supported')
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </button>
      </div>

      {/* Current Location Indicator */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
      </div>
    </div>
  )
}

export default GoogleMap