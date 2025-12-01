
import React from 'react';
import { 
  Footprints, 
  Laptop, 
  Droplet, 
  Book, 
  Calendar, 
  Settings, 
  Share2, 
  Search, 
  ChevronDown, 
  Check, 
  FileText, 
  Image as ImageIcon, 
  Home, 
  Plus, 
  BarChart2, 
  User,
  ArrowRight,
  Flame,
  X,
  Bell,
  Volume2,
  Moon,
  Shield,
  LogOut,
  ChevronRight,
  Trophy,
  Zap
} from 'lucide-react';

export const Icon = ({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) => {
  const props = { size, className };
  
  switch (name) {
    case 'footprints': return <Footprints {...props} />;
    case 'laptop': return <Laptop {...props} />;
    case 'droplet': return <Droplet {...props} />;
    case 'book': return <Book {...props} />;
    case 'calendar': return <Calendar {...props} />;
    case 'settings': return <Settings {...props} />;
    case 'share': return <Share2 {...props} />;
    case 'search': return <Search {...props} />;
    case 'chevron-down': return <ChevronDown {...props} />;
    case 'chevron-right': return <ChevronRight {...props} />;
    case 'check': return <Check {...props} />;
    case 'note': return <FileText {...props} />;
    case 'image': return <ImageIcon {...props} />;
    case 'home': return <Home {...props} />;
    case 'plus': return <Plus {...props} />;
    case 'chart': return <BarChart2 {...props} />;
    case 'user': return <User {...props} />;
    case 'arrow-right': return <ArrowRight {...props} />;
    case 'flame': return <Flame {...props} />;
    case 'x': return <X {...props} />;
    case 'bell': return <Bell {...props} />;
    case 'volume': return <Volume2 {...props} />;
    case 'moon': return <Moon {...props} />;
    case 'shield': return <Shield {...props} />;
    case 'log-out': return <LogOut {...props} />;
    case 'trophy': return <Trophy {...props} />;
    case 'zap': return <Zap {...props} />;
    default: return null;
  }
};
