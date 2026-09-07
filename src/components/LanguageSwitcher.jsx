import { rememberLanguage, useLanguage } from '../i18n'
export default function LanguageSwitcher() {
  const { lang, copy, alternateHref } = useLanguage()
  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={copy.languageSwitcher}
    >
      <span aria-current="page">{lang === 'zh' ? '中文' : 'EN'}</span>
      <span aria-hidden="true">/</span>
      <a
        href={alternateHref}
        lang={lang === 'zh' ? 'en' : 'zh-Hant'}
        onClick={() => rememberLanguage(lang === 'zh' ? 'en' : 'zh')}
      >
        {lang === 'zh' ? 'EN' : '中文'}
      </a>
    </div>
  )
}
