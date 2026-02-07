
import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Target, Info, BellOff } from 'lucide-react';
import { Transaction, Goal } from '../types';
import TransactionCard from './TransactionCard';
import ExpenseCharts from './ExpenseCharts';

interface DashboardViewProps {
  transactions: Transaction[];
  balance: number;
  initialBalance: number;
  totals: { income: number; expense: number };
  goals: Goal[];
  onUpdateBalance: (val: number) => void;
  onAction: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  transactions, balance, initialBalance, totals, goals, onUpdateBalance, onAction 
}) => {
  const insights = useMemo(() => {
    const list = [];
    if (totals.expense > totals.income && totals.income > 0) {
      list.push("As suas saídas superaram as entradas este mês. Reavalie despesas não essenciais.");
    } else if (totals.income > 0) {
      list.push("Bom trabalho! Está a manter um saldo positivo entre ganhos e gastos.");
    }
    const nearGoal = goals.find(g => (g.currentAmount / g.targetAmount) > 0.8 && g.currentAmount < g.targetAmount);
    if (nearGoal) {
      list.push(`Está quase lá! Faltam apenas ${(nearGoal.targetAmount - nearGoal.currentAmount).toLocaleString()} Kz para atingir a meta: ${nearGoal.title}.`);
    }
    return list;
  }, [totals, goals]);

  // Check if notification permission is denied to show a small nudge
  const [notifNudge] = useState(Notification.permission === 'default');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Balanço Profissional */}
      <section className="bg-gradient-to-br from-[#0f172a] to-black p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Capital Disponível</h2>
            <div className="text-4xl md:text-6xl font-black tracking-tight flex items-baseline gap-2">
              {balance.toLocaleString('pt-AO')} <span className="text-xl font-medium text-gray-500">Kz</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <button 
              onClick={onAction}
              className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors flex items-center gap-2"
            >
              NOVO REGISTO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <TrendingUp size={10} className="text-[#10b981]" /> Entradas
            </span>
            <span className="text-xl font-bold">{totals.income.toLocaleString()} Kz</span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-6">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <TrendingDown size={10} className="text-red-400" /> Saídas
            </span>
            <span className="text-xl font-bold">{totals.expense.toLocaleString()} Kz</span>
          </div>
        </div>
      </section>

      {/* Insights e Notificações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.length > 0 && (
          <section className="bg-[#111] border border-white/5 rounded-2xl p-4 flex gap-4 items-start h-full">
            <div className="bg-[#10b981]/10 p-2 rounded-lg text-[#10b981]">
              <Info size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Resumo de Analítica</p>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{insights[0]}</p>
            </div>
          </section>
        )}

        {notifNudge && (
          <section className="bg-[#111] border border-white/5 rounded-2xl p-4 flex gap-4 items-center h-full animate-pulse">
            <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-500">
              <BellOff size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Sistema de Alertas</p>
              <p className="text-xs text-gray-500">Ative as notificações para manter o foco nas suas metas.</p>
            </div>
          </section>
        )}
      </div>

      {/* Metas Ativas */}
      {goals.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Metas Prioritárias</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.slice(0, 2).map(goal => (
              <div key={goal.id} className="bg-[#111] border border-white/5 p-5 rounded-2xl">
                <div className="flex justify-between mb-4">
                  <span className="font-bold text-sm">{goal.title}</span>
                  <span className="text-xs text-[#10b981] font-bold">
                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10b981] rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <span>{goal.currentAmount.toLocaleString()} Kz</span>
                  <span>{goal.targetAmount.toLocaleString()} Kz</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Histórico e Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Fluxo de Caixa</h3>
          <div className="space-y-2">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map(t => (
                <TransactionCard key={t.id} transaction={t} />
              ))
            ) : (
              <div className="py-12 text-center text-gray-700 text-xs font-bold uppercase tracking-[0.2em] border border-dashed border-white/5 rounded-2xl">
                Aguardando primeiras movimentações
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Alocação</h3>
           <div className="bg-[#111] border border-white/5 p-6 rounded-3xl h-[300px]">
              {transactions.length > 0 ? (
                <ExpenseCharts expenses={transactions} type="pie" />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-700 text-[10px] uppercase font-bold text-center">
                  Gráfico Indisponível
                </div>
              )}
           </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardView;
