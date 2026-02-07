
import React from 'react';
import { Transaction } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const dateObj = new Date(transaction.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit' });

  return (
    <div className="flex items-center justify-between p-4 bg-[#111] border border-white/5 rounded-2xl hover:bg-[#161616] transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isIncome ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-white/5 text-gray-400'}`}>
          {CATEGORY_ICONS[transaction.category]}
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight">{transaction.description}</h4>
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
            {formattedDate} • {transaction.category}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-bold text-sm ${isIncome ? 'text-[#10b981]' : 'text-gray-100'}`}>
          {isIncome ? '+' : '-'}{transaction.amount.toLocaleString()} <span className="text-[10px] opacity-50 font-medium">Kz</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
