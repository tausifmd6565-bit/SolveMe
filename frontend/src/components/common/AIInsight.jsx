import { useLanguage } from '../../context/LanguageContext'

export default function AIInsight({ ai, category }) {
  const { lang, getCategoryName, getLocalized } = useLanguage()

  if (!ai) return null

  const summary = getLocalized(ai.summary)
  const categoryName = getCategoryName(category || ai.category_id)

  return (
    <div className="panel-card p-5 space-y-3 bg-white">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {lang === 'hi' ? 'समस्या व्यवस्थापन (एआई सहायता)' : 'Problem Organization'}
          </h4>
          <p className="text-[11px] text-slate-500">
            {lang === 'hi'
              ? 'सिमेंटिक वर्गीकरण एवं अकादमिक विषय मैपिंग'
              : 'Semantic intake structuring & discipline mapping'}
          </p>
        </div>
        <span className="text-[11px] font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
          {lang === 'hi' ? 'एआई-सहायित सुझाव' : 'AI-Assisted Suggestions'}
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px] font-medium">
            {lang === 'hi' ? 'सुझाई गई श्रेणी:' : 'Suggested Category:'}
          </span>
          <span className="font-semibold text-slate-900 text-sm">{categoryName}</span>
        </div>

        {summary && (
          <div>
            <span className="text-slate-500 block text-[11px] font-medium">
              {lang === 'hi' ? 'संक्षिप्त सारांश:' : 'Structured Summary:'}
            </span>
            <p className="text-slate-700 leading-relaxed font-medium">{summary}</p>
          </div>
        )}

        {ai.tags && ai.tags.length > 0 && (
          <div>
            <span className="text-slate-500 block text-[11px] font-medium mb-1">
              {lang === 'hi' ? 'पहचाने गए मुख्य शब्द (Tags):' : 'Key Semantic Tags:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ai.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 font-mono text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {ai.possible_domains && ai.possible_domains.length > 0 && (
          <div>
            <span className="text-slate-500 block text-[11px] font-medium mb-1">
              {lang === 'hi' ? 'संबंधित इंजीनियरिंग / तकनीकी क्षेत्र:' : 'Relevant Technical Domains:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ai.possible_domains.map(d => (
                <span
                  key={d}
                  className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-800 font-medium text-xs"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
        {lang === 'hi'
          ? '⚠️ मानवीय एवं सामुदायिक सत्यापन अनिवार्य है। एआई निर्णय नहीं लेता।'
          : '⚠️ AI-assisted suggestions. Human and community validation required.'}
      </div>
    </div>
  )
}
