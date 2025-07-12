import React, { useState, useMemo } from 'react';
import { useSnippets, CodeSnippet } from '@/contexts/SnippetContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SnippetCard } from '@/components/snippets/SnippetCard';
import { SnippetForm } from '@/components/snippets/SnippetForm';
import { SearchAndFilter } from '@/components/snippets/SearchAndFilter';
import { Plus, Code, BookOpen, Tag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<CodeSnippet | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [deleteSnippetId, setDeleteSnippetId] = useState<string | null>(null);

  const { snippets, deleteSnippet } = useSnippets();
  const { user } = useAuth();
  const { toast } = useToast();

  // Filter snippets for current user
  const userSnippets = snippets.filter(snippet => snippet.userId === user?.id);

  // Apply search and filters
  const filteredSnippets = useMemo(() => {
    return userSnippets.filter(snippet => {
      const matchesSearch = !searchQuery || 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLanguage = !selectedLanguage || snippet.language === selectedLanguage;
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => snippet.tags.includes(tag));

      return matchesSearch && matchesLanguage && matchesTags;
    });
  }, [userSnippets, searchQuery, selectedLanguage, selectedTags]);

  // Statistics
  const stats = useMemo(() => {
    const languageCounts = userSnippets.reduce((acc, snippet) => {
      acc[snippet.language] = (acc[snippet.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLanguage = Object.entries(languageCounts).sort(([,a], [,b]) => b - a)[0];

    return {
      total: userSnippets.length,
      languages: Object.keys(languageCounts).length,
      tags: new Set(userSnippets.flatMap(s => s.tags)).size,
      topLanguage: topLanguage ? topLanguage[0] : 'None'
    };
  }, [userSnippets]);

  const handleEdit = (snippet: CodeSnippet) => {
    setEditingSnippet(snippet);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setDeleteSnippetId(id);
  };

  const confirmDelete = () => {
    if (deleteSnippetId) {
      deleteSnippet(deleteSnippetId);
      setDeleteSnippetId(null);
      toast({
        title: "Deleted",
        description: "Snippet has been deleted successfully",
      });
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSnippet(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Code Snippets</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your reusable code snippets
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          variant="hero"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Snippet
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
            <Code className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.languages}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.tags}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Language</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.topLanguage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      {/* Snippets Grid */}
      {filteredSnippets.length === 0 ? (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {userSnippets.length === 0 ? 'No snippets yet' : 'No matching snippets'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {userSnippets.length === 0 
              ? 'Start building your code snippet library by creating your first snippet.'
              : 'Try adjusting your search or filters to find what you\'re looking for.'
            }
          </p>
          {userSnippets.length === 0 && (
            <Button
              onClick={() => setShowForm(true)}
              variant="hero"
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create Your First Snippet
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Snippet Form Modal */}
      {showForm && (
        <SnippetForm
          snippet={editingSnippet}
          onClose={handleCloseForm}
          onSave={() => {
            // Refresh any necessary data
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteSnippetId} onOpenChange={() => setDeleteSnippetId(null)}>
        <AlertDialogContent className="bg-background border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the code snippet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}