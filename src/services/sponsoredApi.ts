// API service for sponsored products and bidding

const API_BASE_URL = 'http://localhost:8000'

export interface Business {
  id: number
  name: string
  email: string
  phone?: string
  website?: string
  description?: string
}

export interface BiddingPeriod {
  id: number
  name: string
  placement_type: string
  start_date: string
  end_date: string
  min_bid: number
  max_bid: number
  current_highest_bid: number
  current_winner?: string
  status: string
  // Add camelCase aliases for compatibility
  placementType: string
  startDate: string
  endDate: string
  minBid: number
  maxBid: number
  currentHighestBid: number
  currentWinner?: string
  totalBids?: number
}

export interface Bid {
  id: number
  business_name: string
  business_email: string
  bid_amount: number
  status: string
  created_at: string
  // Add camelCase aliases for compatibility
  businessName: string
  businessEmail: string
  bidAmount: number
  createdAt: string
  bidDate?: string
}

export interface SponsoredProduct {
  id: number
  business_name: string
  business_email: string
  product_id: number
  bid_amount: number
  start_date: string
  end_date: string
  status: string
  impressions: number
  clicks: number
  conversions: number
  revenue: number
}

export interface BusinessStats {
  total_spent: number
  active_campaigns: number
  total_impressions: number
  total_clicks: number
  total_conversions: number
  total_revenue: number
  average_roi: number
  // Add camelCase aliases for compatibility
  totalSpent: number
  activeCampaigns: number
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  averageROI: number
}

// Business API
export async function createBusiness(business: {
  name: string
  email: string
  phone?: string
  website?: string
  description?: string
}): Promise<Business> {
  const response = await fetch(`${API_BASE_URL}/sponsored/business`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(business),
  })
  
  if (!response.ok) {
    throw new Error('Failed to create business')
  }
  
  return response.json()
}

export async function getBusinessStats(businessEmail: string): Promise<BusinessStats> {
  const response = await fetch(`${API_BASE_URL}/sponsored/business/${encodeURIComponent(businessEmail)}/stats`)
  
  if (!response.ok) {
    throw new Error('Failed to get business stats')
  }
  
  const data = await response.json()
  
  // Add camelCase aliases
  return {
    ...data,
    totalSpent: data.total_spent,
    activeCampaigns: data.active_campaigns,
    totalImpressions: data.total_impressions,
    totalClicks: data.total_clicks,
    totalConversions: data.total_conversions,
    totalRevenue: data.total_revenue,
    averageROI: data.average_roi,
  }
}

// Bidding Period API
export async function getBiddingPeriods(status?: string): Promise<BiddingPeriod[]> {
  const url = status 
    ? `${API_BASE_URL}/sponsored/bidding-periods?status=${status}`
    : `${API_BASE_URL}/sponsored/bidding-periods`
    
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to get bidding periods')
  }
  
  return response.json()
}

export async function getActiveBiddingPeriod(placementType: string = 'highlighted_deals'): Promise<BiddingPeriod> {
  const response = await fetch(`${API_BASE_URL}/sponsored/bidding-periods/active?placement_type=${placementType}`)
  
  if (!response.ok) {
    throw new Error('Failed to get active bidding period')
  }
  
  const data = await response.json()
  
  // Add camelCase aliases
  return {
    ...data,
    placementType: data.placement_type,
    startDate: data.start_date,
    endDate: data.end_date,
    minBid: data.min_bid,
    maxBid: data.max_bid,
    currentHighestBid: data.current_highest_bid,
    currentWinner: data.current_winner,
    totalBids: 0, // Will be populated from bid history
  }
}

// Bidding API
export async function placeBid(businessEmail: string, bidAmount: number): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/sponsored/bids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      business_email: businessEmail,
      bid_amount: bidAmount,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to place bid')
  }
  
  return response.json()
}

export async function getBidHistory(biddingPeriodId?: number): Promise<Bid[]> {
  const url = biddingPeriodId
    ? `${API_BASE_URL}/sponsored/bids/history?bidding_period_id=${biddingPeriodId}`
    : `${API_BASE_URL}/sponsored/bids/history`
    
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error('Failed to get bid history')
  }
  
  const data = await response.json()
  
  // Add camelCase aliases
  return data.map((bid: any) => ({
    ...bid,
    businessName: bid.business_name,
    businessEmail: bid.business_email,
    bidAmount: bid.bid_amount,
    createdAt: bid.created_at,
    bidDate: bid.created_at, // For compatibility
  }))
}

// Sponsored Product API
export async function getCurrentSponsoredProduct(placementType: string = 'highlighted_deals'): Promise<SponsoredProduct | null> {
  const response = await fetch(`${API_BASE_URL}/sponsored/products/current?placement_type=${placementType}`)
  
  if (response.status === 404) {
    return null
  }
  
  if (!response.ok) {
    throw new Error('Failed to get current sponsored product')
  }
  
  return response.json()
}

export async function recordSponsoredClick(sponsoredProductId: number, userId?: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sponsored/products/${sponsoredProductId}/click`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to record sponsored click')
  }
}

export async function recordSponsoredImpression(sponsoredProductId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/sponsored/products/${sponsoredProductId}/impression`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to record sponsored impression')
  }
}

// Admin API
export async function createSampleData(): Promise<{ message: string; businesses_created: number; bidding_periods_created: number; bids_placed: number }> {
  const response = await fetch(`${API_BASE_URL}/sponsored/admin/create-sample-data`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to create sample data')
  }
  
  return response.json()
}
