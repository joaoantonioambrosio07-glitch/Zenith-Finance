
import React from 'react';
import { Bell, Shield, Clock, CheckCircle, AlertTriangle, Zap, Target, Trash2, Database, Wallet } from 'lucide-react';
import { NotificationSettings } from '../types';

interface SettingsViewProps {
  settings: NotificationSettings;
  onUpdate: (s: NotificationSettings) => void;
  onReset: () => void;
  initialBalance: number;
  onUpdateBalance: (val: number) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ 
  settings, onUpdate, onReset, initialBalance, onUpdateBalance 
}) => {
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        onUpdate({ ...settings, enabled: true });
      } else {
        alert("Permissão negada. Ative manualmente nas definições do navegador para receber alertas.");
      }
    } catch (e) {
      alert("Ambiente não suporta notificações nativas.");
    }
  };

  const toggle = (key: keyof NotificationSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, reminderTime: e.target.value });
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onUpdateBalance(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto pb-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-black tracking-tight">Painel de Controlo</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Configurações Estratégicas do Sistema</p>
      </div>

      {/* Gestão de Carteira Principal */}
      <section className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
        <div className="flex items-center gap-4 text-[#10b981]">
          <div className="p-3 bg-[#10b981]/10 rounded-2xl"><Wallet size={24} /></div>
          <div>
            <h3 className="font-bold text-lg">Saldo Inicial</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Base de cálculo da carteira</p>
          </div>
        </div>
        <div className="relative">
          <input 
            type="number" 
            value={initialBalance} 
            onChange={handleBalanceChange}
            className="w-full bg-black border border-white/5 rounded-2xl px-6 py-5 text-2xl font-black text-white outline-none focus:border-[#10b981] transition-all"
            placeholder="0"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 font-bold">Kz</span>
        </div>
        <p className="text-[9px] text-gray-600 leading-relaxed uppercase tracking-wider">
          O saldo total do Dashboard é calculado somando este valor aos rendimentos e subtraindo as despesas registadas.
        </p>
      </section>

      {/* Status de Notificações */}
      <section className={`p-8 rounded-[2.5rem] border transition-all ${settings.enabled ? 'bg-[#10b981]/5 border-[#10b981]/20' : 'bg-red-500/5 border-red-500/20'}`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-5">
            <div className={`p-4 rounded-2xl ${settings.enabled ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-red-500/10 text-red-500'}`}>
              <Bell size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Central de Alertas</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                Autorize o sistema a enviar notificações para manter a sua disciplina financeira em dia.
              </p>
            </div>
          </div>
          {!settings.enabled ? (
            <button 
              onClick={requestPermission}
              className="bg-white text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#10b981] transition-all shadow-lg"
            >
              Ativar
            </button>
          ) : (
            <div className="flex items-center gap-2 text-[#10b981] font-black text-[10px] uppercase tracking-widest bg-[#10b981]/10 px-4 py-2 rounded-xl">
              <CheckCircle size={14} /> Ativo
            </div>
          )}
        </div>
      </section>

      {/* Canais Ativos */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4">Automatizações Ativas</h3>
        
        <div className="grid gap-3">
          <div className="flex flex-col gap-2">
            <SettingToggle 
              icon={<Clock size={18} />} 
              title="Lembrete Diário" 
              description="Notifica se não houver registos no dia até à hora escolhida." 
              active={settings.reminders} 
              onToggle={() => toggle('reminders')} 
              disabled={!settings.enabled}
            />
            {settings.reminders && settings.enabled && (
              <div className="bg-black border border-white/5 p-5 rounded-[2rem] ml-8 animate-in slide-in-from-top-2 duration-300 flex justify-between items-center">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hora Agendada</span>
                <input 
                  type="time" 
                  value={settings.reminderTime} 
                  onChange={handleTimeChange}
                  className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 text-sm font-black text-[#10b981] outline-none focus:border-[#10b981] color-scheme-dark"
                />
              </div>
            )}
          </div>

          <SettingToggle 
            icon={<Target size={18} />} 
            title="Progresso de Objetivos" 
            description="Alertas automáticos ao atingir marcos de 50%, 80% e 100% das metas." 
            active={settings.goalMilestones} 
            onToggle={() => toggle('goalMilestones')} 
            disabled={!settings.enabled}
          />

          <SettingToggle 
            icon={<Zap size={18} />} 
            title="Detetor de Orçamento" 
            description="Avisa quando os gastos mensais ultrapassam o limite de segurança." 
            active={settings.budgetAlerts} 
            onToggle={() => toggle('budgetAlerts')} 
            disabled={!settings.enabled}
          />
        </div>
      </section>

      {/* Área de Perigo */}
      <section className="pt-6">
        <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-5 items-center">
            <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><Database size={24} /></div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest">Limpeza de Base de Dados</h4>
              <p className="text-[10px] text-gray-500 mt-1">Apaga permanentemente todas as transações, metas e saldos.</p>
            </div>
          </div>
          <button 
            onClick={onReset}
            className="w-full md:w-auto px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={16} /> Reset Total
          </button>
        </div>
      </section>

      <div className="pt-10 opacity-30 text-center">
        <p className="text-[8px] text-gray-500 uppercase tracking-[0.5em] font-black">Zenith Engine v2.8 Core</p>
      </div>
    </div>
  );
};

interface SettingToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  disabled: boolean;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ icon, title, description, active, onToggle, disabled }) => (
  <button 
    onClick={onToggle}
    disabled={disabled}
    className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all text-left group ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:border-white/10 active:scale-[0.98]' } ${active && !disabled ? 'bg-[#111] border-[#10b981]/20' : 'bg-[#0a0a0a] border-white/5'}`}
  >
    <div className="flex gap-5">
      <div className={`p-3 rounded-xl transition-colors ${active && !disabled ? 'text-[#10b981] bg-[#10b981]/5' : 'text-gray-600'}`}>{icon}</div>
      <div>
        <h4 className="text-sm font-bold">{title}</h4>
        <p className="text-[10px] text-gray-500 mt-1 leading-tight tracking-wide line-clamp-2">{description}</p>
      </div>
    </div>
    <div className={`w-11 h-6 shrink-0 rounded-full relative transition-all duration-300 ${active && !disabled ? 'bg-[#10b981]' : 'bg-gray-800'}`}>
      <div className={`absolute top-1.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active && !disabled ? 'left-6.5 shadow-sm' : 'left-1.5'}`}></div>
    </div>
  </button>
);

export default SettingsView;
