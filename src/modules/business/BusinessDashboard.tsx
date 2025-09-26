import React, { useState, useEffect } from 'react'
import { 
  getBiddingInfo, 
  placeBid, 
  getBidHistory, 
  getBusinessStats,
  pricingTiers,
  businessDashboard 
} from '../../services/sponsoredProducts'
import { 
  getActiveBiddingPeriod, 
  placeBid as apiPlaceBid, 
  getBidHistory as apiGetBidHistory,
  getBusinessStats as apiGetBusinessStats,
  createBusiness,
  BiddingPeriod,
  Bid,
  BusinessStats
} from '../../services/sponsoredApi'

export const BusinessDashboard: React.FC = () => {
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [isPlacingBid, setIsPlacingBid] = useState(false)
  const [bidMessage, setBidMessage] = useState('')
  const [currentBidding, setCurrentBidding] = useState<BiddingPeriod | null>(null)
  const [bidHistory, setBidHistory] = useState<Bid[]>([])
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Load active bidding period
      try {
        const bidding = await getActiveBiddingPeriod()
        setCurrentBidding(bidding)
      } catch (err) {
        console.log('No active bidding period found')
      }
      
      // Load bid history
      try {
        const history = await apiGetBidHistory()
        setBidHistory(history)
      } catch (err) {
        console.log('No bid history found')
      }
      
      // Load business stats if email is provided
      if (businessEmail) {
        try {
          const businessStats = await apiGetBusinessStats(businessEmail)
          setStats(businessStats)
        } catch (err) {
          console.log('No business stats found')
        }
      }
    } catch (err) {
      setError('Failed to load data')
      console.error('Error loading data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback to mock data if API fails
  const fallbackBidding = getBiddingInfo() as any
  const fallbackBidHistory = getBidHistory() as any[]
  const fallbackStats = getBusinessStats(businessEmail || 'demo@business.com') as any

  const handlePlaceBid = async () => {
    if (!businessName || !businessEmail || !bidAmount) {
      setBidMessage('Please fill in all fields')
      return
    }

    setIsPlacingBid(true)
    setBidMessage('')

    try {
      // First create or get business
      await createBusiness({
        name: businessName,
        email: businessEmail,
      })

      // Place bid via API
      const result = await apiPlaceBid(businessEmail, parseInt(bidAmount))
      setBidMessage(result.message)
      
      if (result.success) {
        setBidAmount('')
        // Reload data to show updated bid
        await loadData()
      }
    } catch (err) {
      // Fallback to mock data if API fails
      const result = placeBid(businessName, businessEmail, parseInt(bidAmount))
      setBidMessage(result.message)
      
      if (result.success) {
        setBidAmount('')
      }
    } finally {
      setIsPlacingBid(false)
    }
  }

  return (
    <div className="container-responsive py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Dashboard</h1>
          <p className="text-xl text-zobda-gray">
            Promote your products with sponsored placements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-zobda-orange mb-2">
              ${(stats?.totalSpent || fallbackStats.totalSpent || 0).toLocaleString()}
            </div>
            <div className="text-sm text-zobda-gray">Total Spent</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-zobda-blue mb-2">
              {stats?.activeCampaigns || fallbackStats.activeCampaigns || 0}
            </div>
            <div className="text-sm text-zobda-gray">Active Campaigns</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {(stats?.totalImpressions || fallbackStats.totalImpressions || 0).toLocaleString()}
            </div>
            <div className="text-sm text-zobda-gray">Total Impressions</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(stats?.averageROI || fallbackStats.averageROI || 0)}%
            </div>
            <div className="text-sm text-zobda-gray">Average ROI</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bidding Section */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Place Your Bid</h2>
            
            {(currentBidding || fallbackBidding) ? (
              <div className="mb-6">
                <div className="bg-zobda-lightGray rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {(currentBidding || fallbackBidding)?.name}
                  </h3>
                  <div className="text-sm text-zobda-gray">
                    <div>Current Highest Bid: <span className="font-bold text-zobda-orange">
                      ${(currentBidding || fallbackBidding)?.currentHighestBid || (currentBidding || fallbackBidding)?.current_highest_bid || 0}
                    </span></div>
                    <div>Current Winner: <span className="font-medium">
                      {(currentBidding || fallbackBidding)?.currentWinner || (currentBidding || fallbackBidding)?.current_winner || 'None'}
                    </span></div>
                    <div>Total Bids: {(currentBidding || fallbackBidding)?.totalBids || 0}</div>
                    <div>Ends: {new Date((currentBidding || fallbackBidding)?.endDate || (currentBidding || fallbackBidding)?.end_date || '').toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full border border-zobda-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange"
                      placeholder="Your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                    <input
                      type="email"
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      className="w-full border border-zobda-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange"
                      placeholder="your@business.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bid Amount ($)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full border border-zobda-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zobda-orange"
                      placeholder={`Min: $${(currentBidding || fallbackBidding)?.minBid || (currentBidding || fallbackBidding)?.min_bid || pricingTiers.highlightedDeals.minBid}`}
                      min={(currentBidding || fallbackBidding)?.minBid || (currentBidding || fallbackBidding)?.min_bid || pricingTiers.highlightedDeals.minBid}
                      max={(currentBidding || fallbackBidding)?.maxBid || (currentBidding || fallbackBidding)?.max_bid || pricingTiers.highlightedDeals.maxBid}
                    />
                    <div className="text-xs text-zobda-gray mt-1">
                      Range: ${(currentBidding || fallbackBidding)?.minBid || (currentBidding || fallbackBidding)?.min_bid || pricingTiers.highlightedDeals.minBid} - ${(currentBidding || fallbackBidding)?.maxBid || (currentBidding || fallbackBidding)?.max_bid || pricingTiers.highlightedDeals.maxBid}
                    </div>
                  </div>

                  {bidMessage && (
                    <div className={`p-3 rounded-lg text-sm ${
                      bidMessage.includes('successfully') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {bidMessage}
                    </div>
                  )}

                  <button
                    onClick={handlePlaceBid}
                    disabled={isPlacingBid}
                    className="w-full btn-zobda py-3 disabled:opacity-50"
                  >
                    {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Bidding</h3>
                <p className="text-zobda-gray">Check back later for new bidding opportunities</p>
              </div>
            )}
          </div>

          {/* Pricing Tiers */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing Tiers</h2>
            
            <div className="space-y-4">
              <div className="border border-zobda-border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Highlighted Deals</h3>
                  <span className="text-sm bg-zobda-orange text-white px-2 py-1 rounded">Most Popular</span>
                </div>
                <div className="text-sm text-zobda-gray space-y-1">
                  <div>Price: ${pricingTiers.highlightedDeals.minBid} - ${pricingTiers.highlightedDeals.maxBid}</div>
                  <div>Impressions: {pricingTiers.highlightedDeals.impressions}</div>
                  <div>Clicks: {pricingTiers.highlightedDeals.clicks}</div>
                  <div>CTR: {pricingTiers.highlightedDeals.ctr}</div>
                </div>
              </div>

              <div className="border border-zobda-border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Trending</h3>
                <div className="text-sm text-zobda-gray space-y-1">
                  <div>Price: ${pricingTiers.popularProducts.minBid} - ${pricingTiers.popularProducts.maxBid}</div>
                  <div>Impressions: {pricingTiers.popularProducts.impressions}</div>
                  <div>Clicks: {pricingTiers.popularProducts.clicks}</div>
                  <div>CTR: {pricingTiers.popularProducts.ctr}</div>
                </div>
              </div>

              <div className="border border-zobda-border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Best Deals</h3>
                <div className="text-sm text-zobda-gray space-y-1">
                  <div>Price: ${pricingTiers.priceDrops.minBid} - ${pricingTiers.priceDrops.maxBid}</div>
                  <div>Impressions: {pricingTiers.priceDrops.impressions}</div>
                  <div>Clicks: {pricingTiers.priceDrops.clicks}</div>
                  <div>CTR: {pricingTiers.priceDrops.ctr}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bid History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bids</h2>
          <div className="card p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zobda-border">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Business</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Bid Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(bidHistory.length > 0 ? bidHistory : fallbackBidHistory).map((bid: any) => (
                    <tr key={bid.id} className="border-b border-zobda-border">
                      <td className="py-3 px-4 text-gray-900">{bid.business_name || bid.businessName}</td>
                      <td className="py-3 px-4 font-semibold text-zobda-orange">${bid.bid_amount || bid.bidAmount}</td>
                      <td className="py-3 px-4 text-zobda-gray">
                        {new Date(bid.created_at || bid.bidDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          bid.status === 'winning' 
                            ? 'bg-green-100 text-green-800'
                            : bid.status === 'outbid'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
