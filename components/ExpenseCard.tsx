
import React from 'react';
// Changed Expense to Transaction to match the current domain model
import { Transaction } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface ExpenseCardProps {
  // Changed Expense to Transaction
  expense: Transaction;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  // Garantir que a data seja interpretada corretamente sem desvios de fuso horário
  const dateObj = new Date(expense.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-AO', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  return (
    <div className="flex items-center justify-between p-4 bg-[#050505] neon-border rounded-xl hover:bg-[#080808] transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-black border border-white/5 flex items-center justify-center text-[#10b981] group-hover:scale-110 transition-transform">
          {CATEGORY_ICONS[expense.category]}
        </div>
        <div>
          <h4 className="font-semibold text-sm">{expense.description}</h4>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">
            {formattedDate} • {expense.category}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-[#10b981]">
          -{expense.amount.toLocaleString('pt-AO')} <span className="text-[10px] font-normal opacity-70">Kz</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
