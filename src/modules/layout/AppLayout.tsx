import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { searchAmazonSa } from '../services/amazonSaApi'
import { SecretAdminAccess } from '../admin/SecretAdminAccess'
import { AuthModal, useAuth } from '../auth/AuthModal'

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [lang, setLang] = React.useState<'en' | 'ar'>(() => (localStorage.getItem('zobda_lang') as 'en' | 'ar') || 'ar')
  const [searchInput, setSearchInput] = React.useState('')
  const [showAuthModal, setShowAuthModal] = React.useState(false)
  const [authMode, setAuthMode] = React.useState<'signup' | 'login'>('signup')
  const { user, isAuthenticated, login, logout } = useAuth()

  React.useEffect(() => {
    localStorage.setItem('zobda_lang', lang)
    // Toggle RTL class on root container
    const root = document.body
    if (lang === 'ar') root.classList.add('rtl')
    else root.classList.remove('rtl')
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput)}`)
    }
  }

  const handleAuthSuccess = (userData: any) => {
    login(userData)
    setShowAuthModal(false)
  }

  const handleShowSignup = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleShowLogin = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const handleLogout = () => {
    logout()
  }
  return (
    <div className="min-h-screen flex flex-col bg-white rtl">
      <header className="border-b border-zobda-border bg-white sticky top-0 z-30">
        <div className="container-responsive py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-zobda-orange rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-zobda-orange">Zobda</span>
                  <span className="text-xs text-zobda-gray">{lang === 'ar' ? 'متعقب أسعار أمازون' : 'Amazon price tracker'}</span>
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input 
                  className="w-full border border-zobda-border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent" 
                  placeholder={lang === 'ar' ? 'ابحث عن منتجات أمازون' : 'Find Amazon Products'}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zobda-gray hover:text-zobda-orange"
                  onClick={handleSearch}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link to="/watchlist" className={`text-sm font-medium ${location.pathname === '/watchlist' ? 'text-zobda-orange' : 'text-zobda-gray hover:text-zobda-blue'}`}>
                {lang === 'ar' ? 'قائمتي' : 'My Watchlist'}
              </Link>
              <Link to="/popular" className={`text-sm font-medium ${location.pathname === '/popular' ? 'text-zobda-orange' : 'text-zobda-gray hover:text-zobda-blue'}`}>
                {lang === 'ar' ? 'الأكثر رواجاً' : 'Trending'}
              </Link>
            <Link to="/drops" className={`text-sm font-medium ${location.pathname === '/drops' ? 'text-zobda-orange' : 'text-zobda-gray hover:text-zobda-blue'}`}>
              {lang === 'ar' ? 'أفضل العروض' : 'Best Deals'}
            </Link>
            {/* Temporarily hidden - will implement later */}
            {/* <Link to="/business" className={`text-sm font-medium ${location.pathname === '/business' ? 'text-zobda-orange' : 'text-zobda-gray hover:text-zobda-blue'}`}>
              {lang === 'ar' ? 'للشركات' : 'For Business'}
            </Link> */}
            <div className="flex items-center gap-2">
                <select aria-label="Language" className="border border-zobda-border rounded px-2 py-1 text-sm"
                  value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'ar')}>
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
                
                {/* Authentication Section */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zobda-gray">
                      {lang === 'ar' ? 'مرحباً' : 'Hi'} {user?.mobileNumber}
                    </span>
                    <button 
                      onClick={handleLogout}
                      className="btn-outline text-sm"
                    >
                      {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleShowLogin}
                      className="btn-outline text-sm"
                    >
                      {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                    </button>
                    <button 
                      onClick={handleShowSignup}
                      className="btn-zobda text-sm"
                    >
                      {lang === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-white">
        <Outlet />
      </main>
      
      {/* Secret Admin Access - Hidden from regular users */}
      <SecretAdminAccess />
      
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMode}
      />
      <footer className="border-t border-zobda-border py-8 text-sm text-zobda-gray bg-white">
        <div className="container-responsive flex flex-col items-center gap-3 text-center">
          <nav className="flex flex-wrap justify-center gap-6">
            <Link to="/about" className="hover:text-zobda-blue">{lang === 'ar' ? 'حول' : 'About'}</Link>
            <Link to="/blog" className="hover:text-zobda-blue">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
            <Link to="/features" className="hover:text-zobda-blue">{lang === 'ar' ? 'المزايا' : 'Features'}</Link>
            <Link to="/terms" className="hover:text-zobda-blue">{lang === 'ar' ? 'الشروط' : 'Terms'}</Link>
            <Link to="/privacy" className="hover:text-zobda-blue">{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</Link>
            <Link to="/tools" className="hover:text-zobda-blue">{lang === 'ar' ? 'الأدوات' : 'Tools'}</Link>
            <Link to="/help" className="hover:text-zobda-blue">{lang === 'ar' ? 'المساعدة' : 'Help'}</Link>
          </nav>
          <p className="max-w-3xl leading-relaxed">
            {lang === 'ar'
              ? 'أسعار وتوفر المنتجات دقيقة وقت النشر وقابلة للتغيير. قد تنطبق الأسعار وقت الشراء على المنتج. كمشارك في برنامج أمازون أفلييت قد نحصل على عمولة من عمليات الشراء عبر روابطنا.'
              : 'Product prices and availability are accurate as of the date/time indicated and are subject to change. Prices at the time of purchase will apply. As an Amazon Associate we may earn from qualifying purchases.'}
          </p>
          <p>
            © 2024 Zobda
          </p>
        </div>
      </footer>
    </div>
  )
}


