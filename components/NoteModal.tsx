
import React, { useState } from 'react';
import { Icon } from './Icon';
import { motion } from 'framer-motion';

interface NoteModalProps {
    initialNote?: string;
    habitTitle: string;
    onSave: (note: string) => void;
    onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ initialNote = '', habitTitle, onSave, onClose }) => {
    const [note, setNote] = useState(initialNote);

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
                initial={{ y: '100%' }} 
                animate={{ y: 0 }} 
                exit={{ y: '100%' }}
                className="bg-dark-card w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-zinc-800 shadow-2xl relative z-10"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">Add Note</h3>
                        <p className="text-zinc-500 text-sm">{habitTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white">
                        <Icon name="x" size={20} />
                    </button>
                </div>

                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="How did it go today? Note down your thoughts..."
                    className="w-full h-40 bg-zinc-900 rounded-2xl p-4 text-white placeholder-zinc-600 resize-none border border-zinc-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 mb-6 transition-all"
                    autoFocus
                />

                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-zinc-800 text-zinc-300 font-bold py-3.5 rounded-xl hover:bg-zinc-700 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onSave(note)}
                        className="flex-1 bg-primary text-black font-bold py-3.5 rounded-xl hover:bg-primary-hover active:scale-95 transition-all shadow-lg shadow-primary/20"
                    >
                        Save Note
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
