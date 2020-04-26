import '../styles/ContactView.css'
import {
  getDomain,
  labelFormat,
  sumTextsForDates,
  timeFormat,
} from '../utils/graph'

import React, { memo } from 'react'
import {
  CartesianGrid,
  Legend,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function ScatterGraph(props: { data: IContactMessageData }) {
  const { fromMe, fromThem } = props.data

  // Transform data into an array mapping [date => number of texts sent on date]
  // TODO(codebytere): memoize these functions to speed up re-renders
  const transformedFromMe = sumTextsForDates(fromMe)
  const transformedFromThem = sumTextsForDates(fromThem)

  // Fetch x-axis domain values
  const [start, end] = getDomain(fromMe, fromThem)

  return (
    <ScatterChart
      width={550}
      height={400}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid />
      <XAxis
        type="number"
        dataKey="date"
        name="Date"
        tick={{ fill: 'white' }}
        tickFormatter={timeFormat}
        domain={[start, end]}
      />
      <YAxis
        type="number"
        dataKey="messageCount"
        name="Messages"
        tick={{ fill: 'white' }}
      />
      <Tooltip cursor={{ strokeDasharray: '2 2' }} formatter={labelFormat} />
      <Legend />
      <Scatter
        name="From Me"
        fill="#ffffff"
        data={transformedFromMe}
        line={true}
      />
      <Scatter
        name="From Them"
        data={transformedFromThem}
        fill="#000000"
        line={true}
      />
    </ScatterChart>
  )
}

export default memo(ScatterGraph)
