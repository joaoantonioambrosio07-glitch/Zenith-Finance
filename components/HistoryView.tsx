
import React, { useState, useMemo } from 'react';
import { Search, Trash2, Filter } from 'lucide-react';
import { Category, Transaction } from '../types';
import TransactionCard from './TransactionCard';

interface HistoryViewProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || t.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, selectedType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black tracking-tight mb-1">Extrato Geral</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Histórico Completo de Movimentações</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-[#10b981]">{filtered.length}</span>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Registos</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text"
              placeholder="Pesquisar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-white/5 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#10b981] transition-all"
            />
          </div>
          <div className="flex bg-[#111] p-1 rounded-2xl border border-white/5">
            {(['all', 'income', 'expense'] as const).map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedType === type ? 'bg-white/5 text-white shadow-sm' : 'text-gray-600 hover:text-gray-400'}`}
              >
                {type === 'all' ? 'Tudo' : type === 'income' ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map(t => (
              <div key={t.id} className="relative group">
                <TransactionCard transaction={t} />
                <button 
                  onClick={() => onDelete(t.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="py-24 text-center space-y-4">
              <div className="inline-flex p-6 bg-[#111] rounded-full border border-white/5 text-gray-800">
                <Filter size={32} />
              </div>
              <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.4em]">Sem resultados para o filtro</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
