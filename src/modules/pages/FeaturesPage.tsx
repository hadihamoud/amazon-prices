import React from 'react'

const features = [
  {
    title: "Real-Time Price Tracking",
    description: "Monitor Amazon product prices in real-time with instant updates and notifications.",
    icon: "📊",
    details: [
      "Live price monitoring",
      "Instant price change alerts",
      "Multiple product tracking",
      "Custom price thresholds"
    ]
  },
  {
    title: "Historical Price Charts",
    description: "View comprehensive price history with interactive charts and trend analysis.",
    icon: "📈",
    details: [
      "Interactive price charts",
      "Price trend analysis",
      "Historical data export",
      "Price comparison tools"
    ]
  },
  {
    title: "Smart Price Alerts",
    description: "Get notified when prices drop to your desired level with customizable alerts.",
    icon: "🔔",
    details: [
      "Email notifications",
      "Push notifications",
      "SMS alerts",
      "Custom alert conditions"
    ]
  },
  {
    title: "Deal Discovery",
    description: "Discover the best deals and price drops happening right now on Amazon.",
    icon: "💰",
    details: [
      "Daily deal highlights",
      "Price drop rankings",
      "Deal expiration tracking",
      "Savings calculations"
    ]
  },
  {
    title: "Product Comparison",
    description: "Compare prices across different sellers and product variations.",
    icon: "⚖️",
    details: [
      "Multi-seller comparison",
      "Product variant tracking",
      "Price history comparison",
      "Best deal recommendations"
    ]
  },
  {
    title: "Mobile App",
    description: "Access all features on the go with our responsive mobile-friendly design.",
    icon: "📱",
    details: [
      "Responsive design",
      "Mobile notifications",
      "Offline price tracking",
      "Quick add to watchlist"
    ]
  },
  {
    title: "Price Predictions",
    description: "Get AI-powered price predictions to help you decide when to buy.",
    icon: "🤖",
    details: [
      "Machine learning algorithms",
      "Price trend predictions",
      "Buy recommendation engine",
      "Seasonal price patterns"
    ]
  },
  {
    title: "Export & Reports",
    description: "Export your price data and generate detailed reports for analysis.",
    icon: "📋",
    details: [
      "CSV data export",
      "PDF reports",
      "Price analysis charts",
      "Custom date ranges"
    ]
  }
]

export const FeaturesPage: React.FC = () => {
  return (
    <div className="container-responsive py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Zobda Features</h1>
          <p className="text-xl text-zobda-gray max-w-3xl mx-auto">
            Discover all the powerful tools and features that make Zobda the ultimate 
            Amazon price tracking platform for smart shoppers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 hover:shadow-zobdaHover transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-zobda-gray mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-center text-sm text-zobda-gray">
                    <svg className="w-4 h-4 text-zobda-orange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-zobda-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Add Products</h3>
              <p className="text-zobda-gray">
                Paste Amazon product URLs or ASINs to start tracking prices instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zobda-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Set Alerts</h3>
              <p className="text-zobda-gray">
                Configure price alerts and notifications to never miss a great deal.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-zobda-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Money</h3>
              <p className="text-zobda-gray">
                Get notified when prices drop and make informed purchasing decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="text-4xl font-bold text-zobda-orange mb-6">$0<span className="text-lg text-zobda-gray">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Track up to 5 products
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic price alerts
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Price history charts
                </li>
              </ul>
              <button className="btn-outline w-full">Get Started</button>
            </div>

            <div className="card p-8 text-center border-2 border-zobda-orange relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-zobda-orange text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="text-4xl font-bold text-zobda-orange mb-6">$9.99<span className="text-lg text-zobda-gray">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Track unlimited products
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced price alerts
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Price predictions
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Export data
                </li>
              </ul>
              <button className="btn-zobda w-full">Upgrade to Pro</button>
            </div>

            <div className="card p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
              <div className="text-4xl font-bold text-zobda-orange mb-6">Custom<span className="text-lg text-zobda-gray">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-sm text-zobda-gray">
                  <svg className="w-4 h-4 text-zobda-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <button className="btn-outline w-full">Contact Sales</button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-zobda-lightGray rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Saving?</h2>
          <p className="text-zobda-gray mb-6">
            Join thousands of smart shoppers who are already saving money with Zobda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-zobda px-8 py-3">
              Get Started Free
            </button>
            <button className="btn-outline px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
