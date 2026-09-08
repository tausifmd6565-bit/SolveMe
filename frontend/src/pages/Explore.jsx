import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import { CATEGORIES, STATUS_LIST } from '../data/mockData'
import ProblemStatus from '../components/common/ProblemStatus'
import { Search, MapPin, List, Map as MapIcon, ArrowUpRight } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const customPin = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

export default function Explore() {
  const { lang, t, getLocalized, getCategoryName } = useLanguage()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState('split') // split | list | map

  useEffect(() => {
    load()
  }, [sector, search])

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getProblems({ category: sector, search })
      let filtered = data
      if (statusFilter) {
        filtered = filtered.filter(p => p.status === statusFilter)
      }
      setProblems(filtered)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'सामुदायिक समस्याएं खोजें' : 'Explore Community Problems'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'स्थान, श्रेणी अथवा प्राथमिकता के आधार पर नागरिक चुनौतियों का अन्वेषण करें।'
              : 'Search civic issues geographically and review technical verification parameters.'}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white panel-card p-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'hi' ? 'समस्या, स्थान या श्रेणी खोजें...' : 'Search problems, locations or categories...'}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 font-medium"
          />
        </div>

        <select
          value={sector}
          onChange={e => setSector(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none focus:border-slate-900 font-medium"
        >
          <option value="">{t('allSectors')}</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{lang === 'hi' ? c.hi : c.en}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700 bg-white outline-none focus:border-slate-900 font-medium"
        >
          <option value="">All Statuses</option>
          {STATUS_LIST.map(s => (
            <option key={s.id} value={s.id}>{lang === 'hi' ? s.hi : s.en}</option>
          ))}
        </select>
      </div>

      {/* Main Area: Split List + Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* List Column */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-2.5`}>
            {loading ? (
              <div className="py-16 text-center text-xs text-slate-500">Loading records...</div>
            ) : problems.length === 0 ? (
              <div className="panel-card p-8 text-center text-xs text-slate-500">No matching issues found.</div>
            ) : (
              problems.map(p => (
                <Link
                  key={p.id}
                  to={`/problem/${p.id}`}
                  className="panel-card p-3.5 block hover:border-slate-400 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{p.id}</span>
                    <ProblemStatus status={p.status} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {getLocalized(p.title)}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {p.ai ? getLocalized(p.ai.summary) : getLocalized(p.description)}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 mt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[200px]">{p.location}</span>
                    </span>
                    <span className="font-mono font-semibold text-slate-800">
                      Score: {p.priority?.total?.toFixed(1) || '12.0'} / 20
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Map Column */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={`${viewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} sticky top-20`}>
            <div className="panel-card overflow-hidden h-[540px] rounded-xl border border-slate-200 relative">
              <MapContainer
                center={[23.4124, 85.35]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {problems.map(p => {
                  if (!p.lat || !p.lng) return null
                  return (
                    <Marker key={p.id} position={[p.lat, p.lng]} icon={customPin}>
                      <Popup>
                        <div className="p-1 text-xs space-y-1 max-w-xs">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{p.id}</span>
                          <h5 className="font-bold text-slate-900 leading-tight">{getLocalized(p.title)}</h5>
                          <p className="text-slate-500 text-[11px] line-clamp-2">{getLocalized(p.description)}</p>
                          <Link to={`/problem/${p.id}`} className="text-blue-600 font-semibold hover:underline block pt-1">
                            View Details →
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
