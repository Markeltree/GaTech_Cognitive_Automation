import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ui';

export default function ThroughputChart({ data, height = 240, compact = false, chartType = 'bar' }) {
  if (chartType === 'bar') {
    const barData = (data || []).map((d) => ({
      ...d,
      displayHour: compact ? `${parseInt(d.hour, 10)}h` : d.hour,
      total: (d.automated || 0) + (d.manual || 0),
    }));

    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={barData} margin={{ top: 10, right: 6, left: compact ? -26 : -10, bottom: 0 }}>
          <CartesianGrid stroke="#F1F5F9" vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="displayHour"
            tick={{ fill: '#64748B', fontSize: compact ? 10.5 : 12, fontWeight: 500 }}
            tickLine={false}
            axisLine={{ stroke: '#EAEEF5' }}
            interval={compact ? 5 : 2}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={compact ? 24 : 44}
            hide={compact}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            content={<ChartTooltip fmt={(v) => `${(v || 0).toLocaleString()} tasks/hr`} />}
            cursor={{ fill: 'rgba(2, 132, 199, 0.06)' }}
          />
          <Bar
            dataKey="automated"
            name="Automated tasks"
            fill="#0284C7"
            radius={[4, 4, 0, 0]}
            maxBarSize={compact ? 12 : 18}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: compact ? -28 : -12, bottom: 0 }}>
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284C7" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#0284C7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} interval={compact ? 5 : 3} />
        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} tickLine={false} axisLine={false} width={48} hide={compact} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#CBD5E1' }} />
        <Area type="monotone" dataKey="automated" name="Automated" stroke="#0284C7" strokeWidth={2} fill="url(#gA)" isAnimationActive={false} activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }} />
        <Area type="monotone" dataKey="manual" name="Manual" stroke="#6366F1" strokeWidth={2} fill="none" isAnimationActive={false} activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const ThroughputLegend = () => (
  <div className="legend">
    <span><i style={{ background: '#0284C7' }} />Automated</span>
    <span><i style={{ background: '#6366F1' }} />Manual review</span>
  </div>
);
