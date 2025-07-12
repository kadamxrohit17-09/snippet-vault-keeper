import React, { useState, useEffect } from 'react';
import { CodeSnippet, useSnippets } from '@/contexts/SnippetContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, X, Plus, Code } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

interface SnippetFormProps {
  snippet?: CodeSnippet;
  onClose: () => void;
  onSave?: () => void;
}

export function SnippetForm({ snippet, onClose, onSave }: SnippetFormProps) {
  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);
  const [newTag, setNewTag] = useState('');
  
  const { addSnippet, updateSnippet, languages } = useSnippets();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !code.trim()) {
      toast({
        title: "Error",
        description: "Title and code are required",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save snippets",
        variant: "destructive"
      });
      return;
    }

    const snippetData = {
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      tags: tags.filter(tag => tag.trim()),
      userId: user.id
    };

    if (snippet) {
      updateSnippet(snippet.id, snippetData);
      toast({
        title: "Updated!",
        description: "Snippet has been updated successfully",
      });
    } else {
      addSnippet(snippetData);
      toast({
        title: "Saved!",
        description: "New snippet has been created successfully",
      });
    }

    onSave?.();
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl bg-gradient-card border-border/50 shadow-card animate-scale-in my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            {snippet ? 'Edit Snippet' : 'Create New Snippet'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter snippet title"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary/50">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/50">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this snippet does"
                className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="h-4 w-4 p-0 hover:bg-destructive/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <div className="border border-border/50 rounded-md overflow-hidden">
                <Editor
                  height="300px"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollbar: {
                      alwaysConsumeMouseWheel: false,
                    },
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {snippet ? 'Update Snippet' : 'Save Snippet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}