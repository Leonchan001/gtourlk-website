import { rememberLanguage, useLanguage } from '../i18n'

export default function LanguageSwitcher({ light = false, compact = false, prominent = false }) {
  const { lang, copy, alternateHref } = useLanguage()

  if (prominent) {
    const label = lang === 'en' ? 'Language' : '網站語言'
    const activeClass = 'flex min-h-11 min-w-[68px] items-center justify-center bg-brick-500 px-4 text-sm font-semibold text-paper-50'
    const linkClass = 'flex min-h-11 min-w-[68px] items-center justify-center px-4 text-sm font-semibold text-ink-700 transition-colors hover:bg-paper-100 hover:text-brick-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brick-500'

    return (
      <div
        role="group"
        aria-label={copy.languageSwitcher}
        className="inline-flex items-center border border-paper-50/80 bg-paper-50/95 p-1 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-md"
      >
        <span className="px-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-ink-500">
          {label}
        </span>
        {lang === 'zh' ? (
          <>
            <span lang="zh-Hant" aria-current="page" className={activeClass}>中文</span>
            <a lang="en" href={alternateHref} onClick={() => rememberLanguage('en')} className={linkClass}>EN</a>
          </>
        ) : (
          <>
            <a lang="zh-Hant" href={alternateHref} onClick={() => rememberLanguage('zh')} className={linkClass}>中文</a>
            <span lang="en" aria-current="page" className={activeClass}>EN</span>
          </>
        )}
      </div>
    )
  }

  const activeClass = light ? 'text-paper-50' : 'text-ink-700'
  const mutedClass = light ? 'text-paper-100/55' : 'text-ink-300'
  const linkClass = light
    ? 'text-paper-100/55 hover:text-paper-50'
    : 'text-ink-300 hover:text-ink-700'

  return (
    <div
      role="group"
      className={`inline-flex items-center font-mono uppercase ${compact ? 'text-[11px]' : 'text-[10px]'} tracking-wider`}
      aria-label={copy.languageSwitcher}
    >
      {lang === 'zh' ? (
        <>
          <span lang="zh-Hant" aria-current="page" className={activeClass}>中文</span>
          <span aria-hidden="true" className={`mx-2 ${mutedClass}`}>/</span>
          <a lang="en" href={alternateHref} onClick={() => rememberLanguage('en')} className={`${linkClass} transition-colors`}>EN</a>
        </>
      ) : (
        <>
          <a lang="zh-Hant" href={alternateHref} onClick={() => rememberLanguage('zh')} className={`${linkClass} transition-colors`}>中文</a>
          <span aria-hidden="true" className={`mx-2 ${mutedClass}`}>/</span>
          <span lang="en" aria-current="page" className={activeClass}>EN</span>
        </>
      )}
    </div>
  )
}
