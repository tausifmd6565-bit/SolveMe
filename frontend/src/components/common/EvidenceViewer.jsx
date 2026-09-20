import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Image as ImageIcon, Video, Maximize2, X, ShieldCheck, MapPin } from 'lucide-react'

export default function EvidenceViewer({ evidence, location }) {
  const { getLocalized, lang } = useLanguage()
  const [selectedMedia, setSelectedMedia] = useState(null)

  if (!evidence || !evidence.url) {
    return (
      <div className="py-6 px-5 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 text-xs text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{lang === 'hi' ? 'कोई दृश्य प्रमाण संलग्न नहीं है।' : 'No photographic field evidence attached to this report.'}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Awaiting Field Audit</span>
      </div>
    )
  }

  const caption = getLocalized(evidence.caption)
  const isVideo = evidence.type === 'video' || (evidence.url && (evidence.url.endsWith('.mp4') || evidence.url.endsWith('.webm')))

  // Supporting sample thumbnails if none provided
  const supportingThumbnails = evidence.additional || [
    {
      url: evidence.url,
      caption: caption || (lang === 'hi' ? 'प्राथमिक स्थल प्रमाण' : 'Primary Site Evidence')
    }
  ]

  return (
    <div className="space-y-3">
      {/* Primary Hero Evidence Container */}
      <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-slate-950 shadow-xs">
        {isVideo ? (
          <video
            src={evidence.url}
            controls
            muted
            playsInline
            poster={evidence.poster || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80'}
            className="w-full max-h-[440px] object-cover bg-black"
          />
        ) : (
          <div
            onClick={() => setSelectedMedia({ url: evidence.url, caption, isVideo: false })}
            className="cursor-zoom-in relative overflow-hidden"
          >
            <img
              src={evidence.url}
              alt="Field Evidence"
              className="w-full max-h-[440px] sm:max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
            />
            {/* View Fullscreen Overlay Button */}
            <button
              type="button"
              className="absolute top-3 right-3 px-2.5 py-1.5 rounded bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-medium backdrop-blur-xs flex items-center gap-1.5 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'बड़ा देखें' : 'Inspect Evidence'}</span>
            </button>
          </div>
        )}

        {/* Source & Geotag Ribbon */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-4 flex flex-wrap items-center justify-between gap-2 text-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              {lang === 'hi' ? 'सत्यापित फील्ड साक्ष्य' : 'Verified Field Capture'}
            </span>
            {location && (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{location}</span>
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            {isVideo ? 'Digital Video Record' : 'High-Res Optical Evidence'}
          </span>
        </div>
      </div>

      {/* Caption & Metadata Footnote */}
      {caption && (
        <div className="flex items-start justify-between gap-3 text-xs text-slate-600 px-1">
          <p className="flex-1 font-medium leading-relaxed">
            <span className="text-slate-900 font-bold mr-1">Fig 1.1:</span>
            {caption}
          </p>
          <span className="text-[11px] text-slate-400 font-mono shrink-0">EXIF Geotagged</span>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-900 rounded-lg overflow-hidden border border-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-900/90 text-white">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-400 uppercase tracking-wider">Case Evidence Viewer</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-300 font-medium">{location || 'On-site Documentation'}</span>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Close viewer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full overflow-auto max-h-[75vh] flex items-center justify-center bg-black p-2">
              <img
                src={selectedMedia.url}
                alt="Case Evidence Fullscreen"
                className="max-h-[72vh] w-auto object-contain mx-auto"
              />
            </div>

            {selectedMedia.caption && (
              <div className="w-full p-3 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                {selectedMedia.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
