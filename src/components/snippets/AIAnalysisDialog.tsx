import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AIAnalysisDialogProps {
  code: string;
  language: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIAnalysisDialog = ({ code, language, open, onOpenChange }: AIAnalysisDialogProps) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-snippet', {
        body: { code, language }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze code');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Code Analysis
          </DialogTitle>
        </DialogHeader>
        
        {!analysis ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-muted-foreground text-center">
              Get instant AI-powered insights about your code quality, potential improvements, and best practices.
            </p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
              {analysis}
            </div>
            <Button onClick={handleAnalyze} variant="outline" className="mt-4" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Re-analyzing...
                </>
              ) : (
                'Re-analyze'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
