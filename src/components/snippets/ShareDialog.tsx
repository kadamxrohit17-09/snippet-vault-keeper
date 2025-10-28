import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, Loader2, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareDialogProps {
  snippetId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareDialog = ({ snippetId, open, onOpenChange }: ShareDialogProps) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState<number>(7);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-share-link', {
        body: { snippetId, expiresInDays }
      });

      if (error) throw error;

      setShareUrl(data.shareUrl);
      toast.success('Share link generated!');
    } catch (error) {
      console.error('Share error:', error);
      toast.error('Failed to generate share link');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Snippet
          </DialogTitle>
        </DialogHeader>
        
        {!shareUrl ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expires">Expires in (days)</Label>
              <Input
                id="expires"
                type="number"
                min="1"
                max="365"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Leave as 0 for no expiration
              </p>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Generate Share Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Share URL</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly />
                <Button onClick={handleCopy} size="icon" variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={() => setShareUrl('')} variant="outline" className="w-full">
              Generate New Link
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
