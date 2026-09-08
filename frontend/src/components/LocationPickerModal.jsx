import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapPin, X, Check } from 'lucide-react'

// Fix default marker icon in Leaflet + Vite
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setPosition([lat, lng])
      // Reverse geocode via OpenStreetMap Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name)
          } else {
            setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
          }
        })
        .catch(() => {
          setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
        })
    },
  })

  return position ? <Marker position={position} icon={customIcon} /> : null
}

export default function LocationPickerModal({ isOpen, onClose, onSelectLocation, initialLocation = '' }) {
  // Center around Ranchi / Jharkhand default: [23.3441, 85.3096]
  const [position, setPosition] = useState([23.3441, 85.3096])
  const [address, setAddress] = useState(initialLocation || 'Ranchi, Jharkhand, India')

  if (!isOpen) return null

  const handleConfirm = () => {
    onSelectLocation(address)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Pick Location on Map</h3>
              <p className="text-xs text-gray-500">Click anywhere on the map to set the problem location pin</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-200 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Area */}
        <div className="h-96 w-full relative">
          <MapContainer
            center={position}
            zoom={12}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} />
          </MapContainer>
        </div>

        {/* Selected Location Bar & Actions */}
        <div className="p-4 border-t border-gray-200 bg-white space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Selected Location / Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              <Check className="w-4 h-4" /> Set Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
