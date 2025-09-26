import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CuratedTrackingService } from '../../services/curatedTrackingService'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export type PricePoint = { date: string | number | Date; price: number }

type SmartPriceHistoryChartProps = {
  data: PricePoint[]
  currentPrice: number
  originalPrice?: number
  productId: string
  hasHistoricalData: boolean
  onRequestData?: () => void
  isDataLoading?: boolean
}

export const SmartPriceHistoryChart: React.FC<SmartPriceHistoryChartProps> = ({ 
  data, 
  currentPrice, 
  originalPrice,
  productId,
  hasHistoricalData,
  onRequestData,
  isDataLoading = false
}) => {
  const [showPredictions, setShowPredictions] = useState(false)
  const [isRequestingData, setIsRequestingData] = useState(false)
  const [isCuratedTracked, setIsCuratedTracked] = useState(false)
  const [curatedData, setCuratedData] = useState<PricePoint[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('90d')

  useEffect(() => {
    // Check if product is curated tracked
    const isTracked = CuratedTrackingService.isProductTracked(productId)
    setIsCuratedTracked(isTracked)
    
    if (isTracked) {
      const historicalData = CuratedTrackingService.getHistoricalData(productId)
      setCuratedData(historicalData)
    }
  }, [productId])

  // Generate flat line data if no historical data
  const generateFlatLineData = (price: number, days: number = 30): PricePoint[] => {
    const flatData: PricePoint[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      flatData.push({ date, price })
    }
    return flatData
  }

  // Filter data based on selected period
  const filterDataByPeriod = (data: PricePoint[], period: string): PricePoint[] => {
    if (period === 'all') return data
    
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (period) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case '30d':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case '90d':
        cutoffDate.setDate(now.getDate() - 90)
        break
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return data
    }
    
    return data.filter(point => {
      const pointDate = new Date(point.date)
      return pointDate >= cutoffDate
    })
  }

  // Get period display name
  const getPeriodDisplayName = (period: string): string => {
    switch (period) {
      case '7d': return '7 Days'
      case '30d': return '30 Days'
      case '90d': return '90 Days'
      case '1y': return '1 Year'
      case 'all': return 'All Time'
      default: return '90 Days'
    }
  }

  // Use the same data source as the price statistics (always use the provided data)
  const baseData = hasHistoricalData ? data : generateFlatLineData(currentPrice, 30)
  const effectiveData = filterDataByPeriod(baseData, selectedPeriod)
  
  // Create price data that includes actual product prices (same as ProductDetailPage)
  const allPrices = [
    currentPrice,
    ...(originalPrice ? [originalPrice] : []),
    ...baseData.map(p => p.price)
  ]

  // Visible (filtered) range drives the chart axes so header and graph match
  const chartMinPrice = Math.min(...effectiveData.map(p => p.price))
  const chartMaxPrice = Math.max(...effectiveData.map(p => p.price))
  const priceRange = chartMaxPrice - chartMinPrice
  const yAxisMin = chartMinPrice - (priceRange * 0.1)
  const yAxisMax = chartMaxPrice + (priceRange * 0.1)

  // Overall range (for footer context only)
  const fullMinPrice = Math.min(...allPrices)
  const fullMaxPrice = Math.max(...allPrices)

  const labels = effectiveData.map(p => {
    const date = new Date(p.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  const prices = effectiveData.map(p => p.price)

  const handleRequestData = async () => {
    if (onRequestData) {
      setIsRequestingData(true)
      try {
        await onRequestData()
      } finally {
        setIsRequestingData(false)
      }
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Price History & Predictions</h3>
        <div className="flex items-center gap-4">
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-zobda-gray">Period:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | '90d' | '1y' | 'all')}
              className="border border-zobda-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zobda-orange"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
              <option value="1y">1 Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          {(isCuratedTracked || hasHistoricalData) && (
            <button
              onClick={() => setShowPredictions(!showPredictions)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                showPredictions 
                  ? 'bg-zobda-orange text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showPredictions ? 'Hide Predictions' : 'Show Predictions'}
            </button>
          )}
          <div className="text-sm text-zobda-gray">
            <span className="text-green-600">Low: ${chartMinPrice.toFixed(2)}</span>
            <span className="mx-2">•</span>
            <span className="text-red-600">High: ${chartMaxPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Data Status Message */}
      {!isCuratedTracked && !hasHistoricalData && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">📊 Historical Data Not Available</h4>
              <p className="text-sm text-blue-800">
                We don't have historical price data for this product yet. 
                Click "Get Data" to start tracking price history.
              </p>
            </div>
            <button
              onClick={handleRequestData}
              disabled={isRequestingData || isDataLoading}
              className="btn-zobda px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequestingData || isDataLoading ? 'Getting Data...' : 'Get Data'}
            </button>
          </div>
        </div>
      )}

      {/* Curated Tracking Status */}
      {isCuratedTracked && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Curated Tracking Available</h4>
              <p className="text-sm text-green-800">
                This product is actively tracked by our team. Historical data is available and regularly updated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div style={{ height: '300px' }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: isCuratedTracked ? 'Curated Price History' : (hasHistoricalData ? 'Price History' : 'Price History'),
                data: prices,
                borderColor: isCuratedTracked ? '#10b981' : (hasHistoricalData ? '#ff6600' : '#3b82f6'),
                backgroundColor: isCuratedTracked ? 'rgba(16, 185, 129, 0.1)' : (hasHistoricalData ? 'rgba(255, 102, 0, 0.1)' : 'rgba(59, 130, 246, 0.1)'),
                pointRadius: prices.map((price, index) => index === prices.length - 1 ? 6 : 3), // Larger point for current price
                pointHoverRadius: prices.map((price, index) => index === prices.length - 1 ? 8 : 5),
                pointBackgroundColor: prices.map((price, index) => index === prices.length - 1 ? '#ef4444' : (isCuratedTracked ? '#10b981' : (hasHistoricalData ? '#ff6600' : '#3b82f6'))), // Red for current price
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: true,
                tension: 0.1,
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { 
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12
                  }
                }
              }, 
              tooltip: { 
                mode: 'index', 
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: hasHistoricalData ? '#ff6600' : '#94a3b8',
                borderWidth: 1,
                callbacks: {
                  label: (context) => {
                    const price = context.parsed.y
                    const isCurrentPrice = context.dataIndex === prices.length - 1
                    const label = isCurrentPrice ? 'Current Price' : (hasHistoricalData ? 'Price' : 'Estimated Price')
                    return `${label}: $${price.toFixed(2)}`
                  }
                }
              } 
            },
            scales: {
              x: { 
                grid: { display: false },
                ticks: {
                  color: '#666666',
                  font: { size: 12 }
                }
              },
              y: { 
                beginAtZero: false,
                min: yAxisMin,
                max: yAxisMax,
                grid: { color: '#f0f0f0' },
                ticks: { 
                  color: '#666666',
                  font: { size: 12 },
                  callback: (v) => `$${Number(v).toFixed(2)}` as unknown as string 
                } 
              },
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }}
        />
      </div>

      {/* Chart Footer */}
      <div className="mt-4 text-sm text-zobda-gray">
        {isCuratedTracked ? (
          <div className="space-y-1">
            <p>✅ Curated tracking available: Historical data actively maintained by our team</p>
            <p>📊 Showing {getPeriodDisplayName(selectedPeriod)} of price history ({effectiveData.length} data points)</p>
            <p>📈 Overall range: ${fullMinPrice.toFixed(2)} - ${fullMaxPrice.toFixed(2)} (from {baseData.length} total data points)</p>
            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
              <p><strong>Current Price:</strong> ${currentPrice.toFixed(2)} {originalPrice && <span className="text-red-600">(was ${originalPrice.toFixed(2)})</span>}</p>
            </div>
          </div>
        ) : hasHistoricalData ? (
          <div className="space-y-1">
            <p>📈 Historical price data from our tracking system</p>
            <p>📊 Showing {getPeriodDisplayName(selectedPeriod)} of price history ({effectiveData.length} data points)</p>
            <p>📈 Overall range: ${fullMinPrice.toFixed(2)} - ${fullMaxPrice.toFixed(2)} (from {baseData.length} total data points)</p>
            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
              <p><strong>Current Price:</strong> ${currentPrice.toFixed(2)} {originalPrice && <span className="text-red-600">(was ${originalPrice.toFixed(2)})</span>}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p>📊 Historical price data showing realistic price trends</p>
            <p>📈 Overall range: ${fullMinPrice.toFixed(2)} - ${fullMaxPrice.toFixed(2)} (from {baseData.length} total data points)</p>
            <div className="mt-2 p-2 bg-blue-50 rounded text-blue-800">
              <p><strong>Current Price:</strong> ${currentPrice.toFixed(2)} {originalPrice && <span className="text-red-600">(was ${originalPrice.toFixed(2)})</span>}</p>
            </div>
            <p className="text-xs mt-1">💡 Click "Get Data" to start tracking this product's real price history</p>
          </div>
        )}
      </div>
    </div>
  )
}
