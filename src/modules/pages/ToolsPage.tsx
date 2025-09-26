import React from 'react'
import { Link } from 'react-router-dom'

const tools = [
  {
    title: "Price Tracker",
    description: "Monitor Amazon product prices in real-time and get instant alerts when prices drop.",
    icon: "📊",
    features: ["Real-time monitoring", "Custom price alerts", "Historical data", "Mobile notifications"],
    link: "/watchlist"
  },
  {
    title: "Deal Finder",
    description: "Discover the best deals and discounts happening right now on Amazon.",
    icon: "💰",
    features: ["Daily deals", "Price drop alerts", "Savings calculator", "Deal expiration tracking"],
    link: "/drops"
  },
  {
    title: "Price History Charts",
    description: "View comprehensive price history with interactive charts and trend analysis.",
    icon: "📈",
    features: ["Interactive charts", "Trend analysis", "Price predictions", "Export data"],
    link: "/popular"
  },
  {
    title: "Product Comparison",
    description: "Compare prices across different sellers and product variations.",
    icon: "⚖️",
    features: ["Multi-seller comparison", "Variant tracking", "Best deal finder", "Price alerts"],
    link: "/popular"
  },
  {
    title: "Wishlist Manager",
    description: "Organize and track your favorite products with our advanced wishlist features.",
    icon: "❤️",
    features: ["Unlimited products", "Category organization", "Price tracking", "Share lists"],
    link: "/watchlist"
  },
  {
    title: "Price Alert Generator",
    description: "Create custom price alerts for any Amazon product with flexible conditions.",
    icon: "🔔",
    features: ["Custom thresholds", "Multiple alert types", "Email/SMS notifications", "Alert management"],
    link: "/watchlist"
  }
]

const browserExtensions = [
  {
    name: "Chrome Extension",
    description: "Add products to Zobda directly from Amazon product pages",
    icon: "🌐",
    downloadUrl: "#",
    features: ["One-click tracking", "Price overlay", "Quick alerts", "Seamless integration"]
  },
  {
    name: "Firefox Add-on",
    description: "Track prices while browsing Amazon with our Firefox extension",
    icon: "🦊",
    downloadUrl: "#",
    features: ["Cross-platform sync", "Price notifications", "Easy setup", "Privacy focused"]
  },
  {
    name: "Safari Extension",
    description: "Native Safari support for Mac and iOS users",
    icon: "🧭",
    downloadUrl: "#",
    features: ["Native integration", "iOS compatibility", "iCloud sync", "Touch optimized"]
  }
]

export const ToolsPage: React.FC = () => {
  return (
    <div className="container-responsive py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Zobda Tools</h1>
          <p className="text-xl text-zobda-gray max-w-3xl mx-auto">
            Discover our comprehensive suite of tools designed to help you save money 
            and make smarter purchasing decisions on Amazon.
          </p>
        </div>

        {/* Main Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Core Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <div key={index} className="card p-6 hover:shadow-zobdaHover transition-shadow">
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {tool.title}
                </h3>
                <p className="text-zobda-gray mb-4">
                  {tool.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-zobda-gray">
                      <svg className="w-4 h-4 text-zobda-orange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to={tool.link} className="btn-zobda w-full text-center">
                  Try Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Extensions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browser Extensions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {browserExtensions.map((extension, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-zobdaHover transition-shadow">
                <div className="text-5xl mb-4">{extension.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {extension.name}
                </h3>
                <p className="text-zobda-gray mb-6">
                  {extension.description}
                </p>
                <ul className="space-y-2 mb-6 text-left">
                  {extension.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-zobda-gray">
                      <svg className="w-4 h-4 text-zobda-orange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={extension.downloadUrl} className="btn-outline w-full">
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* API Tools */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Developer Tools</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-16 h-16 bg-zobda-orange rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">REST API</h3>
              <p className="text-zobda-gray mb-6">
                Integrate Zobda's price tracking capabilities into your own applications with our comprehensive REST API.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Real-time price data
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Historical price data
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Webhook notifications
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Rate limiting & authentication
                </li>
              </ul>
              <button className="btn-zobda w-full">
                View API Documentation
              </button>
            </div>

            <div className="card p-8">
              <div className="w-16 h-16 bg-zobda-orange rounded-lg flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Webhooks</h3>
              <p className="text-zobda-gray mb-6">
                Get real-time notifications when prices change or new deals are discovered with our webhook system.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Instant price change alerts
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Deal discovery notifications
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom event triggers
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Secure delivery & retry logic
                </li>
              </ul>
              <button className="btn-outline w-full">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-zobda-lightGray rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-zobda-gray mb-6">
            Choose the tools that work best for you and start saving money today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-zobda px-8 py-3">
              Create Free Account
            </Link>
            <Link to="/features" className="btn-outline px-8 py-3">
              View All Features
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
