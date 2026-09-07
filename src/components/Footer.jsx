import { BUSINESS } from '../data/business'
import { useLanguage } from '../i18n'
export default function Footer() {
  const { lang, copy, clock } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="page-width">
        <div className="footer-top">
          <div>
            <a href="#top" className="footer-brand">
              GtourLK
            </a>
            <p className="footer-intro">
              {lang === 'zh'
                ? '導鹿・一群熱愛鹿港的人，陪你穿過巷弄，讀懂這座老城。'
                : 'Local people, quiet lanes, and a town full of stories. See Lukang with GtourLK.'}
            </p>
            <div className="footer-links">
              {[
                [
                  'Facebook',
                  'https://www.facebook.com/p/%E5%B0%8E%E9%B9%BFgtourlk-%E9%B9%BF%E6%B8%AF%E4%B8%89%E8%BC%AA%E8%BB%8A%E8%A7%80%E5%85%89%E5%B0%8E%E8%A6%BD-61566567161745/',
                ],
                ['Instagram', 'https://www.instagram.com/gtourlk'],
                ['Threads', 'https://www.threads.net/@gtourlk'],
              ].map(([name, href]) => (
                <a href={href} key={name} target="_blank" rel="noreferrer">
                  {name} ↗
                </a>
              ))}
            </div>
          </div>
          <nav
            className="footer-nav"
            aria-label={lang === 'zh' ? '頁尾導覽' : 'Footer navigation'}
          >
            {copy.header.nav.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="footer-contact">
            <p>{BUSINESS.address[lang]}</p>
            <p>
              {lang === 'zh'
                ? '每日 08:00–19:00・全程預約制'
                : 'Daily 08:00–19:00 · By reservation'}
            </p>
            <a href={BUSINESS.lineUrl} target="_blank" rel="noreferrer">
              LINE / {BUSINESS.lineId} ↗
            </a>
            {BUSINESS.phones.map((phone, i) => (
              <a
                key={phone.tel}
                href={`tel:${phone.tel}`}
                aria-label={`${copy.header.phoneLabels[i]} ${phone.display}`}
              >
                {phone.display}
              </a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date(clock).getFullYear()} {BUSINESS.name}. All rights
            reserved.
          </span>
          <span>LUKANG · CHANGHUA · TAIWAN</span>
          <a href="#top">{lang === 'zh' ? '回到頁首 ↑' : 'Back to top ↑'}</a>
        </div>
      </div>
    </footer>
  )
}
