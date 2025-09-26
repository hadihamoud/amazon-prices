import React, { useState } from 'react'

const faqs = [
  {
    question: "How do I start tracking a product?",
    answer: "To start tracking a product, simply paste the Amazon product URL or ASIN into our search bar, then click 'Add to Watchlist'. You can also use our browser extension for one-click tracking directly from Amazon product pages."
  },
  {
    question: "How accurate are the price alerts?",
    answer: "Our price alerts are updated in real-time and are highly accurate. We monitor prices continuously and send notifications within minutes of price changes. However, prices can change rapidly, so we recommend checking the current price before making a purchase."
  },
  {
    question: "Can I track products from different Amazon regions?",
    answer: "Currently, we focus on Amazon.sa (Saudi Arabia). We're working on expanding support for other Amazon regions. Stay tuned for updates on our roadmap."
  },
  {
    question: "How do I set up price alerts?",
    answer: "After adding a product to your watchlist, click on the product and set your desired price threshold. You can choose to be notified when the price drops to a specific amount or by a certain percentage. Alerts can be sent via email, SMS, or push notifications."
  },
  {
    question: "Is there a mobile app?",
    answer: "Our website is fully responsive and works great on mobile devices. We're also developing native mobile apps for iOS and Android, which will be available soon."
  },
  {
    question: "How much does Zobda cost?",
    answer: "Zobda offers a free plan that allows you to track up to 5 products with basic alerts. Our Pro plan ($9.99/month) includes unlimited product tracking, advanced alerts, price predictions, and data export features."
  },
  {
    question: "Can I export my price data?",
    answer: "Yes! Pro users can export their price tracking data in CSV format. This includes historical prices, alert settings, and product information. You can export data for individual products or your entire watchlist."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time from your account settings. Go to 'Account' > 'Subscription' and click 'Cancel Subscription'. Your access will continue until the end of your current billing period."
  },
  {
    question: "What if I can't find a product?",
    answer: "If you can't find a product using our search, make sure you're using the correct Amazon product URL or ASIN. You can also try searching by product name. If you're still having trouble, contact our support team for assistance."
  },
  {
    question: "How do I contact support?",
    answer: "You can contact our support team by emailing support@zobda.com or using the contact form on our website. We typically respond within 24 hours. Pro users get priority support with faster response times."
  }
]

const categories = [
  {
    title: "Getting Started",
    icon: "🚀",
    articles: [
      "How to create an account",
      "Adding your first product",
      "Setting up price alerts",
      "Understanding the dashboard"
    ]
  },
  {
    title: "Account & Billing",
    icon: "💳",
    articles: [
      "Managing your subscription",
      "Upgrading to Pro",
      "Payment methods",
      "Billing history"
    ]
  },
  {
    title: "Price Tracking",
    icon: "📊",
    articles: [
      "How price tracking works",
      "Setting price thresholds",
      "Understanding price history",
      "Deal notifications"
    ]
  },
  {
    title: "Troubleshooting",
    icon: "🔧",
    articles: [
      "Common issues",
      "Browser compatibility",
      "Mobile app problems",
      "Account access issues"
    ]
  }
]

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container-responsive py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-zobda-gray">
            Find answers to your questions and get the most out of Zobda
          </p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 pr-12 border border-zobda-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zobda-orange focus:border-transparent"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zobda-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="card p-6 hover:shadow-zobdaHover transition-shadow cursor-pointer">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex} className="text-sm text-zobda-gray hover:text-zobda-orange cursor-pointer">
                      {article}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add a Product</h3>
              <p className="text-sm text-zobda-gray mb-4">Start tracking your first product</p>
              <button className="btn-zobda text-sm">Get Started</button>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Up Alerts</h3>
              <p className="text-sm text-zobda-gray mb-4">Configure price notifications</p>
              <button className="btn-zobda text-sm">Learn How</button>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-zobda-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-zobda-gray mb-4">Get help from our team</p>
              <button className="btn-zobda text-sm">Contact Us</button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
            {searchQuery && <span className="text-lg font-normal text-zobda-gray ml-2">({filteredFaqs.length} results)</span>}
          </h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-zobda-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-zobda-gray">Try searching with different keywords or browse our categories above.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="bg-zobda-lightGray rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-zobda-gray mb-6">
            Can't find what you're looking for? Our support team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@zobda.com" className="btn-zobda px-8 py-3">
              Email Support
            </a>
            <button className="btn-outline px-8 py-3">
              Live Chat
            </button>
          </div>
          <div className="mt-6 text-sm text-zobda-gray">
            <p>Average response time: 2-4 hours</p>
            <p>Pro users get priority support with faster response times</p>
          </div>
        </div>
      </div>
    </div>
  )
}
