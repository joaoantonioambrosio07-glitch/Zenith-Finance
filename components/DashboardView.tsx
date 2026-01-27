
import React, { useState } from 'react';
import { Plus, ChevronRight, ArrowUpRight, TrendingDown, Edit2, X, Check } from 'lucide-react';
import { Expense } from '../types';
import ExpenseCard from './ExpenseCard';
import ExpenseCharts from './ExpenseCharts';

interface DashboardViewProps {
  expenses: Expense[];
  balance: number;
  monthlySpending: number;
  totalSpending: number;
  onAddClick: () => void;
  onUpdateBalance: (newBalance: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  expenses, 
  balance, 
  monthlySpending,
  totalSpending,
  onAddClick,
  onUpdateBalance
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalance, setTempBalance] = useState(balance.toString());
  
  const latestExpenses = expenses.slice(0, 5);
  // O saldo atual é o que sobra após TODOS os gastos registados
  const currentNetBalance = balance - totalSpending;

  const handleBalanceUpdate = () => {
    const val = parseFloat(tempBalance);
    if (!isNaN(val)) {
      onUpdateBalance(val);
      setIsEditingBalance(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Seção de Saldo Principal */}
      <section className="text-center py-8 relative">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mb-2">Saldo Disponível</h2>
        
        <div className="flex items-center justify-center gap-3">
          <div className="text-5xl md:text-7xl font-extrabold text-[#00FF7F] neon-text tracking-tighter">
            {currentNetBalance.toLocaleString('pt-AO')} <span className="text-2xl font-light">Kz</span>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Gasto no Mês</span>
            <span className="text-lg font-bold flex items-center gap-1 justify-center">
              <TrendingDown size={14} className="text-[#00FF7F]" />
              {monthlySpending.toLocaleString('pt-AO')} Kz
            </span>
          </div>
          
          <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Fundo Inicial</span>
            {isEditingBalance ? (
              <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                <input 
                  type="number"
                  value={tempBalance}
                  onChange={(e) => setTempBalance(e.target.value)}
                  className="bg-black border-b border-[#00FF7F] text-lg font-bold text-[#00FF7F] text-center w-24 focus:outline-none"
                  autoFocus
                />
                <button onClick={handleBalanceUpdate} className="text-[#00FF7F] hover:scale-110"><Check size={16}/></button>
                <button onClick={() => setIsEditingBalance(false)} className="text-red-500 hover:scale-110"><X size={16}/></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={() => setIsEditingBalance(true)}>
                <span className="text-lg font-bold text-white group-hover/edit:text-[#00FF7F] transition-colors">
                  {balance.toLocaleString('pt-AO')} Kz
                </span>
                <Edit2 size={12} className="text-gray-600 group-hover/edit:text-[#00FF7F]" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Botão de Ação */}
      <div className="flex justify-center">
        <button 
          onClick={onAddClick}
          className="neon-button group bg-[#00FF7F] text-black px-10 py-5 rounded-full font-bold flex items-center gap-3 shadow-[0_0_25px_rgba(0,255,127,0.35)] hover:shadow-[0_0_35px_rgba(0,255,127,0.5)] transition-all"
        >
          <Plus size={22} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-500" />
          REGISTAR DESPESA
        </button>
      </div>

      {/* Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#050505] neon-border rounded-3xl p-6 transition-all hover:border-[#00FF7F]/50">
          <h3 className="text-[10px] font-bold tracking-[0.2em] mb-6 flex items-center gap-2 text-gray-400 uppercase">
            <ArrowUpRight size={14} className="text-[#00FF7F]" />
            Categorias
          </h3>
          <div className="h-[220px] w-full">
            {expenses.length > 0 ? (
              <ExpenseCharts expenses={expenses} type="pie" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[10px] text-gray-700 uppercase tracking-widest gap-2">
                <div className="w-12 h-12 rounded-full border border-white/5 animate-pulse"></div>
                Sem dados para exibir
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#050505] neon-border rounded-3xl p-6 transition-all hover:border-[#00FF7F]/50">
          <h3 className="text-[10px] font-bold tracking-[0.2em] mb-6 flex items-center gap-2 text-gray-400 uppercase">
            <TrendingDown size={14} className="text-[#00FF7F]" />
            Últimos 7 Dias
          </h3>
          <div className="h-[220px] w-full">
            {expenses.length > 0 ? (
              <ExpenseCharts expenses={expenses} type="bar" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[10px] text-gray-700 uppercase tracking-widest gap-2">
                <div className="w-12 h-12 rounded-full border border-white/5 animate-pulse"></div>
                Aguardando registos
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Atividade */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Fluxo Recente</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {latestExpenses.length > 0 ? (
            latestExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <div className="text-center py-16 bg-[#030303] border border-dashed border-white/5 rounded-3xl group">
              <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] group-hover:text-gray-500 transition-colors">
                Tudo limpo por aqui. Comece agora!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
