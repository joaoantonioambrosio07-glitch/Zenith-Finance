
import React, { useState, useMemo } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { Category, Expense } from '../types';
import ExpenseCard from './ExpenseCard';

interface HistoryViewProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ expenses, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'todos'>('todos');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'todos' || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tighter uppercase">Arquivo Geral</h2>
        <div className="px-3 py-1 rounded-full bg-[#00FF7F]/10 border border-[#00FF7F]/20 text-[#00FF7F]">
           <span className="text-[10px] font-bold tracking-widest">{filteredExpenses.length} ITENS</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00FF7F] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Filtrar por nome ou valor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#00FF7F] transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory('todos')}
            className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-bold tracking-widest border transition-all ${selectedCategory === 'todos' ? 'bg-[#00FF7F] border-[#00FF7F] text-black shadow-[0_0_10px_rgba(0,255,127,0.3)]' : 'bg-[#050505] border-white/5 text-gray-500 hover:border-white/20'}`}
          >
            TODOS
          </button>
          {Object.values(Category).map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-bold tracking-widest border transition-all ${selectedCategory === cat ? 'bg-[#00FF7F] border-[#00FF7F] text-black shadow-[0_0_10px_rgba(0,255,127,0.3)]' : 'bg-[#050505] border-white/5 text-gray-500 hover:border-white/20'}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pb-8">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div key={expense.id} className="relative group">
              <ExpenseCard expense={expense} />
              <button 
                onClick={() => onDelete(expense.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                title="Apagar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-24 text-gray-700">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full border border-dashed border-gray-800 flex items-center justify-center">
                 <Search size={24} className="opacity-20" />
              </div>
            </div>
            <p className="uppercase tracking-[0.3em] text-[10px]">Sem correspondências</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
