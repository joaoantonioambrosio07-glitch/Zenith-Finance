
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
// Changed Expense to Transaction to match exported members from types.ts
import { Transaction, Category } from '../types';

interface ExpenseChartsProps {
  // Changed Expense to Transaction
  expenses: Transaction[];
  type: 'pie' | 'bar';
}

const COLORS = ['#10b981', '#FFFFFF', '#1A1A1A', '#333333', '#444444', '#555555', '#666666'];

const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses, type }) => {
  const pieData = useMemo(() => {
    const data: Record<string, number> = {};
    // Only aggregate transactions of type 'expense' for this view
    expenses.filter(t => t.type === 'expense').forEach(e => {
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
      // Filter by date and ensure only expenses are counted
      const dailyTotal = expenses
        .filter(e => e.date === date && e.type === 'expense')
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
            contentStyle={{ backgroundColor: '#000', border: '1px solid #10b981', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#10b981' }}
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
          contentStyle={{ backgroundColor: '#000', border: '1px solid #10b981', borderRadius: '8px', color: '#fff' }}
          itemStyle={{ color: '#10b981' }}
        />
        <Bar 
          dataKey="amount" 
          fill="#10b981" 
          radius={[4, 4, 0, 0]} 
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ExpenseCharts;
