import { useState, useMemo, useEffect } from 'react'
import './App.css'

// npm i @react-google-maps/api    
import { GoogleMap, useLoadScript, MarkerF, Marker, Circle, InfoWindow } from '@react-google-maps/api'
import PlacesAutoComplete from "./PlacesAutoComplete"

// npm install spherical-geometry-js
// import { computeDistanceBetween } from 'spherical-geometry-js';



// admin ไป fetch lat lng มา
function Map({ viewMode, adminLocation = null, data }) {

    const bangkokBounds = {
        north: 14.0000,
        south: 13.5000,
        east: 100.9000,
        west: 100.4000,
    };

    const [currentLocation, setCurrentLocation] = useState(null);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState({ lat: 13.7462, lng: 100.5347 });
    const [selected, setSelected] = useState(null);
    const [clicked, setClicked] = useState(null);
    const [selectedInfoWindow, setSelectedInfoWindow] = useState(null);
    const [libraries, setLibraries] = useState(['places', 'geometry']);

    console.log('clicked', clicked)
    console.log('selected', selected)

    useEffect(() => {
        getLocation();
        // console.log(currentLocation)
    }, []);


    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }

    const showPosition = (position) => {
        const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        setCurrentLocation(newLocation);
        setCenter(newLocation); // ทำการ set ค่า center ใหม่ที่นี่
    };

    const handleError = (error) => {
        setError("Error fetching location: " + error.message);
    };

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCC_tCic6ScwrR9HlXYj7ryLj7uvTLQRpk',
        libraries
    });


    const handleSetSelected = (input) => {
        setClicked(null)
        setSelected(input);
    }

    const handleClickLocation = (e) => {
        const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setClicked(location);
    }

    const onMarkerClick = (geo) => {
        setSelectedInfoWindow(geo);
    };



    const calculateBoundingBox = (center, radius) => {
        const kmPerDegreeLatitude = 111.32;
        const latitudeChange = radius / kmPerDegreeLatitude;
        const longitudeChange = radius / (kmPerDegreeLatitude * Math.cos(center.lat * (Math.PI / 180)));

        return {
            north: center.lat + latitudeChange,
            south: center.lat - latitudeChange,
            east: center.lng + longitudeChange,
            west: center.lng - longitudeChange,
        };
    };

    const markersWithinRadius = useMemo(() => {
        if (!viewMode) {
            return [];
        }
        if (!currentLocation) {
            return []; // จังหวะ render ครั้งแรก currentLocation ยังมาไม่ทัน
        }

        const radius = 5000; // 5 km in meters
        const boundingBox = calculateBoundingBox(currentLocation, radius);

        // First, filter markers within the bounding box
        const markersInBoundingBox = data.filter(marker =>
            marker.lat >= boundingBox.south &&
            marker.lat <= boundingBox.north &&
            marker.lng >= boundingBox.west &&
            marker.lng <= boundingBox.east
        );

        // Further filter based on exact spherical distance
        return markersInBoundingBox.filter(marker => {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(currentLocation),
                new google.maps.LatLng(marker)
            );
            console.log(`Distance from ${marker.title}:`, distance);
            return distance <= radius;
        });
    }, [currentLocation, data]);


    if (!isLoaded) return <div>Loading...</div>;

    return (
        <>
            <div>
                <button onClick={getLocation}>Fetch</button>
                <p id="demo">
                    {currentLocation && (
                        <>
                            Latitude: {currentLocation.lat}
                            <br />
                            Longitude: {currentLocation.lng}
                        </>
                    )}
                    {error && <div>{error}</div>}
                </p>
            </div>

            <div className='center'>
                <GoogleMap
                    center={selected || center}
                    mapContainerClassName='map-container'
                    zoom={14}
                    options={{
                        mapId: '5313b71b2c9e0053',
                        restriction: {
                            latLngBounds: bangkokBounds,
                            strictBounds: true,
                        },
                        minZoom: 5,
                        maxZoom: 18,
                    }}
                    // onClick={e=> console.log(e)}
                    onClick={handleClickLocation}
                >


                    {viewMode ? (
                        <div>
                            {currentLocation && userLocationIcon && (
                                <>
                                    <Circle
                                        center={currentLocation}
                                        radius={5050}
                                        options={{
                                            strokeColor: '#EB544D',
                                            strokeWeight: 2,
                                            fillColor: '#FFCDCB',
                                            fillOpacity: 0.1
                                        }}
                                    />
                                    <Marker position={currentLocation} icon={userLocationIcon} />
                                </>
                            )}


                            {
                                markersWithinRadius.map((geo, index) => (
                                    <Marker
                                        key={index}
                                        position={geo}
                                        title={geo.title}
                                        label={geo.title}
                                        options={{ zIndex: 999 }}
                                        onClick={() => setSelectedInfoWindow(geo)}
                                    />
                                ))
                            }

                            {selectedInfoWindow && (
                                <InfoWindow
                                    position={selectedInfoWindow}
                                    onCloseClick={() => setSelectedInfoWindow(null)}
                                >
                                    <div>
                                        <h4>{selectedInfoWindow.title}</h4>
                                        <img style={{ height: 100 }} src='https://yt3.googleusercontent.com/ytc/APkrFKbkBG77Mb_TaYVEZHr9Cz7q9UzN2EpD27WfOVT7=s900-c-k-c0x00ffffff-no-rj' />
                                    </div>
                                </InfoWindow>
                            )}

                        </div>
                    ) : (
                        <>
                            <PlacesAutoComplete handleSetSelected={handleSetSelected}></PlacesAutoComplete>

                            {/* ถามว่า select กับ clicked มีไหม ถ้ามีตัวในตัวหนึ่ง ให้ set position MarkerF */}
                            {(selected || clicked) && <MarkerF position={clicked || selected} />}
                        </>
                    )}

                </GoogleMap>
            </div>
        </>
    )
}

export default Map;
