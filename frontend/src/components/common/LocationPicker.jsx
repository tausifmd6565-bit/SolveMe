import { useState } from 'react'
import { MapPin, X, Check, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

function MapClick({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    }
  })
  return null
}

export default function LocationPicker({ isOpen, onClose, onSelect, initialLocation = '' }) {
  const [coords, setCoords] = useState([23.4124, 85.3245])
  const [address, setAddress] = useState(initialLocation || 'Kanke Block, Ranchi, Jharkhand')

  if (!isOpen) return null

  const handlePick = (lat, lng) => {
    setCoords([lat, lng])
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(res => res.json())
      .then(data => {
        if (data?.display_name) {
          setAddress(data.display_name.split(',').slice(0, 4).join(','))
        } else {
          setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
        }
      })
      .catch(() => {
        setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
      })
  }

  const handleConfirm = () => {
    onSelect(address, coords[0], coords[1])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl panel-border shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-800" />
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Select Location Pin</h3>
              <p className="text-[11px] text-slate-500">Click on the map or adjust coordinates</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Container */}
        <div className="h-80 w-full relative">
          <MapContainer
            center={coords}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} icon={mapIcon} />
            <MapClick onPick={handlePick} />
          </MapContainer>
        </div>

        {/* Input & Actions */}
        <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Selected Landmark / Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:border-slate-900 outline-none"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => handlePick(23.4124, 85.3245)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" /> Center on Ranchi District
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-600 rounded hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Set Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
