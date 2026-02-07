
import React, { useState } from 'react';
import { ChevronLeft, Save, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types';
import { CATEGORY_ICONS } from '../constants';

interface AddTransactionViewProps {
  onSave: (t: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const AddTransactionView: React.FC<AddTransactionViewProps> = ({ onSave, onCancel }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(Category.OTHERS);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onSave({ type, amount: parseFloat(amount), description, category, date });
  };

  return (
    <div className="animate-in slide-in-from-right duration-400 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <button onClick={onCancel} className="p-2 text-gray-500 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">Novo Registo</h2>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Toggle de Tipo */}
        <div className="flex bg-[#111] p-1 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-red-500/10 text-red-500 shadow-sm' : 'text-gray-500'}`}
          >
            <ArrowDownCircle size={16} /> Saída
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${type === 'income' ? 'bg-[#10b981]/10 text-[#10b981] shadow-sm' : 'text-gray-500'}`}
          >
            <ArrowUpCircle size={16} /> Entrada
          </button>
        </div>

        <div className="space-y-2 text-center">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Valor da Operação</label>
          <input 
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-5xl font-black text-center focus:outline-none placeholder:text-white/5"
            autoFocus
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Descrição</label>
            <input 
              type="text"
              placeholder="Identificação do registo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 focus:border-[#10b981] transition-all outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Data</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 focus:border-[#10b981] outline-none color-scheme-dark"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Selecione a Categoria</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {Object.values(Category).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${category === cat ? 'bg-[#10b981] border-[#10b981] text-white shadow-lg shadow-[#10b981]/20 scale-105' : 'bg-[#111] border-white/5 text-gray-500 hover:border-white/20'}`}
              >
                {CATEGORY_ICONS[cat]}
                <span className="text-[8px] font-bold uppercase tracking-tighter truncate w-full text-center">{cat}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 font-bold text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white"
          >
            Anular
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-[#10b981] text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#059669] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#10b981]/10"
          >
            <Save size={18} /> Confirmar Registo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionView;
