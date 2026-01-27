
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  PlusCircle, 
  Wallet 
} from 'lucide-react';
import { Category, Expense, ViewType } from './types';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import AddExpenseView from './components/AddExpenseView';

const STORAGE_KEY_EXPENSES = 'zenith_fin_expenses';
const STORAGE_KEY_BALANCE = 'zenith_fin_balance';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSES);
    return saved ? JSON.parse(saved) : [];
  });

  const [initialBalance, setInitialBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, initialBalance.toString());
  }, [initialBalance]);

  // Gasto total acumulado (para subtrair do saldo inicial)
  const totalAllTimeSpending = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Gasto apenas do mês atual (para exibição informativa)
  const totalMonthlySpending = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expenseWithId: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([expenseWithId, ...expenses]);
    setView('dashboard');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateBalance = (newBalance: number) => {
    setInitialBalance(newBalance);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col pb-24 md:pb-0 md:pl-20">
      <header className="p-6 md:p-8 flex justify-between items-center bg-black/50 backdrop-blur-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00FF7F] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,127,0.4)]">
            <Wallet className="text-black" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase">Zenith<span className="text-[#00FF7F]">Fin</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
             <span className="text-xs text-gray-400 uppercase tracking-widest">Estado do Sistema</span>
             <span className="text-[10px] text-[#00FF7F] flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-[#00FF7F] animate-pulse"></span> Sincronizado
             </span>
           </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto transition-all duration-300">
        {view === 'dashboard' && (
          <DashboardView 
            expenses={expenses} 
            balance={initialBalance} 
            monthlySpending={totalMonthlySpending}
            totalSpending={totalAllTimeSpending}
            onAddClick={() => setView('add')}
            onUpdateBalance={updateBalance}
          />
        )}
        {view === 'history' && (
          <HistoryView expenses={expenses} onDelete={deleteExpense} />
        )}
        {view === 'add' && (
          <AddExpenseView onSave={addExpense} onCancel={() => setView('dashboard')} />
        )}

        <footer className="mt-20 mb-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] mb-1">Desenvolvido por</p>
          <p className="text-sm font-bold text-gray-400 tracking-wider hover:text-[#00FF7F] transition-colors cursor-default">JORGE ANSELMO</p>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-6 z-40 md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-20 md:flex-col md:border-r md:border-t-0 md:justify-start md:pt-24 md:gap-8">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'dashboard' ? 'text-[#00FF7F]' : 'text-gray-500 hover:text-white'}`}
        >
          <LayoutDashboard size={24} className={view === 'dashboard' ? 'drop-shadow-[0_0_8px_rgba(0,255,127,0.5)]' : ''} />
          <span className="text-[10px] font-medium uppercase tracking-widest md:hidden">Início</span>
        </button>
        
        <button 
          onClick={() => setView('add')}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'add' ? 'text-[#00FF7F]' : 'text-gray-500 hover:text-white'}`}
        >
          <PlusCircle size={32} className={view === 'add' ? 'drop-shadow-[0_0_8px_rgba(0,255,127,0.5)]' : ''} />
          <span className="text-[10px] font-medium uppercase tracking-widest md:hidden">Novo</span>
        </button>

        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-1 transition-all ${view === 'history' ? 'text-[#00FF7F]' : 'text-gray-500 hover:text-white'}`}
        >
          <HistoryIcon size={24} className={view === 'history' ? 'drop-shadow-[0_0_8px_rgba(0,255,127,0.5)]' : ''} />
          <span className="text-[10px] font-medium uppercase tracking-widest md:hidden">Histórico</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
