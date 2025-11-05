import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isFavorite?: boolean;
  copyCount?: number;
}

interface SnippetContextType {
  snippets: CodeSnippet[];
  addSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSnippet: (id: string, snippet: Partial<CodeSnippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  incrementCopyCount: (id: string) => Promise<void>;
  searchSnippets: (query: string, filters?: { language?: string; tags?: string[]; favoritesOnly?: boolean }) => CodeSnippet[];
  languages: string[];
  allTags: string[];
  favoriteSnippets: CodeSnippet[];
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust',
  'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'scss', 'sql', 'bash', 'json', 'yaml', 'xml'
];

export function SnippetProvider({ children }: { children: React.ReactNode }) {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSnippets();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel('snippets-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'snippets',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Realtime update:', payload);
            fetchSnippets(); // Refresh snippets on any change
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setSnippets([]);
    }
  }, [user]);

  const fetchSnippets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching snippets:', error);
        toast.error('Failed to load snippets');
        return;
      }

      const mappedSnippets: CodeSnippet[] = (data || []).map((snippet: any) => ({
        id: snippet.id,
        userId: snippet.user_id,
        title: snippet.title,
        description: snippet.description || '',
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags || [],
        createdAt: new Date(snippet.created_at),
        updatedAt: new Date(snippet.updated_at),
        isFavorite: snippet.is_favorite || false,
        copyCount: snippet.copy_count || 0,
      }));

      setSnippets(mappedSnippets);
    } catch (error) {
      console.error('Exception fetching snippets:', error);
      toast.error('Failed to load snippets');
    }
  };

  const addSnippet = async (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      toast.error('You must be logged in to add snippets');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('snippets')
        .insert({
          user_id: user.id,
          title: snippet.title,
          description: snippet.description,
          code: snippet.code,
          language: snippet.language,
          tags: snippet.tags,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding snippet:', error);
        toast.error('Failed to add snippet');
        return;
      }

      const newSnippet: CodeSnippet = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        code: data.code,
        language: data.language,
        tags: data.tags || [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        isFavorite: data.is_favorite || false,
        copyCount: data.copy_count || 0,
      };

      setSnippets((prev) => [newSnippet, ...prev]);
      toast.success('Snippet added successfully');
    } catch (error) {
      console.error('Exception adding snippet:', error);
      toast.error('Failed to add snippet');
    }
  };

  const updateSnippet = async (id: string, updates: Partial<CodeSnippet>) => {
    if (!user) {
      toast.error('You must be logged in to update snippets');
      return;
    }

    try {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.code !== undefined) updateData.code = updates.code;
      if (updates.language !== undefined) updateData.language = updates.language;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;

      const { data, error } = await supabase
        .from('snippets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating snippet:', error);
        toast.error('Failed to update snippet');
        return;
      }

      setSnippets((prev) =>
        prev.map((snippet) =>
          snippet.id === id
            ? {
                ...snippet,
                ...updates,
                isFavorite: data.is_favorite ?? snippet.isFavorite,
                copyCount: data.copy_count ?? snippet.copyCount,
                updatedAt: new Date(data.updated_at),
              }
            : snippet
        )
      );
      toast.success('Snippet updated successfully');
    } catch (error) {
      console.error('Exception updating snippet:', error);
      toast.error('Failed to update snippet');
    }
  };

  const deleteSnippet = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete snippets');
      return;
    }

    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting snippet:', error);
        toast.error('Failed to delete snippet');
        return;
      }

      setSnippets((prev) => prev.filter((snippet) => snippet.id !== id));
      toast.success('Snippet deleted successfully');
    } catch (error) {
      console.error('Exception deleting snippet:', error);
      toast.error('Failed to delete snippet');
    }
  };

  const toggleFavorite = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to favorite snippets');
      return;
    }

    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;

    const newFavoriteState = !snippet.isFavorite;

    try {
      const { error } = await supabase
        .from('snippets')
        .update({ is_favorite: newFavoriteState })
        .eq('id', id);

      if (error) {
        console.error('Error toggling favorite:', error);
        toast.error('Failed to update favorite');
        return;
      }

      setSnippets((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isFavorite: newFavoriteState } : s
        )
      );

      toast.success(newFavoriteState ? 'Added to favorites' : 'Removed from favorites');
    } catch (error) {
      console.error('Exception toggling favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const incrementCopyCount = async (id: string) => {
    if (!user) return;

    try {
      const snippet = snippets.find(s => s.id === id);
      const newCount = (snippet?.copyCount || 0) + 1;

      const { error } = await supabase
        .from('snippets')
        .update({ copy_count: newCount })
        .eq('id', id);

      if (error) {
        console.error('Error incrementing copy count:', error);
        return; // Fail silently for copy tracking
      }

      setSnippets((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, copyCount: newCount } : s
        )
      );
    } catch (error) {
      console.error('Exception incrementing copy count:', error);
      // Fail silently for copy tracking
    }
  };

  const searchSnippets = useCallback((query: string, filters?: { language?: string; tags?: string[]; favoritesOnly?: boolean }) => {
    return snippets.filter(snippet => {
      const matchesQuery = !query || 
        snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        snippet.description.toLowerCase().includes(query.toLowerCase()) ||
        snippet.code.toLowerCase().includes(query.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesLanguage = !filters?.language || snippet.language === filters.language;
      
      const matchesTags = !filters?.tags?.length || 
        filters.tags.some(tag => snippet.tags.includes(tag));

      const matchesFavorites = !filters?.favoritesOnly || snippet.isFavorite === true;

      return matchesQuery && matchesLanguage && matchesTags && matchesFavorites;
    });
  }, [snippets]);

  const favoriteSnippets = useMemo(() => 
    snippets.filter(snippet => snippet.isFavorite === true),
    [snippets]
  );

  const allTags = useMemo(() => 
    Array.from(new Set(snippets.flatMap(snippet => snippet.tags))).sort(),
    [snippets]
  );

  return (
    <SnippetContext.Provider value={{
      snippets,
      addSnippet,
      updateSnippet,
      deleteSnippet,
      toggleFavorite,
      incrementCopyCount,
      searchSnippets,
      languages: LANGUAGES,
      allTags,
      favoriteSnippets
    }}>
      {children}
    </SnippetContext.Provider>
  );
}

export function useSnippets() {
  const context = useContext(SnippetContext);
  if (context === undefined) {
    throw new Error('useSnippets must be used within a SnippetProvider');
  }
  return context;
}
