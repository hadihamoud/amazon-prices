import React from 'react'
import { Link } from 'react-router-dom'

const blogPosts = [
  {
    id: 1,
    title: "10 Tips for Smart Amazon Shopping in 2024",
    excerpt: "Learn the best strategies to save money and find great deals on Amazon with our expert shopping tips.",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Shopping Tips",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Understanding Amazon Price Patterns",
    excerpt: "Discover how Amazon prices fluctuate and when is the best time to buy your favorite products.",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Price Analysis",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Black Friday vs. Prime Day: Which Offers Better Deals?",
    excerpt: "A comprehensive comparison of Amazon's biggest shopping events to help you plan your purchases.",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Deals Analysis",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "How to Set Up Effective Price Alerts",
    excerpt: "Master the art of price tracking with our guide to setting up alerts that actually work.",
    date: "2023-12-28",
    readTime: "4 min read",
    category: "Tutorials",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "The Psychology of Online Shopping",
    excerpt: "Understanding consumer behavior and how it affects your purchasing decisions on Amazon.",
    date: "2023-12-20",
    readTime: "8 min read",
    category: "Consumer Insights",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    title: "Amazon's Return Policy: What You Need to Know",
    excerpt: "Everything you need to know about Amazon's return policy and how to make the most of it.",
    date: "2023-12-15",
    readTime: "5 min read",
    category: "Policy Guide",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=250&fit=crop"
  }
]

export const BlogPage: React.FC = () => {
  return (
    <div className="container-responsive py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Zobda Blog</h1>
          <p className="text-xl text-zobda-gray">
            Tips, insights, and strategies for smart Amazon shopping
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <div className="card p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-zobda-orange text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Featured
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h2>
                <p className="text-lg text-zobda-gray mb-6">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-zobda-gray mb-6">
                  <span>{blogPosts[0].date}</span>
                  <span>•</span>
                  <span>{blogPosts[0].readTime}</span>
                  <span>•</span>
                  <span className="text-zobda-orange">{blogPosts[0].category}</span>
                </div>
                <button className="btn-zobda">
                  Read Full Article
                </button>
              </div>
              <div>
                <img 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Categories</h3>
          <div className="flex flex-wrap gap-3">
            {['All', 'Shopping Tips', 'Price Analysis', 'Deals Analysis', 'Tutorials', 'Consumer Insights', 'Policy Guide'].map((category) => (
              <button 
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === 'All' 
                    ? 'bg-zobda-orange text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-zobda-orange hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="card p-6 hover:shadow-zobdaHover transition-shadow">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="mb-3">
                <span className="inline-block bg-gray-100 text-zobda-orange px-2 py-1 rounded text-xs font-medium">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-zobda-gray mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-sm text-zobda-gray">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-zobda-lightGray rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
          <p className="text-zobda-gray mb-6">
            Get the latest shopping tips and deal alerts delivered to your inbox
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-zobda-border rounded-lg focus:outline-none focus:ring-2 focus:ring-zobda-orange"
            />
            <button className="btn-zobda px-6 py-3">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
