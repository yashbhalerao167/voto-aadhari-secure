
import { PieChart as RechartsPie, Pie, Cell, BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBlockchain } from '@/contexts/BlockchainContext';

interface ResultsChartProps {
  type: 'pie' | 'bar';
}

const COLORS = ['#7E69AB', '#6E59A5', '#0EA5E9', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#D946EF'];

export function ResultsChart({ type }: ResultsChartProps) {
  const { candidates } = useBlockchain();

  // Transform candidates data for charts
  const data = candidates.map((candidate, index) => ({
    name: candidate.name,
    votes: candidate.voteCount,
    fill: COLORS[index % COLORS.length]
  }));

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPie data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={150}
            fill="#8884d8"
            dataKey="votes"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} votes`, name]}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </RechartsPie>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBar
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end"
          height={70}
          interval={0}
        />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
        <Legend />
        <Bar dataKey="votes" name="Votes" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
}
