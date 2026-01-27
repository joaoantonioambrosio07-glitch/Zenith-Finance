
import React, { useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Legend
} from 'recharts';
import { Expense, Category } from '../types';

interface ExpenseChartsProps {
  expenses: Expense[];
  type: 'pie' | 'bar';
}

const COLORS = ['#00FF7F', '#FFFFFF', '#1A1A1A', '#333333', '#444444', '#555555', '#666666'];

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses, type }) => {
  const pieData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const barData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dailyTotal = expenses
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        date: new Date(date).toLocaleDateString('pt-AO', { weekday: 'short' }),
        amount: dailyTotal
      };
    });
  }, [expenses]);

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid #00FF7F', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#00FF7F' }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#444', fontSize: 10 }}
        />
        <YAxis hide />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: '#000', border: '1px solid #00FF7F', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#00FF7F' }}
        />
        <Bar 
          dataKey="amount" 
          fill="#00FF7F" 
          radius={[4, 4, 0, 0]} 
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseCharts;
