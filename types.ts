
export enum Category {
  FOOD = 'Alimentação',
  TRANSPORT = 'Transporte',
  LEISURE = 'Lazer',
  UTILITIES = 'Serviços',
  HEALTH = 'Saúde',
  SHOPPING = 'Compras',
  INCOME = 'Rendimento',
  SAVINGS = 'Poupança',
  OTHERS = 'Outros'
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
  type: TransactionType;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  reminders: boolean;
  goalMilestones: boolean;
  budgetAlerts: boolean;
  reminderTime: string;
}

export type ViewType = 'dashboard' | 'history' | 'add' | 'goals' | 'settings';
