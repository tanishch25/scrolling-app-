import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';

export default function HomeLayout() {
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('');

  const { data: sections, isLoading } = useQuery({
    queryKey: ['homeSections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  const addSection = useMutation({
    mutationFn: async () => {
      if (!newTitle.trim()) return;
      const { error } = await supabase.from('home_sections').insert({
        title: newTitle,
        genre: newGenre.toLowerCase() || null,
        order_index: sections?.length || 0
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeSections'] });
      setNewTitle('');
      setNewGenre('');
    }
  });

  const deleteSection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('home_sections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeSections'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Home Screen Layout</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage the dynamic categories displayed on the mobile app home screen.</p>
        </div>
      </div>

      <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Section</h2>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-400 mb-1">Section Heading (e.g. "Epic Romances")</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
              placeholder="Display title"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-zinc-400 mb-1">Filter Genre (e.g. "romance" - optional)</label>
            <input 
              type="text" 
              value={newGenre}
              onChange={e => setNewGenre(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none"
              placeholder="Leave blank for all"
            />
          </div>
          <button 
            onClick={() => addSection.mutate()}
            disabled={!newTitle.trim() || addSection.isPending}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center h-[42px]"
          >
            <Plus size={18} className="mr-2" />
            Add Row
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sections?.map((section, index) => (
          <div key={section.id} className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-black/50 rounded-lg cursor-grab active:cursor-grabbing text-zinc-500 hover:text-white">
                <GripVertical size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">{section.title}</h3>
                <p className="text-zinc-400 text-sm">
                  {section.genre ? `Filters by genre: "${section.genre}"` : 'Shows all content'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => deleteSection.mutate(section.id)}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {sections?.length === 0 && (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <p className="text-zinc-500">No dynamic sections added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
