
import React, { useState } from 'react';
import { ChevronLeft, Save } from 'lucide-react';
// Changed Expense to Transaction
import { Category, Transaction } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface AddExpenseViewProps {
  // Changed Expense to Transaction
  onSave: (expense: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const AddExpenseView: React.FC<AddExpenseViewProps> = ({ onSave, onCancel }) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHERS);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    
    // Updated to match the Transaction type structure by adding 'type'
    onSave({
      amount: parseFloat(amount),
      description,
      category,
      date,
      type: 'expense'
    });
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 max-w-lg mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="p-2 -ml-2 text-gray-500 hover:text-[#10b981] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-lg font-bold tracking-widest uppercase">Novo Gasto</h2>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="text-center space-y-2">
          <label className="text-[10px] text-gray-500 uppercase tracking-widest">Valor (Kz)</label>
          <div className="relative inline-block">
            <input 
              type="number"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-5xl font-black text-[#10b981] text-center w-full focus:outline-none placeholder:text-[#10b981]/20 neon-text"
              autoFocus
              step="any"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Descrição</label>
            <input 
              type="text"
              placeholder="Ex: Almoço no shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#050505] neon-border rounded-xl px-5 py-4 focus:outline-none focus:border-[#10b981] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Categoria</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {Object.values(Category).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${category === cat ? 'bg-[#10b981] border-[#10b981] text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-[#050505] border-white/5 text-gray-400 hover:border-white/20'}`}
                >
                  <div className="opacity-80">
                    {CATEGORY_ICONS[cat]}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-500 font-bold mt-2">{category}</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Data</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#050505] neon-border rounded-xl px-5 py-4 focus:outline-none focus:border-[#10b981] transition-all text-white color-scheme-dark"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 rounded-xl border border-white/10 font-bold text-gray-400 hover:bg-white/5 transition-all"
          >
            CANCELAR
          </button>
          <button 
            type="submit"
            className="flex-1 py-4 rounded-xl bg-[#10b981] text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Save size={20} />
            SALVAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExpenseView;
