import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const GISMap = ({ center = [22.0797, 82.1391], markers = [], zoom = 12 }) => {
    // Robust coordinate parsing
    const parseCoord = (c) => {
        const val = parseFloat(c);
        return isNaN(val) ? null : val;
    };

    const lat = parseCoord(Array.isArray(center) ? center[0] : center?.lat);
    const lng = parseCoord(Array.isArray(center) ? center[1] : center?.lng);
    const safeCenter = (lat && lng) ? [lat, lng] : [22.0797, 82.1391];

    return (
        <div className="w-full h-full relative overflow-hidden rounded-[1.5rem]" style={{ minHeight: '350px', background: '#f8fafc' }}>
            <MapContainer 
                key={`${safeCenter[0]}-${safeCenter[1]}`}
                center={safeCenter} 
                zoom={zoom} 
                scrollWheelZoom={false}
                className="h-full w-full z-0"
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <Circle 
                    center={safeCenter} 
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }} 
                    radius={3000} 
                />

                {markers.map((marker, idx) => {
                    const mLat = parseCoord(marker.lat);
                    const mLng = parseCoord(marker.lng);
                    if (!mLat || !mLng) return null;

                    return (
                        <Marker 
                            key={`marker-${idx}-${mLat}-${mLng}`} 
                            position={[mLat, mLng]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div className="p-1 min-w-[140px] font-sans">
                                    <h3 className="font-bold text-gray-900 text-sm tracking-tight mb-1">{marker.title}</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${marker.type === 'Request' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {marker.type}
                                        </span>
                                        {marker.bloodType && (
                                            <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider">
                                                {marker.bloodType}
                                            </span>
                                        )}
                                    </div>
                                    {marker.units && (
                                        <p className="mt-2 text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                            <i className="fas fa-tint mr-1 text-red-500"></i> {marker.units} Units
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default GISMap;
