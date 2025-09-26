// Sponsored Products System with Bidding

export interface SponsoredProduct {
  id: string
  productId: string
  businessName: string
  businessEmail: string
  bidAmount: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'pending' | 'cancelled'
  createdAt: string
  updatedAt: string
  impressions: number
  clicks: number
  conversions: number
  revenue: number
}

export interface BiddingPeriod {
  id: string
  name: string
  startDate: string
  endDate: string
  currentHighestBid: number
  currentWinner: string | null
  totalBids: number
  status: 'active' | 'upcoming' | 'completed'
}

export interface BidHistory {
  id: string
  sponsoredProductId: string
  businessName: string
  bidAmount: number
  bidDate: string
  status: 'winning' | 'outbid' | 'withdrawn'
}

// Current bidding periods
export const currentBiddingPeriods: BiddingPeriod[] = [
  {
    id: 'current-month',
    name: 'January 2024 - Highlighted Deals',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    currentHighestBid: 150,
    currentWinner: 'TechGadgets Pro',
    totalBids: 12,
    status: 'active'
  },
  {
    id: 'next-month',
    name: 'February 2024 - Highlighted Deals',
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    currentHighestBid: 0,
    currentWinner: null,
    totalBids: 0,
    status: 'upcoming'
  }
]

// Sample sponsored products
export const sponsoredProducts: SponsoredProduct[] = [
  {
    id: 'sponsored-1',
    productId: 'deal-1',
    businessName: 'TechGadgets Pro',
    businessEmail: 'marketing@techgadgetspro.com',
    bidAmount: 150,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'active',
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    impressions: 15420,
    clicks: 892,
    conversions: 45,
    revenue: 2250
  },
  {
    id: 'sponsored-2',
    productId: 'deal-2',
    businessName: 'ElectroDeals Inc',
    businessEmail: 'ads@electrodeals.com',
    bidAmount: 120,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'active',
    createdAt: '2023-12-20T09:15:00Z',
    updatedAt: '2024-01-10T11:45:00Z',
    impressions: 12350,
    clicks: 678,
    conversions: 32,
    revenue: 1680
  }
]

// Sample bid history
export const bidHistory: BidHistory[] = [
  {
    id: 'bid-1',
    sponsoredProductId: 'sponsored-1',
    businessName: 'TechGadgets Pro',
    bidAmount: 150,
    bidDate: '2024-01-15T14:30:00Z',
    status: 'winning'
  },
  {
    id: 'bid-2',
    sponsoredProductId: 'sponsored-1',
    businessName: 'ElectroDeals Inc',
    bidAmount: 140,
    bidDate: '2024-01-14T16:20:00Z',
    status: 'outbid'
  },
  {
    id: 'bid-3',
    sponsoredProductId: 'sponsored-1',
    businessName: 'SmartBuy Solutions',
    bidAmount: 130,
    bidDate: '2024-01-13T11:10:00Z',
    status: 'outbid'
  }
]

// Sponsored product pricing tiers
export const pricingTiers = {
  highlightedDeals: {
    minBid: 50,
    maxBid: 500,
    currentHighest: 150,
    averageBid: 120,
    impressions: '10,000+',
    clicks: '500+',
    ctr: '5%+'
  },
  popularProducts: {
    minBid: 30,
    maxBid: 300,
    currentHighest: 95,
    averageBid: 75,
    impressions: '7,500+',
    clicks: '350+',
    ctr: '4.5%+'
  },
  priceDrops: {
    minBid: 20,
    maxBid: 200,
    currentHighest: 65,
    averageBid: 45,
    impressions: '5,000+',
    clicks: '250+',
    ctr: '4%+'
  }
}

// Business dashboard data
export const businessDashboard = {
  totalSpent: 1250,
  activeCampaigns: 2,
  totalImpressions: 27770,
  totalClicks: 1570,
  totalConversions: 77,
  totalRevenue: 3930,
  averageROI: 214,
  topPerformingProduct: 'Sony WH-1000XM4 Headphones'
}

// Functions for sponsored product management
export function getCurrentSponsoredProduct(): SponsoredProduct | null {
  const active = sponsoredProducts.find(sp => sp.status === 'active')
  return active || null
}

export function getBiddingInfo(): BiddingPeriod | null {
  return currentBiddingPeriods.find(period => period.status === 'active') || null
}

export function canPlaceBid(bidAmount: number): { canBid: boolean; reason?: string } {
  const currentPeriod = getBiddingInfo()
  if (!currentPeriod) {
    return { canBid: false, reason: 'No active bidding period' }
  }
  
  if (bidAmount <= currentPeriod.currentHighestBid) {
    return { canBid: false, reason: `Bid must be higher than current highest bid of $${currentPeriod.currentHighestBid}` }
  }
  
  if (bidAmount < pricingTiers.highlightedDeals.minBid) {
    return { canBid: false, reason: `Minimum bid is $${pricingTiers.highlightedDeals.minBid}` }
  }
  
  if (bidAmount > pricingTiers.highlightedDeals.maxBid) {
    return { canBid: false, reason: `Maximum bid is $${pricingTiers.highlightedDeals.maxBid}` }
  }
  
  return { canBid: true }
}

export function placeBid(businessName: string, businessEmail: string, bidAmount: number): { success: boolean; message: string } {
  const validation = canPlaceBid(bidAmount)
  if (!validation.canBid) {
    return { success: false, message: validation.reason || 'Invalid bid' }
  }
  
  // In a real implementation, this would save to database
  const newBid: BidHistory = {
    id: `bid-${Date.now()}`,
    sponsoredProductId: 'sponsored-1',
    businessName,
    bidAmount,
    bidDate: new Date().toISOString(),
    status: 'winning'
  }
  
  // Update current highest bid
  const currentPeriod = getBiddingInfo()
  if (currentPeriod) {
    currentPeriod.currentHighestBid = bidAmount
    currentPeriod.currentWinner = businessName
    currentPeriod.totalBids += 1
  }
  
  return { 
    success: true, 
    message: `Bid of $${bidAmount} placed successfully! You are now the highest bidder.` 
  }
}

export function getBidHistory(): BidHistory[] {
  return bidHistory.sort((a, b) => new Date(b.bidDate).getTime() - new Date(a.bidDate).getTime())
}

export function getBusinessStats(businessEmail: string) {
  const businessSponsored = sponsoredProducts.filter(sp => sp.businessEmail === businessEmail)
  
  return {
    totalSpent: businessSponsored.reduce((sum, sp) => sum + sp.bidAmount, 0),
    activeCampaigns: businessSponsored.filter(sp => sp.status === 'active').length,
    totalImpressions: businessSponsored.reduce((sum, sp) => sum + sp.impressions, 0),
    totalClicks: businessSponsored.reduce((sum, sp) => sum + sp.clicks, 0),
    totalConversions: businessSponsored.reduce((sum, sp) => sum + sp.conversions, 0),
    totalRevenue: businessSponsored.reduce((sum, sp) => sum + sp.revenue, 0),
    averageROI: businessSponsored.length > 0 
      ? businessSponsored.reduce((sum, sp) => sum + (sp.revenue / sp.bidAmount), 0) / businessSponsored.length
      : 0
  }
}
