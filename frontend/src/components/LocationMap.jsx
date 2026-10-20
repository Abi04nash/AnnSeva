import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// FIX: Leaflet React mein default icon load nahi karta, yeh 4 lines usko fix karti hain
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Yeh component map ko naye coordinates par automatically center karta hai
const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
}

const LocationMap = ({ address }) => {
    const [position, setPosition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!address) return;

        const getCoordinates = async () => {
            setLoading(true);
            try {
                let parts = address.split(',').map(p => p.trim());
                let found = false;

                while (parts.length > 0 && !found) {
                    const currentQuery = parts.join(', ');
                    console.log("Trying API with:", currentQuery); 
                    
                    const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentQuery)}`);
                    
                    if (res.data && res.data.length > 0) {
                        setPosition([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
                        found = true;
                    } else {
                        parts.shift(); 
                    }
                }

                if (!found) {
                    setPosition(null);
                }
            } catch (err) {
                console.error("Geocoding failed", err);
                setPosition(null);
            } finally {
                setLoading(false);
            }
        };

        getCoordinates();
    }, [address]);

    if (loading) {
        return <div className="h-64 w-full bg-gray-100 animate-pulse flex items-center justify-center rounded-xl text-gray-500 font-medium">Loading Map...</div>;
    }

    if (!position) {
        return <div className="h-64 w-full bg-red-50 flex items-center justify-center rounded-xl text-red-500 font-medium border border-red-100">Location exact match not found on Map</div>;
    }

    return (
        <div className="h-64 w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 0 }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>{address}</Popup>
                </Marker>
                <RecenterAutomatically lat={position[0]} lng={position[1]} />
            </MapContainer>
        </div>
    );
};

export default LocationMap;





