
import React, { useState } from 'react';
import { Target, Plus, Trash2, PiggyBank, X, AlertCircle, TrendingUp, Wallet } from 'lucide-react';
import { Goal } from '../types';

interface GoalsViewProps {
  goals: Goal[];
  onAdd: (g: Omit<Goal, 'id'>) => void;
  onDelete: (id: string) => void;
  onUpdate: (g: Goal) => void;
  currentBalance: number;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, onAdd, onDelete, onUpdate, currentBalance }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTarget) return;
    onAdd({ title: newTitle, targetAmount: parseFloat(newTarget), currentAmount: 0 });
    setNewTitle('');
    setNewTarget('');
    setShowAdd(false);
  };

  const handleDeposit = (goal: Goal) => {
    const amountStr = prompt(`Quanto deseja destinar à meta: ${goal.title}?\n\nSaldo em carteira: ${currentBalance.toLocaleString()} Kz\nJá guardado nesta meta: ${goal.currentAmount.toLocaleString()} Kz`);
    if (amountStr === null) return;
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }

    if (amount > currentBalance) {
      if (!confirm(`O valor inserido (${amount.toLocaleString()} Kz) é superior ao seu saldo disponível (${currentBalance.toLocaleString()} Kz). Deseja continuar e registar como um esforço externo?`)) {
        return;
      }
    }

    onUpdate({ ...goal, currentAmount: goal.currentAmount + amount });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Target className="text-[#10b981]" /> Gestão de Objetivos
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Sincronizado com saldo disponível: <span className="text-[#10b981]">{currentBalance.toLocaleString()} Kz</span></p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="p-2 bg-[#10b981] text-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#10b981]/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-[#111] p-6 rounded-3xl border border-[#10b981]/30 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Novo Planeamento</h3>
            <button type="button" onClick={() => setShowAdd(false)} className="text-gray-600 hover:text-white"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block ml-1">Descrição</label>
              <input 
                type="text"
                placeholder="Ex: Reserva de Emergência"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-2xl px-4 py-4 outline-none focus:border-[#10b981] text-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 block ml-1">Montante Alvo (Kz)</label>
              <input 
                type="number"
                placeholder="0"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="w-full bg-black border border-white/5 rounded-2xl px-4 py-4 outline-none focus:border-[#10b981] text-sm transition-all"
                required
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-[#10b981] text-black py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-[#10b981]/10 mt-2">
            Iniciar Objetivo
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.length > 0 ? (
          goals.map(goal => {
            const missingFromTarget = Math.max(0, goal.targetAmount - goal.currentAmount);
            const deficitReal = Math.max(0, missingFromTarget - currentBalance);
            const canCoverNow = currentBalance >= missingFromTarget;
            
            // Percentagens
            const savedProgress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const balanceContribution = Math.min(100 - savedProgress, (currentBalance / goal.targetAmount) * 100);
            const totalCoverage = Math.min(100, ((goal.currentAmount + currentBalance) / goal.targetAmount) * 100);

            return (
              <div key={goal.id} className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] space-y-6 relative group overflow-hidden transition-all hover:border-[#10b981]/20">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="font-bold text-lg mb-0.5">{goal.title}</h4>
                    <p className="text-[10px] text-[#10b981] font-bold uppercase tracking-widest">
                      {savedProgress >= 100 ? 'Meta Alcançada' : 'Monitorização de Ativos'}
                    </p>
                  </div>
                  <button 
                    onClick={() => onDelete(goal.id)}
                    className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-end mb-1">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Cobertura Total</span>
                        <span className="text-xl font-black text-white">{Math.round(totalCoverage)}%</span>
                    </div>
                    <div className="text-right flex flex-col">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Alvo</span>
                        <span className="text-xs font-bold text-gray-400">{goal.targetAmount.toLocaleString()} Kz</span>
                    </div>
                  </div>

                  {/* Barra de Progresso Multinível */}
                  <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-white/5 flex">
                    {/* Parte já guardada */}
                    <div 
                      className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                      style={{ width: `${savedProgress}%` }}
                    ></div>
                    {/* Parte coberta pelo saldo atual */}
                    <div 
                      className="h-full bg-[#10b981]/30 transition-all duration-1000 ease-out border-l border-white/10" 
                      style={{ width: `${balanceContribution}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest px-1">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                        <span>Guardado ({Math.round(savedProgress)}%)</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]/40"></div>
                        <span>Saldo em Carteira ({Math.round(balanceContribution)}%)</span>
                    </div>
                  </div>
                  
                  {/* Cálculos de Saldo Disponível */}
                  <div className="bg-black/60 p-5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Falta p/ Conclusão:</span>
                      <span className="text-xs font-bold text-white">{missingFromTarget.toLocaleString()} Kz</span>
                    </div>
                    
                    {missingFromTarget > 0 && (
                      <div className="pt-3 border-t border-white/5">
                        {canCoverNow ? (
                          <div className="flex items-center gap-3 text-[#10b981]">
                            <div className="p-1.5 bg-[#10b981]/10 rounded-lg"><TrendingUp size={12} /></div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest">Status: Pronto para Alocar</span>
                              <span className="text-[10px] text-gray-400 leading-tight">O seu saldo atual cobre 100% do que falta.</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-orange-400">
                            <div className="p-1.5 bg-orange-400/10 rounded-lg"><AlertCircle size={12} /></div>
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest">Défice Externo</span>
                              <span className="text-[10px] text-gray-400 leading-tight">Mesmo com saldo total, faltam <span className="text-white font-bold">{deficitReal.toLocaleString()} Kz</span>.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleDeposit(goal)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#10b981]/5 hover:bg-[#10b981] text-[#10b981] hover:text-black rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] border border-[#10b981]/10 transition-all relative z-10"
                >
                  <PiggyBank size={16} /> Alimentar Meta
                </button>
                
                {/* Visual Glow */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#10b981]/10 blur-[80px] rounded-full group-hover:bg-[#10b981]/20 transition-all"></div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center space-y-4 bg-[#111] border border-dashed border-white/5 rounded-[3rem]">
            <div className="inline-flex p-6 bg-black rounded-full text-gray-800">
               <Target size={40} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.3em]">Nenhum objetivo ativo</p>
              <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Defina metas para calcular a cobertura do seu saldo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsView;
