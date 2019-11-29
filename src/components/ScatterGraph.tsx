import React from 'react';
import '../styles/ContactView.css';
import { DAY } from '../constants';
import moment from 'moment';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function sumTextsForDates(messages: Message[]) {
  let formatted: ScatterChartDataPoint[] = [];
  const [first, last] = [
    new Date(messages[0].date).getTime(),
    new Date(messages[messages.length - 1].date).getTime()
  ];

  for (let loopTime = first; loopTime < last; loopTime += DAY) {
    const day = new Date(loopTime);
    const filtered = messages.filter(m => {
      const d = new Date(m.date)
      return (
        day.getFullYear() === d.getFullYear() &&
        day.getMonth() === d.getMonth() &&
        day.getDate() === d.getDate()
      )
    })
    formatted.push(({ date: day, messageCount: filtered.length }));
  }
  return formatted;
}

const timeFormat = (date: number) => {
  return moment(date).format('YYYY-MM-DD');
}

// const getDomain = (fromMe, fromThem) => {

// }

class ScatterGraph extends React.Component<{data: ContactMessageData}, {}> {
  render() {
    const { fromMe, fromThem } = this.props.data;
    const transformedFromMe = sumTextsForDates(fromMe);
    const transformedFromThem = sumTextsForDates(fromThem);

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    return (
      <ScatterChart width={600} height={400} margin={margin}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey={"date"}
          name="Date"
          tickFormatter={timeFormat}
          domain={[1514678400000, 1577750400000]}
        />
        <YAxis type="number" dataKey={"messageCount"} name="Number of Messages" />
        <ZAxis range={[500]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        <Scatter name="From Me" data={transformedFromMe} fill="#8884d8" line />
        <Scatter name="From Them" data={transformedFromThem} fill="#8884d8" line />
      </ScatterChart>
    );
  }
}

export default ScatterGraph;