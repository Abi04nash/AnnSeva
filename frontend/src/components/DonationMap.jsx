import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { cityCoordinates } from '@/utils/cityCoordinates';
import { useNavigate } from 'react-router-dom';
import L from "leaflet";

const tiffinIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/color/48/meal.png",
  iconSize: [30, 30],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});



const DonationMap = ({ donations }) => {

    return (

        <div className="relative w-full h-[600px] rounded-2xl overflow-hidden
  border bg-white/60 backdrop-blur-md shadow-lg">

            <MapContainer
                center={[21.0, 78.0]} // India center
                zoom={5}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {donations?.filter(donation => donation.status === "active").map((donation) => {
                    // ✅ CORRECT FIELD + NORMALIZATION
                    const city = donation.pickupLocation?.trim().toLowerCase();
                    const coords = cityCoordinates[city];

                    if (!coords) {
                        console.warn("No coordinates for:", donation.pickupLocation);
                        return null;
                    }

                    return (
                        <Marker
                            key={donation._id}
                            position={coords}
                            icon={tiffinIcon}
                        >

                            <Popup className="rounded-xl">
                                <div className="w-40 p-0 space-y-2 bg-white rounded-xl">
                                    <p className="text-sm font-bold text-gray-900 leading-snug">
                                        {donation.title}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                            🍱 {donation.donationType}
                                        </span>

                                        <span className=" text-[10px] font-semibold  bg-green-100  text-green-700 px-2 py-0.5 rounded-full">
                                            ● Active
                                        </span>
                                    </div>

                                    {/* Info stack */}
                                    <div className="text-xs text-gray-700 space-y-1">

                                        <div className="flex items-start gap-1">
                                            <span>📍</span>
                                            <span className="font-medium">
                                                {donation.pickupLocation}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-1">
                                            <span>📦</span>
                                            <span>
                                                Quantity: <b>{donation.quantity}</b>
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-1">
                                            <span>⏰</span>
                                            <span>
                                                Expires At: <b>{donation.expiryAt}</b>
                                            </span>
                                        </div>

                                    </div>

                                    {/* Divider */}
                                    <div className="h-px bg-gray-200" />



                                </div>
                            </Popup>


                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default DonationMap;
