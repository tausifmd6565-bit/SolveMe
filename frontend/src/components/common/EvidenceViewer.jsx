import { useLanguage } from '../../context/LanguageContext'
import { FileText, Image as ImageIcon } from 'lucide-react'

export default function EvidenceViewer({ evidence }) {
  const { getLocalized, lang } = useLanguage()

  if (!evidence || !evidence.url) {
    return (
      <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50 text-xs text-slate-500 flex items-center gap-2">
        <FileText className="w-4 h-4 text-slate-400" />
        <span>{lang === 'hi' ? 'कोई दृश्य प्रमाण संलग्न नहीं है।' : 'No photographic evidence attached.'}</span>
      </div>
    )
  }

  const caption = getLocalized(evidence.caption)

  return (
    <div className="space-y-2">
      <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 max-h-72 flex items-center justify-center">
        <img
          src={evidence.url}
          alt="Field Documentation"
          className="w-full h-full object-cover max-h-72"
        />
      </div>
      {caption && (
        <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
          <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>{caption}</span>
        </p>
      )}
    </div>
  )
}
