
import React from 'react';
import { 
  Utensils, 
  Bus, 
  Gamepad2, 
  Zap, 
  HeartPulse, 
  ShoppingBag, 
  MoreHorizontal,
  TrendingUp,
  PiggyBank,
  Settings,
  Bell,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.FOOD]: <Utensils size={18} />,
  [Category.TRANSPORT]: <Bus size={18} />,
  [Category.LEISURE]: <Gamepad2 size={18} />,
  [Category.UTILITIES]: <Zap size={18} />,
  [Category.HEALTH]: <HeartPulse size={18} />,
  [Category.SHOPPING]: <ShoppingBag size={18} />,
  [Category.INCOME]: <TrendingUp size={18} />,
  [Category.SAVINGS]: <PiggyBank size={18} />,
  [Category.OTHERS]: <MoreHorizontal size={18} />,
};

export const UI_ICONS = {
  Settings: <Settings size={18} />,
  Bell: <Bell size={18} />,
  Shield: <ShieldCheck size={18} />,
  Alert: <AlertCircle size={18} />
};

export const BRAND_GREEN = '#10b981'; // Emerald 500
export const DEEP_GREEN = '#064e3b';  // Emerald 900
