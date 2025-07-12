import React, { createContext, useContext, useState, useEffect } from 'react';

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
  addSnippet: (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSnippet: (id: string, snippet: Partial<CodeSnippet>) => void;
  deleteSnippet: (id: string) => void;
  searchSnippets: (query: string, filters?: { language?: string; tags?: string[] }) => CodeSnippet[];
  languages: string[];
  allTags: string[];
}

const SnippetContext = createContext<SnippetContextType | undefined>(undefined);

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust',
  'php', 'ruby', 'swift', 'kotlin', 'html', 'css', 'scss', 'sql', 'bash', 'json', 'yaml', 'xml'
];

const INITIAL_SNIPPETS: CodeSnippet[] = [
  {
    id: '1',
    title: 'React useState Hook',
    description: 'Basic useState example for managing component state',
    code: `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
    language: 'javascript',
    tags: ['react', 'hooks', 'state'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userId: '1'
  },
  {
    id: '2',
    title: 'Python List Comprehension',
    description: 'Filtering and transforming lists with comprehensions',
    code: `# Filter even numbers and square them
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squared_evens = [x**2 for x in numbers if x % 2 == 0]
print(squared_evens)  # [4, 16, 36, 64, 100]

# Dictionary comprehension
words = ['hello', 'world', 'python']
word_lengths = {word: len(word) for word in words}
print(word_lengths)  # {'hello': 5, 'world': 5, 'python': 6}`,
    language: 'python',
    tags: ['python', 'comprehension', 'functional'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    userId: '1'
  },
  {
    id: '3',
    title: 'CSS Flexbox Layout',
    description: 'Responsive flexbox layout with centering',
    code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
}

.card {
  flex: 1;
  max-width: 300px;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 1rem;
  }
}`,
    language: 'css',
    tags: ['css', 'flexbox', 'responsive', 'layout'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    userId: '1'
  },
  {
    id: '4',
    title: 'SQL Join Query',
    description: 'Complex join query with filtering and aggregation',
    code: `SELECT 
  u.name,
  u.email,
  COUNT(o.id) as order_count,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC
LIMIT 50;`,
    language: 'sql',
    tags: ['sql', 'joins', 'aggregation', 'database'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    userId: '1'
  }
];

export function SnippetProvider({ children }: { children: React.ReactNode }) {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);

  useEffect(() => {
    // Load snippets from localStorage or use initial data
    const stored = localStorage.getItem('snippets');
    if (stored) {
      const parsedSnippets = JSON.parse(stored).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt)
      }));
      setSnippets(parsedSnippets);
    } else {
      setSnippets(INITIAL_SNIPPETS);
      localStorage.setItem('snippets', JSON.stringify(INITIAL_SNIPPETS));
    }
  }, []);

  const saveSnippets = (newSnippets: CodeSnippet[]) => {
    setSnippets(newSnippets);
    localStorage.setItem('snippets', JSON.stringify(newSnippets));
  };

  const addSnippet = (snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSnippet: CodeSnippet = {
      ...snippet,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newSnippets = [...snippets, newSnippet];
    saveSnippets(newSnippets);
  };

  const updateSnippet = (id: string, updates: Partial<CodeSnippet>) => {
    const newSnippets = snippets.map(snippet =>
      snippet.id === id
        ? { ...snippet, ...updates, updatedAt: new Date() }
        : snippet
    );
    saveSnippets(newSnippets);
  };

  const deleteSnippet = (id: string) => {
    const newSnippets = snippets.filter(snippet => snippet.id !== id);
    saveSnippets(newSnippets);
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