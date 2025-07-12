import React, { useState } from 'react';
import { CodeSnippet } from '@/contexts/SnippetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Edit, Trash2, Code, Calendar } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SnippetCardProps {
  snippet: CodeSnippet;
  onEdit: (snippet: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const [showFullCode, setShowFullCode] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const previewCode = snippet.code.length > 200 ? 
    snippet.code.substring(0, 200) + '...' : 
    snippet.code;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-[1.02] animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              {snippet.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              {snippet.description}
            </CardDescription>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(snippet)}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(snippet.id)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
            {snippet.language}
          </Badge>
          {snippet.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <Calendar className="w-3 h-3" />
          {formatDate(snippet.updatedAt)}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative">
          <SyntaxHighlighter
            language={snippet.language}
            style={vscDarkPlus}
            customStyle={{
              background: 'hsl(var(--code-bg))',
              border: '1px solid hsl(var(--code-border))',
              borderRadius: '6px',
              fontSize: '0.875rem',
              margin: 0,
              maxHeight: showFullCode ? 'none' : '200px',
              overflow: showFullCode ? 'visible' : 'hidden'
            }}
            className="text-sm"
          >
            {showFullCode ? snippet.code : previewCode}
          </SyntaxHighlighter>
          
          {snippet.code.length > 200 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowFullCode(!showFullCode)}
              className="mt-2 p-0 h-auto text-primary hover:text-primary-glow"
            >
              {showFullCode ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}