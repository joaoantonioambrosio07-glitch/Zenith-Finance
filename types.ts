
export enum Category {
  FOOD = 'Alimentação',
  TRANSPORT = 'Transporte',
  LEISURE = 'Lazer',
  UTILITIES = 'Serviços',
  HEALTH = 'Saúde',
  SHOPPING = 'Compras',
  OTHERS = 'Outros'
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: string;
}

export type ViewType = 'dashboard' | 'history' | 'add';
