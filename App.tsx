
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  PlusCircle, 
  Target,
  Wallet,
  Settings as SettingsIcon
} from 'lucide-react';
import { Category, Transaction, ViewType, Goal, NotificationSettings } from './types';
import DashboardView from './components/DashboardView';
import HistoryView from './components/HistoryView';
import AddTransactionView from './components/AddTransactionView';
import GoalsView from './components/GoalsView';
import SettingsView from './components/SettingsView';

const STORAGE_KEY_TRANSACTIONS = 'zenith_v2_transactions';
const STORAGE_KEY_BALANCE = 'zenith_v2_balance';
const STORAGE_KEY_GOALS = 'zenith_v2_goals';
const STORAGE_KEY_NOTIFICATIONS = 'zenith_v2_notif_settings';

const App: React.FC = () => {
  const [view, setView] = useState<ViewType>('dashboard');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [initialBalance, setInitialBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
    return saved ? parseFloat(saved) : 0;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_GOALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
    return saved ? JSON.parse(saved) : {
      enabled: false,
      reminders: true,
      goalMilestones: true,
      budgetAlerts: true,
      reminderTime: '20:00'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BALANCE, initialBalance.toString());
  }, [initialBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifSettings));
  }, [notifSettings]);

  const sendNotification = useCallback((title: string, body: string) => {
    if (notifSettings.enabled && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (e) {
        console.warn("Notificações não suportadas.");
      }
    }
  }, [notifSettings.enabled]);

  // Lógica de Lembrete por Hora (Cron-like)
  useEffect(() => {
    if (!notifSettings.enabled || !notifSettings.reminders) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime === notifSettings.reminderTime) {
        const today = now.toISOString().split('T')[0];
        const hasEntryToday = transactions.some(t => t.date === today);
        
        const lastRemindedKey = `zenith_reminded_${today}`;
        if (!hasEntryToday && localStorage.getItem(lastRemindedKey) !== 'true') {
          sendNotification('Zenith: Lembrete Diário', 'Ainda não registou os seus gastos hoje. Mantenha o seu plano ativo!');
          localStorage.setItem(lastRemindedKey, 'true');
        }
      }
    }, 45000); // Verifica a cada 45 segundos

    return () => clearInterval(interval);
  }, [notifSettings, transactions, sendNotification]);

  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    }, { income: 0, expense: 0 });
  }, [transactions]);

  const currentBalance = initialBalance + totals.income - totals.expense;

  const addTransaction = (newT: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newT,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    
    // Alerta de Orçamento (Se gastos mensais > 200k Kz)
    if (notifSettings.enabled && notifSettings.budgetAlerts && transaction.type === 'expense') {
      const currentMonth = new Date().toISOString().substring(0, 7);
      const monthlyExpense = updatedTransactions
        .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const threshold = 200000;
      if (monthlyExpense > threshold) {
        sendNotification('Alerta de Orçamento', `Cuidado! Os seus gastos este mês já atingiram ${monthlyExpense.toLocaleString()} Kz.`);
      }
    }
    
    setView('dashboard');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateGoal = (updatedGoal: Goal) => {
    const oldGoal = goals.find(g => g.id === updatedGoal.id);
    setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    
    if (notifSettings.enabled && notifSettings.goalMilestones && oldGoal) {
      const oldPct = (oldGoal.currentAmount / oldGoal.targetAmount) * 100;
      const newPct = (updatedGoal.currentAmount / updatedGoal.targetAmount) * 100;
      
      if (newPct >= 100 && oldPct < 100) {
        sendNotification('Meta Alcançada!', `Parabéns por concluir: ${updatedGoal.title}`);
      } else if (newPct >= 50 && oldPct < 50) {
        sendNotification('Grande Progresso!', `Já poupou metade para: ${updatedGoal.title}`);
      }
    }
  };

  const handleReset = () => {
    if (confirm("Deseja apagar TODOS os seus dados financeiros de forma permanente?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col pb-24 md:pb-0 md:pl-20">
      <header className="p-6 md:p-8 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-30 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10b981] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Wallet className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ZENITH <span className="text-[#10b981]">FINANCE</span></h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-none">Professional Budgeting • v2.8</p>
          </div>
        </div>
        <button onClick={() => setView('settings')} className={`p-2 rounded-lg transition-colors ${view === 'settings' ? 'bg-[#10b981]/10 text-[#10b981]' : 'text-gray-500 hover:text-white'}`}>
          <SettingsIcon size={20} />
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        {view === 'dashboard' && (
          <DashboardView 
            transactions={transactions} 
            balance={currentBalance}
            initialBalance={initialBalance}
            totals={totals}
            goals={goals}
            onUpdateBalance={setInitialBalance}
            onAction={() => setView('add')}
          />
        )}
        {view === 'history' && <HistoryView transactions={transactions} onDelete={deleteTransaction} />}
        {view === 'add' && <AddTransactionView onSave={addTransaction} onCancel={() => setView('dashboard')} />}
        {view === 'goals' && (
          <GoalsView 
            goals={goals} 
            onAdd={(g) => setGoals([...goals, { ...g, id: Math.random().toString(36).substr(2, 9) }])} 
            onDelete={(id) => setGoals(goals.filter(g => g.id !== id))} 
            onUpdate={updateGoal} 
            currentBalance={currentBalance} 
          />
        )}
        {view === 'settings' && (
          <SettingsView 
            settings={notifSettings} 
            onUpdate={setNotifSettings} 
            onReset={handleReset} 
            initialBalance={initialBalance}
            onUpdateBalance={setInitialBalance}
          />
        )}

        <footer className="mt-20 mb-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] mb-2">Sistema Gestor de Ativos</p>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-semibold text-gray-400 tracking-wider">Desenvolvido com excelência por</p>
            <p className="text-lg font-black text-[#10b981] tracking-tighter uppercase neon-text">Jorge Anselmo</p>
          </div>
          <p className="text-[9px] text-gray-700 mt-4 font-bold tracking-[0.3em]">ZENITH GLOBAL SYSTEMS &copy; 2025</p>
        </footer>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-2xl border-t border-white/5 flex justify-around items-center px-6 z-40 md:top-0 md:bottom-0 md:left-0 md:right-auto md:w-20 md:flex-col md:border-r md:border-t-0 md:justify-start md:pt-24 md:gap-10">
        <NavButton active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={24} />} label="Início" />
        <NavButton active={view === 'add'} onClick={() => setView('add')} icon={<PlusCircle size={24} />} label="Registo" />
        <NavButton active={view === 'goals'} onClick={() => setView('goals')} icon={<Target size={24} />} label="Metas" />
        <NavButton active={view === 'history'} onClick={() => setView('history')} icon={<HistoryIcon size={24} />} label="Extrato" />
        <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={<SettingsIcon size={24} />} label="Ajustes" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#10b981]' : 'text-gray-500 hover:text-gray-300'}`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'scale-100'}`}>{icon}</div>
    <span className="text-[9px] font-bold uppercase tracking-widest md:hidden">{label}</span>
    {active && <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1 shadow-[0_0_8px_#10b981]"></span>}
  </button>
);

export default App;
