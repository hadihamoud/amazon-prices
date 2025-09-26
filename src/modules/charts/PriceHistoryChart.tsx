import React, { useRef, useEffect } from 'react'
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export type PricePoint = { date: string | number | Date; price: number }

type PriceHistoryChartProps = {
  data: PricePoint[]
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS<'line'>>(null)
  const chartId = useRef(`chart-${Math.random().toString(36).substr(2, 9)}`)

  const labels = data.map(p => {
    const date = new Date(p.date)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })
  const prices = data.map(p => p.price)

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [])

  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice
  const yAxisMin = minPrice - (priceRange * 0.1)
  const yAxisMax = maxPrice + (priceRange * 0.1)

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
        <div className="flex items-center gap-4 text-sm text-camel-gray">
          <span>Low: ${minPrice.toFixed(2)}</span>
          <span>High: ${maxPrice.toFixed(2)}</span>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Line
          ref={chartRef}
          key={chartId.current}
          data={{
            labels,
            datasets: [
              {
                label: 'Price',
                data: prices,
                borderColor: '#ff6600',
                backgroundColor: 'rgba(255, 102, 0, 0.1)',
                pointRadius: 2,
                pointHoverRadius: 4,
                pointBackgroundColor: '#ff6600',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                fill: true,
                tension: 0.1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false }, 
              tooltip: { 
                mode: 'index', 
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: '#ff6600',
                borderWidth: 1,
                callbacks: {
                  label: (context) => `$${context.parsed.y.toFixed(2)}`
                }
              } 
            },
            scales: {
              x: { 
                grid: { display: false },
                ticks: {
                  color: '#666666',
                  font: {
                    size: 12
                  }
                }
              },
              y: { 
                beginAtZero: false,
                min: yAxisMin,
                max: yAxisMax,
                grid: {
                  color: '#f0f0f0'
                },
                ticks: { 
                  color: '#666666',
                  font: {
                    size: 12
                  },
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
    </div>
  )
}


