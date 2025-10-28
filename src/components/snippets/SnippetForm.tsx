import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { LazyEditor } from './LazyEditor';
import { snippetSchema, type SnippetFormData } from '@/lib/validations';

interface SnippetFormProps {
  snippet?: CodeSnippet;
  onClose: () => void;
  onSave?: () => void;
}

export function SnippetForm({ snippet, onClose, onSave }: SnippetFormProps) {
  const [newTag, setNewTag] = useState('');
  
  const { addSnippet, updateSnippet, languages } = useSnippets();
  const { user } = useAuth();
  const { toast } = useToast();

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<SnippetFormData>({
    resolver: zodResolver(snippetSchema),
    mode: 'onBlur',
    defaultValues: {
      title: snippet?.title || '',
      description: snippet?.description || '',
      code: snippet?.code || '',
      language: (snippet?.language as SnippetFormData['language']) || 'javascript',
      tags: snippet?.tags || []
    }
  });

  const tags = watch('tags');

  const onSubmit = (data: SnippetFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save snippets",
        variant: "destructive"
      });
      return;
    }

    const snippetData = {
      title: data.title,
      description: data.description || '',
      code: data.code,
      language: data.language,
      tags: data.tags,
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
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setValue('tags', [...tags, trimmedTag], { shouldValidate: true });
      setNewTag('');
    } else if (tags.length >= 10) {
      toast({
        title: "Maximum tags reached",
        description: "You can add up to 10 tags per snippet",
        variant: "destructive"
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Enter snippet title"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
                {errors.language && (
                  <p className="text-sm text-destructive">{errors.language.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe what this snippet does (max 1000 characters)"
                className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tags (max 10)</Label>
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
                  placeholder="Add a tag (max 50 characters)"
                  className="bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="shrink-0"
                  disabled={tags.length >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {errors.tags && (
                <p className="text-sm text-destructive">{errors.tags.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code * (max 50KB)</Label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <div className="border border-border/50 rounded-md overflow-hidden">
                    <LazyEditor
                      height="300px"
                      language={watch('language')}
                      value={field.value}
                      onChange={(value) => field.onChange(value || '')}
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
                )}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
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