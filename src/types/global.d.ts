// Vite environment interface
declare global {
  interface ImportMetaEnv {
    readonly VITE_GOOGLE_MAPS_API_KEY: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// Type declarations for Google Maps
declare global {
  namespace google {
    namespace maps {
      class Map {
        constructor(element: HTMLElement, options?: any)
        setCenter(latLng: LatLng): void
        setZoom(zoom: number): void
        getZoom(): number | undefined
        fitBounds(bounds: LatLngBounds, options?: any): void
      }
      
      class Marker {
        constructor(options?: any)
        setMap(map: Map | null): void
      }
      
      class LatLngBounds {
        constructor()
        extend(latLng: LatLng): void
      }
      
      class LatLng {
        constructor(lat: number, lng: number)
      }
      
      class OverlayView {
        constructor()
        onAdd(): void
        draw(): void
        onRemove(): void
        setMap(map: Map | null): void
        getProjection(): Projection | null
        getPanes(): MapPanes | null
      }
      
      interface Projection {
        fromLatLngToDivPixel(latLng: LatLng): Point | null
      }
      
      interface MapPanes {
        overlayMouseTarget: HTMLElement
      }
      
      interface Point {
        x: number
        y: number
      }
      
      namespace event {
        function addListenerOnce(map: Map, event: string, handler: () => void): void
      }
      
      namespace SymbolPath {
        const CIRCLE: string
      }
    }
  }
}

export {} 