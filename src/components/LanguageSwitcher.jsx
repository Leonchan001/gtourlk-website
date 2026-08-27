import { rememberLanguage, useLanguage } from '../i18n'

export default function LanguageSwitcher({ light = false, compact = false }) {
  const { lang, copy, alternateHref } = useLanguage()
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
