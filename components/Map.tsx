'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Partner } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  partners: Partner[];
  onMarkerClick: (partner: Partner) => void;
}

export default function Map({ partners, onMarkerClick }: MapProps) {
  const defaultCenter: [number, number] = [24.7136, 46.6753]; // Riyadh
  const defaultZoom = 11;

  if (typeof window === 'undefined') {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">Loading map...</div>;
  }

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {partners.map((partner) => (
        <Marker
          key={partner.id}
          position={[partner.latitude, partner.longitude]}
          eventHandlers={{
            click: () => onMarkerClick(partner),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{partner.name}</h3>
              <p className="text-sm text-gray-600">{partner.type}</p>
              <p className="text-sm">{partner.city}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
