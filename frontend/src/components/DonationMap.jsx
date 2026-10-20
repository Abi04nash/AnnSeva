import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

const tiffinIcon = new L.Icon({
    iconUrl: "https://img.icons8.com/color/48/meal.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const DynamicMarker = ({ donation }) => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!donation.pickupLocation) return;
            
            try {
                let parts = donation.pickupLocation.split(',').map(p => p.trim());
                let found = false;

                while (parts.length > 0 && !found) {
                    const currentQuery = parts.join(', ');
                    const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentQuery)}`);
                    
                    if (res.data && res.data.length > 0) {
                        setCoords([parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)]);
                        found = true;
                    } else {
                        parts.shift(); 
                    }
                }
            } catch (error) {
                console.error("Geocoding failed for marker:", error);
            }
        };

        fetchCoordinates();
    }, [donation.pickupLocation]);

    if (!coords) return null; 

    return (
        <Marker position={coords} icon={tiffinIcon}>
            <Popup className="rounded-xl">
                <div className="w-40 p-0 space-y-2 bg-white rounded-xl">
                    <p className="text-sm font-bold text-gray-900 leading-snug">
                        {donation.title}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            🍱 {donation.donationType}
                        </span>
                        <span className=" text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            ● Active
                        </span>
                    </div>

                    <div className="text-xs text-gray-700 space-y-1">
                        <div className="flex items-start gap-1">
                            <span className="font-medium">
                                Location: <b>{donation.pickupLocation}</b>
                            </span>
                        </div>
                        <div className="flex items-start gap-1">
                            <span>
                                Quantity: <b>{donation.quantity}</b>
                            </span>
                        </div>
                        <div className="flex items-start gap-1">
                            <span>
                                Expires At: <b>{donation.expiryAt?.split('T')[0]}</b>
                            </span>
                        </div>
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

const DonationMap = ({ donations }) => {
    const defaultCenter = [22.3511, 78.6677]; // India/Nagpur ke coordinates as center hain India ke 

    return (
        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border bg-white/60 backdrop-blur-md shadow-lg z-0">
            <MapContainer
                center={defaultCenter} 
                zoom={5}
                className="h-full w-full"
                style={{ zIndex: 0 }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                {donations?.filter(donation => donation.status === "active").map((donation) => (
                    <DynamicMarker key={donation._id} donation={donation} />
                ))}
            </MapContainer>
        </div>
    );
};

export default DonationMap;