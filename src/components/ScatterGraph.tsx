import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { sumTextsForDates, timeFormat, getDomain } from '../data/utils';

import '../styles/ContactView.css';

class ScatterGraph extends React.Component<{data: ContactMessageData}, {}> {
  render() {
    const { fromMe, fromThem } = this.props.data;
    
    // Transform data into an array mapping [date => number of texts sent on date]
    const transformedFromMe = sumTextsForDates(fromMe);
    const transformedFromThem = sumTextsForDates(fromThem);

    // Fetch x-axis domain values
    const [start, end] = getDomain(fromMe, fromThem);

    return (
      <ScatterChart width={550} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid />
        <XAxis
          type='number'
          dataKey='date'
          name='Date'
          tick={{ fill: 'white' }}
          tickFormatter={timeFormat}
          domain={[start, end]}
        />
        <YAxis type='number' dataKey='messageCount' name='Number of Messages' tick={{ fill: 'white' }} />
        <Tooltip cursor={{ strokeDasharray: "2 2" }} />
        <Legend />
        <Scatter name='From Me' fill='#ffffff' data={transformedFromMe} line />
        <Scatter name='From Them' data={transformedFromThem} fill='#000000' line />
      </ScatterChart>
    );
  }
}

export default ScatterGraph;