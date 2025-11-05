import React, { useState } from 'react';
import { CodeSnippet } from '@/contexts/SnippetContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Edit, Trash2, Code, Calendar, Star, Copy as CopyIcon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSnippets } from '@/contexts/SnippetContext';

interface SnippetCardProps {
  snippet: CodeSnippet;
  onEdit: (snippet: CodeSnippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const [showFullCode, setShowFullCode] = useState(false);
  
  const { toast } = useToast();
  const { toggleFavorite, incrementCopyCount } = useSnippets();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      incrementCopyCount(snippet.id);
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

  const handleToggleFavorite = () => {
    toggleFavorite(snippet.id);
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
    <Card className="glass border-border/50 shadow-card card-hover animate-fade-in group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
              <Code className="w-4 h-4 text-primary animate-pulse-glow" />
              <span className="gradient-text">{snippet.title}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              {snippet.description}
            </CardDescription>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className={`hover:bg-primary/10 hover:text-primary ${snippet.isFavorite ? 'text-yellow-500 fill-yellow-500' : ''}`}
              title={snippet.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`w-4 h-4 ${snippet.isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
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
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 hover:glow transition-all hover-scale">
            {snippet.language}
          </Badge>
          {snippet.tags.map((tag, index) => (
            <Badge key={tag} variant="secondary" className="text-xs hover-scale" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formatDate(snippet.updatedAt)}
          </div>
          {snippet.copyCount && snippet.copyCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CopyIcon className="w-3 h-3" />
              <span>{snippet.copyCount} {snippet.copyCount === 1 ? 'copy' : 'copies'}</span>
            </div>
          )}
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