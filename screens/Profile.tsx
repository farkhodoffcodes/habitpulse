
import React, { useState } from 'react';
import { useHabit } from '../context';
import { Icon } from '../components/Icon';
import { Habit, User, HabitLog } from '../types';
import { AVATARS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-Screen Components ---

interface MainProfileProps {
    onNavigate: (screen: 'main' | 'stats' | 'settings') => void;
    user: User;
    habits: Habit[];
    setIsAvatarModalOpen: (open: boolean) => void;
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    newName: string;
    setNewName: (name: string) => void;
    handleSaveName: () => void;
}

const MainProfile: React.FC<MainProfileProps> = ({ onNavigate, user, habits, setIsAvatarModalOpen, isEditing, setIsEditing, newName, setNewName, handleSaveName }) => {
    const totalCompleted = habits.reduce((acc, curr) => acc + (Object.values(curr.logs) as HabitLog[]).filter(l => l.completed).length, 0);

    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
        >
             <div className="flex justify-end mb-2">
                <button 
                    onClick={() => onNavigate('settings')}
                    className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                    <Icon name="settings" size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center mb-8">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="w-28 h-28 rounded-3xl p-1 border-2 border-primary border-dashed mb-4 relative group"
                >
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-[20px] object-cover bg-zinc-800" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border-2 border-dark-bg text-primary shadow-lg">
                        <Icon name="image" size={16} />
                    </div>
                </motion.button>
                
                {isEditing ? (
                    <div className="flex gap-2 items-center mb-1">
                        <input 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-zinc-800 text-white px-4 py-2 rounded-xl outline-none border border-primary/50 w-40 text-center font-bold text-xl"
                            autoFocus
                        />
                        <button onClick={handleSaveName} className="p-2.5 bg-primary rounded-xl text-black">
                            <Icon name="check" size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2 items-center mb-1">
                        <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                        <button onClick={() => setIsEditing(true)} className="text-zinc-500 hover:text-primary transition-colors p-1">
                            <Icon name="note" size={16} />
                        </button>
                    </div>
                )}
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 mt-2">Level 5 Explorer</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Icon name="flame" size={80} />
                    </div>
                    <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-3">
                        <Icon name="flame" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-white mb-0.5">
                         {user.currentStreak}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Current Streak</span>
                </div>
                <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex flex-col items-center text-center relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Icon name="check" size={80} />
                    </div>
                    <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-3">
                        <Icon name="check" size={20} />
                    </div>
                    <span className="text-3xl font-bold text-white mb-0.5">
                        {totalCompleted}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Total Done</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
                <MenuItem icon="chart" label="Statistics" onClick={() => onNavigate('stats')} />
                <MenuItem icon="trophy" label="Achievements" onClick={() => {}} badge="Coming Soon" />
                <MenuItem icon="share" label="Share Profile" onClick={() => {}} />
                
                <div className="h-px bg-zinc-900 my-2" />
                
                 <button className="w-full flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10 group hover:bg-red-500/10 transition-colors active:scale-[0.98]">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                             <Icon name="log-out" size={20} />
                         </div>
                         <span className="font-medium text-red-400">Log Out</span>
                     </div>
                </button>
            </div>
        </motion.div>
    );
};

interface StatsScreenProps {
    onBack: () => void;
    habits: Habit[];
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onBack, habits }) => {
    // Calculate stats
    const totalLogs = habits.reduce((acc, h) => acc + Object.keys(h.logs).length, 0);
    const completedLogs = habits.reduce((acc, h) => acc + (Object.values(h.logs) as HabitLog[]).filter(l => l.completed).length, 0);
    const completionRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;
    
    // Find best day
    const dayCounts = [0,0,0,0,0,0,0];
    habits.forEach(h => {
        (Object.values(h.logs) as HabitLog[]).forEach(l => {
            if(l.completed) {
                const day = new Date(l.date).getDay();
                dayCounts[day]++;
            }
        });
    });
    const maxDayVal = Math.max(...dayCounts);
    const maxDayIndex = dayCounts.indexOf(maxDayVal);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const bestDay = maxDayVal > 0 ? days[maxDayIndex] : '-';

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
        >
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                    <Icon name="arrow-right" size={20} className="rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Lifetime Stats</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                 <StatCard title="Best Day" value={bestDay} icon="calendar" color="text-purple-400" bgColor="bg-purple-400/10" />
                 <StatCard title="Completion" value={`${completionRate}%`} icon="zap" color="text-yellow-400" bgColor="bg-yellow-400/10" />
                 <StatCard title="Total Habits" value={habits.length.toString()} icon="book" color="text-blue-400" bgColor="bg-blue-400/10" />
                 <StatCard title="Total Logs" value={completedLogs.toString()} icon="check" color="text-green-400" bgColor="bg-green-400/10" />
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Habit Performance</h3>
            <div className="space-y-3 overflow-y-auto no-scrollbar pb-20">
                {habits.map(h => {
                    const hLogs = Object.values(h.logs) as HabitLog[];
                    const hDone = hLogs.filter(l => l.completed).length;
                    return (
                        <div key={h.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.color} text-black`}>
                                    <Icon name={h.icon} size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{h.title}</p>
                                    <p className="text-xs text-zinc-500">{hDone} completions</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-bold text-zinc-300">
                                    {hLogs.length > 0 ? Math.round((hDone / hLogs.length) * 100) : 0}%
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    );
};

interface SettingsScreenProps {
    onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
    const [toggles, setToggles] = useState({
        notifications: true,
        sounds: false,
        haptics: true,
        darkMode: true
    });

    const toggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({...prev, [key]: !prev[key]}));
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
        >
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                    <Icon name="arrow-right" size={20} className="rotate-180" />
                </button>
                <h2 className="text-2xl font-bold text-white">Settings</h2>
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-2">General</h3>
                    <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
                        <ToggleRow label="Notifications" icon="bell" isOn={toggles.notifications} onToggle={() => toggle('notifications')} />
                        <div className="h-px bg-zinc-800 mx-4" />
                        <ToggleRow label="Sound Effects" icon="volume" isOn={toggles.sounds} onToggle={() => toggle('sounds')} />
                        <div className="h-px bg-zinc-800 mx-4" />
                        <ToggleRow label="Haptic Feedback" icon="zap" isOn={toggles.haptics} onToggle={() => toggle('haptics')} />
                    </div>
                </section>

                <section>
                     <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-2">Appearance</h3>
                     <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
                        <ToggleRow label="Dark Mode" icon="moon" isOn={toggles.darkMode} onToggle={() => toggle('darkMode')} />
                     </div>
                </section>

                <section>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-2">Account</h3>
                    <div className="bg-zinc-900/50 rounded-3xl border border-zinc-800 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Icon name="shield" size={16} />
                                </div>
                                <span className="font-medium text-white">Privacy Policy</span>
                            </div>
                            <Icon name="chevron-right" size={16} className="text-zinc-600" />
                        </button>
                         <div className="h-px bg-zinc-800 mx-4" />
                         <button className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                    <Icon name="note" size={16} />
                                </div>
                                <span className="font-medium text-white">Terms of Service</span>
                            </div>
                            <Icon name="chevron-right" size={16} className="text-zinc-600" />
                        </button>
                    </div>
                </section>
                
                <div className="flex justify-center pt-4 pb-8">
                     <p className="text-zinc-700 text-xs font-medium">Version 1.0.2 (Build 240)</p>
                </div>
            </div>
        </motion.div>
    )
}

// --- Helper Components ---

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    color: string;
    bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
        <div className={`w-10 h-10 ${bgColor} ${color} rounded-xl flex items-center justify-center mb-2`}>
            <Icon name={icon} size={20} />
        </div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">{title}</p>
    </div>
);

interface ToggleRowProps {
    label: string;
    icon: string;
    isOn: boolean;
    onToggle: () => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({ label, icon, isOn, onToggle }) => (
    <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                <Icon name={icon} size={16} />
            </div>
            <span className="font-medium text-white">{label}</span>
        </div>
        <button 
            onClick={onToggle}
            className={`w-12 h-7 rounded-full transition-colors relative ${isOn ? 'bg-primary' : 'bg-zinc-800'}`}
        >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${isOn ? 'left-6' : 'left-1'}`} />
        </button>
    </div>
);

interface MenuItemProps {
    icon: string;
    label: string;
    onClick: () => void;
    badge?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, badge }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all group active:scale-[0.98]"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                <Icon name={icon} size={20} />
            </div>
            <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            {badge && <span className="bg-zinc-800 text-zinc-500 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide">{badge}</span>}
            <Icon name="chevron-right" size={16} className="text-zinc-700 group-hover:text-zinc-500" />
        </div>
    </button>
);


// --- Main Component ---

export const Profile: React.FC = () => {
    const { user, updateUser, habits } = useHabit();
    const [view, setView] = useState<'main' | 'stats' | 'settings'>('main');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user.name);

    const handleSaveName = () => {
        updateUser({ name: newName });
        setIsEditing(false);
    };

    const handleAvatarSelect = (avatar: string) => {
        updateUser({ avatar });
        setIsAvatarModalOpen(false);
    };

    return (
        <div className="pb-28 pt-8 px-4 h-full overflow-y-auto no-scrollbar relative">
            
            {/* Avatar Selection Modal */}
            <AnimatePresence>
                {isAvatarModalOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAvatarModalOpen(false)}
                            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                             initial={{ y: '100%' }}
                             animate={{ y: 0 }}
                             exit={{ y: '100%' }}
                             transition={{ type: "spring", damping: 25, stiffness: 300 }}
                             className="fixed bottom-0 left-0 right-0 bg-dark-bg border-t border-zinc-800 rounded-t-3xl z-50 p-6 pb-12 max-w-md mx-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Choose Avatar</h3>
                                <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 bg-zinc-900 rounded-full text-zinc-400">
                                    <Icon name="x" size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {AVATARS.map((avatar, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAvatarSelect(avatar)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${user.avatar === avatar ? 'border-primary scale-110 shadow-lg shadow-primary/20' : 'border-zinc-800 hover:border-zinc-600'}`}
                                    >
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover bg-zinc-900" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {view === 'main' && (
                    <MainProfile 
                        key="main"
                        onNavigate={setView} 
                        user={user} 
                        habits={habits}
                        setIsAvatarModalOpen={setIsAvatarModalOpen}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        newName={newName}
                        setNewName={setNewName}
                        handleSaveName={handleSaveName}
                    />
                )}
                {view === 'stats' && (
                    <StatsScreen 
                        key="stats"
                        onBack={() => setView('main')} 
                        habits={habits}
                    />
                )}
                {view === 'settings' && (
                    <SettingsScreen 
                        key="settings"
                        onBack={() => setView('main')} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
