/**
 * MoodChart
 * A responsive line chart of score over time (recharts). Receives a
 * series of { date, score } points. Lower scores = better wellbeing.
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MoodChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-400">
        No trend data yet.
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
              boxShadow: "0 4px 20px rgba(99,102,241,0.10)",
            }}
            formatter={(value) => [`${value}/100`, "Risk score"]}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#lineStroke)"
            strokeWidth={3}
            dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
