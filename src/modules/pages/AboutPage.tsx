import React from 'react'

const t = (key: string, lang: 'en' | 'ar') => {
  const dict: Record<string, { en: string; ar: string }> = {
    about_title: { en: 'About Zobda', ar: 'حول Zobda' },
    about_subtitle: { en: 'Your trusted Amazon price tracking companion', ar: 'رفيقك الموثوق لتتبع أسعار أمازون' },
    mission_title: { en: 'Our Mission', ar: 'مهمتنا' },
    mission_p1: { en: 'At Zobda, we believe that every shopper deserves to make informed purchasing decisions. Our mission is to empower consumers with accurate, real-time price tracking and historical data for Amazon products, helping you save money and never overpay again.', ar: 'في زوبدا، نؤمن أن كل متسوق يستحق اتخاذ قرارات شراء واعية. مهمتنا هي تمكين المستهلكين من تتبع الأسعار بدقة وفي الوقت الحقيقي والحصول على بيانات تاريخية لمنتجات أمازون لمساعدتك على توفير المال وعدم الدفع الزائد مرة أخرى.' },
    mission_p2: { en: "We're committed to providing a transparent, user-friendly platform that makes price tracking accessible to everyone, from casual shoppers to deal hunters.", ar: 'نلتزم بتقديم منصة شفافة وسهلة الاستخدام تجعل تتبع الأسعار متاحًا للجميع، من المتسوقين العاديين إلى صائدي الصفقات.' },
    what_title: { en: 'What We Do', ar: 'ماذا نقدم' },
    price_tracking: { en: 'Price Tracking', ar: 'تتبع الأسعار' },
    price_tracking_desc: { en: 'Monitor Amazon product prices in real-time and receive alerts when prices drop to your desired level.', ar: 'راقب أسعار منتجات أمازون في الوقت الحقيقي وتلقّ التنبيهات عند انخفاض الأسعار إلى المستوى الذي تريده.' },
    history: { en: 'Historical Data', ar: 'البيانات التاريخية' },
    history_desc: { en: 'Access comprehensive price history charts to understand pricing patterns and make better buying decisions.', ar: 'اطلع على مخططات شاملة للتاريخ السعري لفهم أنماط التسعير واتخاذ قرارات شراء أفضل.' },
    discovery: { en: 'Deal Discovery', ar: 'اكتشاف العروض' },
    discovery_desc: { en: 'Discover the best deals and price drops happening right now across thousands of Amazon products.', ar: 'اكتشف أفضل العروض وانخفاضات الأسعار الجارية الآن عبر آلاف منتجات أمازون.' },
    mobile: { en: 'Mobile Friendly', ar: 'متوافق مع الجوال' },
    mobile_desc: { en: 'Access Zobda anywhere with our responsive design that works perfectly on all devices.', ar: 'استخدم زوبدا من أي مكان عبر تصميم متجاوب يعمل بشكل مثالي على جميع الأجهزة.' },
    team_title: { en: 'Our Team', ar: 'فريقنا' },
    team_desc: { en: 'Zobda is built by a passionate team of developers, data scientists, and e-commerce experts who understand the importance of smart shopping. We combine technical expertise with consumer insights to create tools that truly make a difference in your shopping experience.', ar: 'تم بناء زوبدا بواسطة فريق شغوف من المطورين وعلماء البيانات وخبراء التجارة الإلكترونية الذين يفهمون أهمية التسوق الذكي. نجمع بين الخبرة التقنية وفهم المستهلكين لإنشاء أدوات تحدث فرقًا حقيقيًا في تجربة التسوق لديك.' },
    contact_title: { en: 'Get in Touch', ar: 'تواصل معنا' },
    contact_desc: { en: "Have questions, suggestions, or feedback? We'd love to hear from you!", ar: 'لديك أسئلة أو اقتراحات أو ملاحظات؟ يسعدنا سماعك!' },
    contact_us: { en: 'Contact Us', ar: 'اتصل بنا' },
    help_center: { en: 'Help Center', ar: 'مركز المساعدة' }
  }
  return dict[key]?.[lang] ?? key
}

export const AboutPage: React.FC = () => {
  const lang = (localStorage.getItem('zobda_lang') as 'en' | 'ar') || 'en'
  return (
    <div className="container-responsive py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('about_title', lang)}</h1>
          <p className="text-xl text-zobda-gray">{t('about_subtitle', lang)}</p>
        </div>

        {/* Mission Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('mission_title', lang)}</h2>
          <p className="text-lg text-zobda-gray leading-relaxed mb-6">{t('mission_p1', lang)}</p>
          <p className="text-lg text-zobda-gray leading-relaxed">{t('mission_p2', lang)}</p>
        </div>

        {/* What We Do */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('what_title', lang)}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('price_tracking', lang)}</h3>
              <p className="text-zobda-gray">{t('price_tracking_desc', lang)}</p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('history', lang)}</h3>
              <p className="text-zobda-gray">{t('history_desc', lang)}</p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('discovery', lang)}</h3>
              <p className="text-zobda-gray">{t('discovery_desc', lang)}</p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('mobile', lang)}</h3>
              <p className="text-zobda-gray">{t('mobile_desc', lang)}</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('team_title', lang)}</h2>
          <p className="text-lg text-zobda-gray leading-relaxed mb-6">{t('team_desc', lang)}</p>
        </div>

        {/* Contact Section */}
        <div className="bg-zobda-lightGray rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contact_title', lang)}</h2>
          <p className="text-zobda-gray mb-6">{t('contact_desc', lang)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@zobda.com" className="btn-zobda">
              {t('contact_us', lang)}
            </a>
            <a href="/help" className="btn-outline">
              {t('help_center', lang)}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
