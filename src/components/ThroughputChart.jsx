import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ui';

export default function ThroughputChart({ data, height = 260, compact = false }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: compact ? -28 : -12, bottom: 0 }}>
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--series-a)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--series-a)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--line)" vertical={false} />
        <XAxis dataKey="hour" tick={{ fill: 'var(--faint)', fontSize: 11 }} tickLine={false} axisLine={false} interval={compact ? 5 : 3} />
        <YAxis tick={{ fill: 'var(--faint)', fontSize: 11 }} tickLine={false} axisLine={false} width={48} hide={compact} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--line-strong)' }} />
        <Area type="monotone" dataKey="automated" name="Automated" stroke="var(--series-a)" strokeWidth={2} fill="url(#gA)" isAnimationActive={false} activeDot={{ r: 4, stroke: 'var(--panel)', strokeWidth: 2 }} />
        <Area type="monotone" dataKey="manual" name="Manual" stroke="var(--series-b)" strokeWidth={2} fill="none" isAnimationActive={false} activeDot={{ r: 4, stroke: 'var(--panel)', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export const ThroughputLegend = () => (
  <div className="legend">
    <span><i style={{ background: 'var(--series-a)' }} />Automated</span>
    <span><i style={{ background: 'var(--series-b)' }} />Manual</span>
  </div>
);
