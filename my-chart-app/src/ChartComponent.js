import React, {useEffect, useState, useRef} from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {parseISO, format} from 'date-fns'
import {toPng} from 'html-to-image'
import {saveAs} from 'file-saver'
import './App.css' 

const ChartComponent = () => {
  const [data, setData] = useState([])
  const [setTimeframe] = useState('daily')
  const chartRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error))
  }

  const formatXAxis = tickItem => {
    return format(parseISO(tickItem), 'MMM d')
  }

  const exportChart = () => {
    if (chartRef.current) {
      toPng(chartRef.current, {cacheBust: true})
        .then(dataUrl => {
          saveAs(dataUrl, 'chart.png')
        })
        .catch(err => {
          console.error('Failed to export chart as image', err)
        })
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setTimeframe('daily')}>Daily</button>
        <button onClick={() => setTimeframe('weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('monthly')}>Monthly</button>
        <button onClick={exportChart}>Export as PNG</button>
      </div>
      <div ref={chartRef} className='chart-container'>
        <ResponsiveContainer width='100%' height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='timestamp' tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='value'
              stroke='#8884d8'
              activeDot={{r: 8}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartComponent
