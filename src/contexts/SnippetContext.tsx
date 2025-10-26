import React, { createContext, useContext, useState, useEffect } from 'react';
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
}

interface SnippetContextType {
  snippets: CodeSnippet[];
  addSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSnippet: (id: string, snippet: Partial<CodeSnippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  searchSnippets: (query: string, filters?: { language?: string; tags?: string[] }) => CodeSnippet[];
  languages: string[];
  allTags: string[];
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

  const searchSnippets = (query: string, filters?: { language?: string; tags?: string[] }) => {
    return snippets.filter(snippet => {
      const matchesQuery = !query || 
        snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        snippet.description.toLowerCase().includes(query.toLowerCase()) ||
        snippet.code.toLowerCase().includes(query.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesLanguage = !filters?.language || snippet.language === filters.language;
      
      const matchesTags = !filters?.tags?.length || 
        filters.tags.some(tag => snippet.tags.includes(tag));

      return matchesQuery && matchesLanguage && matchesTags;
    });
  };

  const allTags = Array.from(
    new Set(snippets.flatMap(snippet => snippet.tags))
  ).sort();

  return (
    <SnippetContext.Provider value={{
      snippets,
      addSnippet,
      updateSnippet,
      deleteSnippet,
      searchSnippets,
      languages: LANGUAGES,
      allTags
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
