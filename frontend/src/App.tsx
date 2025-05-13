import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Libraries, InfoWindow } from '@react-google-maps/api';
import { Box, Container, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Stack } from '@mui/material';
import { DroneSpot, DroneType } from './types';
import { api } from './services/api';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { getGeocode } from 'use-places-autocomplete';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 0,
  lng: 0
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyCMqA62e9AKe4y5piHcdKCYP07_nGJmRlg';

const libraries: Libraries = ['places'];

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

function App() {
  const [spots, setSpots] = useState<DroneSpot[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<DroneSpot | null>(null);
  const [newSpot, setNewSpot] = useState<Partial<DroneSpot>>({
    name: '',
    description: '',
    types: []
  });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const {
    suggestions: { status, data },
    setValue: setPlaceValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: selectedLocation
      ? {
          location: selectedLocation,
          radius: 1000,
          types: ['establishment', 'point_of_interest', 'natural_feature']
        }
      : undefined,
    debounce: 300,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(userLocation);
          map.setZoom(15);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const onUnmount = useCallback(() => {
    // Cleanup if needed
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setSelectedLocation(event.latLng);
      setIsDialogOpen(true);
    }
  };

  const handleSpotTypeToggle = (type: DroneType) => {
    setNewSpot(prev => ({
      ...prev,
      types: prev.types?.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...(prev.types || []), type]
    }));
  };

  const handlePlaceSelect = async (description: string) => {
    setPlaceValue(description, false);
    setNewSpot((prev) => ({ ...prev, name: description }));
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      if (results[0]) {
        const { lat, lng } = results[0].geometry.location;
        if (selectedLocation) {
          const newLatLng = new google.maps.LatLng(lat(), lng());
          setSelectedLocation(newLatLng);
        }
      }
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  };

  const handleAddSpot = async () => {
    if (selectedLocation && newSpot.name && newSpot.types?.length) {
      const spot = {
        name: newSpot.name,
        description: newSpot.description,
        types: newSpot.types as DroneType[],
        location: {
          lat: selectedLocation.lat(),
          lng: selectedLocation.lng(),
        },
      };
      const created = await api.createSpot(spot);
      setSpots((prev) => [...prev, created]);
      setIsDialogOpen(false);
      setNewSpot({ name: '', description: '', types: [] });
      setPlaceValue('');
    }
  };

  useEffect(() => {
    api.getSpots().then((spots) => {
      setSpots(spots);
    });
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      {isLoaded ? (
        <Box sx={{ position: 'relative' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={2}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={mapOptions}
          >
            {spots.map((spot, index) => (
              <Marker
                key={index}
                position={spot.location}
                title={spot.name}
                onClick={() => setSelectedSpot(spot)}
              />
            ))}
            {selectedSpot && (
              <InfoWindow
                position={selectedSpot.location}
                onCloseClick={() => setSelectedSpot(null)}
              >
                <div>
                  <h3>{selectedSpot.name}</h3>
                  {selectedSpot.description && <p>{selectedSpot.description}</p>}
                  <div>
                    {selectedSpot.types.map((type, i) => (
                      <Chip key={i} label={type} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogTitle>Add New Drone Spot</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                value={newSpot.name}
                onChange={(e) => {
                  setNewSpot((prev) => ({ ...prev, name: e.target.value }));
                  setPlaceValue(e.target.value);
                }}
                placeholder="Enter a name"
              />
              {status === 'OK' && data.length > 0 && (
                <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                  {data.map(({ place_id, description }) => (
                    <Box
                      key={place_id}
                      sx={{ 
                        cursor: 'pointer', 
                        p: 1, 
                        '&:hover': { background: '#f5f5f5' },
                        borderBottom: '1px solid #eee'
                      }}
                      onClick={() => handlePlaceSelect(description)}
                    >
                      {description}
                    </Box>
                  ))}
                </Box>
              )}
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newSpot.description}
                onChange={(e) => setNewSpot(prev => ({ ...prev, description: e.target.value }))}
              />
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Drone Types
              </Typography>
              <Stack direction="row" spacing={1}>
                {(['tinywhoop', 'toothpick', '5-inch'] as DroneType[]).map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    onClick={() => handleSpotTypeToggle(type)}
                    color={newSpot.types?.includes(type) ? 'primary' : 'default'}
                  />
                ))}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleAddSpot}
                disabled={!newSpot.name || !newSpot.types?.length}
              >
                Add Spot
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      )}
    </Container>
  );
}

export default App; 