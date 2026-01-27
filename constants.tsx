
import React from 'react';
import { 
  Utensils, 
  Bus, 
  Gamepad2, 
  Zap, 
  HeartPulse, 
  ShoppingBag, 
  MoreHorizontal 
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.FOOD]: <Utensils size={18} />,
  [Category.TRANSPORT]: <Bus size={18} />,
  [Category.LEISURE]: <Gamepad2 size={18} />,
  [Category.UTILITIES]: <Zap size={18} />,
  [Category.HEALTH]: <HeartPulse size={18} />,
  [Category.SHOPPING]: <ShoppingBag size={18} />,
  [Category.OTHERS]: <MoreHorizontal size={18} />,
};

export const NEON_GREEN = '#00FF7F';
