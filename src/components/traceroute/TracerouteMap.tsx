
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, Globe, MapPin } from 'lucide-react';
import { HopResult } from './TracerouteResults';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface TracerouteMapProps {
  results: HopResult[];
}

export const TracerouteMap: React.FC<TracerouteMapProps> = ({ results }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<boolean>(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if there are valid coordinates to display
    const validHops = results.filter(hop => 
      hop.latitude && hop.longitude && 
      !isNaN(Number(hop.latitude)) && 
      !isNaN(Number(hop.longitude))
    );
    
    if (validHops.length < 2 || !mapboxToken) {
      return;
    }
    
    // Import mapboxgl dynamically to avoid SSR issues
    import('mapbox-gl').then(mapboxgl => {
      import('mapbox-gl/dist/mapbox-gl.css');
      
      if (!mapRef.current) return;
      
      try {
        // Initialize Mapbox with the token
        mapboxgl.accessToken = mapboxToken;
        
        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1
        });
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        map.on('load', () => {
          setMapLoaded(true);
          toast.success("Map loaded successfully");
          
          // Add source and layer for the route line
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: validHops
                  .map(hop => [Number(hop.longitude), Number(hop.latitude)])
              }
            }
          });
          
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 3,
              'line-opacity': 0.8,
              'line-dasharray': [0.5, 1.5]
            }
          });
          
          // Add markers for each hop
          validHops.forEach((hop, index) => {
            // Create custom marker element
            const el = document.createElement('div');
            el.className = `flex items-center justify-center w-5 h-5 rounded-full ${
              index === 0 ? 'bg-green-500' : 
              index === validHops.length - 1 ? 'bg-red-500' : 'bg-blue-500'
            } shadow-md`;
            
            el.innerHTML = `<span class="text-white text-xs font-bold">${hop.hop}</span>`;
            
            // Add popup for hop details
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <div class="font-bold">Hop ${hop.hop}</div>
                  <div>IP: ${hop.ipAddress}</div>
                  <div>Location: ${hop.city || ''}, ${hop.country || 'Unknown'}</div>
                  ${hop.isp ? `<div>ISP: ${hop.isp}</div>` : ''}
                  ${hop.asn ? `<div>ASN: ${hop.asn}</div>` : ''}
                </div>
              `);
            
            // Add marker to map
            new mapboxgl.Marker(el)
              .setLngLat([Number(hop.longitude), Number(hop.latitude)])
              .setPopup(popup)
              .addTo(map);
          });
          
          // Fit the map to show all markers
          const bounds = new mapboxgl.LngLatBounds();
          validHops.forEach(hop => {
            bounds.extend([Number(hop.longitude), Number(hop.latitude)]);
          });
          
          map.fitBounds(bounds, {
            padding: 50,
            maxZoom: 5
          });
        });
        
        // Clean up on unmount
        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        toast.error("Failed to initialize map");
      }
    }).catch(error => {
      console.error('Error loading Mapbox GL:', error);
      setMapError(true);
      toast.error("Failed to load Mapbox GL");
    });
  }, [results, mapboxToken]);
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim() === '') {
      toast.error("Please enter a valid Mapbox token");
      return;
    }
    toast.info("Applying Mapbox token");
    setShowTokenInput(false);
  };
  
  const clearToken = () => {
    setMapboxToken('');
    setShowTokenInput(true);
    toast.info("Mapbox token cleared");
  };
  
  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <AlertCircle className="text-red-500 mb-2" size={24} />
        <p className="text-gray-700 mb-2">Unable to load map visualization</p>
        <p className="text-sm text-gray-500 mb-2">Please check console for errors</p>
        <Button variant="outline" onClick={() => { setMapError(false); setShowTokenInput(true); }}>
          Try again
        </Button>
      </div>
    );
  }
  
  const validHopsCount = results.filter(hop => hop.latitude && hop.longitude).length;
  
  if (validHopsCount < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <AlertCircle className="text-yellow-500 mb-2" size={24} />
        <p className="text-gray-700">Not enough location data for map visualization</p>
        <p className="text-sm text-gray-500 mt-2">At least 2 points with valid coordinates are required</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      {!mapboxToken ? (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          {showTokenInput ? (
            <form onSubmit={handleTokenSubmit} className="flex flex-col gap-2">
              <div className="flex justify-center mb-2">
                <Globe className="text-blue-500" size={32} />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Please enter your Mapbox access token to enable the map visualization.
                You can create one at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
              </p>
              <input
                type="text"
                className="border border-gray-300 rounded p-2"
                placeholder="Enter your Mapbox token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                autoComplete="off"
              />
              <Button type="submit" className="mt-2">Apply Token</Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-500" />
                <p className="text-gray-700 font-medium">Interactive map visualization available</p>
              </div>
              <Button onClick={() => setShowTokenInput(true)}>Set Up Map</Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="h-[400px] bg-gray-100 rounded-lg" ref={mapRef}>
            {!mapLoaded && (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                  <span className="text-gray-500">Loading map...</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-2">
            <Button variant="ghost" size="sm" onClick={clearToken}>
              Change Mapbox Token
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
