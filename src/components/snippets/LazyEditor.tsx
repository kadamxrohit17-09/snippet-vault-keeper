import { lazy, Suspense } from 'react';
import type { EditorProps } from '@monaco-editor/react';

// Lazy load Monaco Editor to reduce initial bundle size
const MonacoEditor = lazy(() => 
  import('@monaco-editor/react').then(module => ({ default: module.Editor }))
);

interface LazyEditorProps extends EditorProps {}

export function LazyEditor(props: LazyEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[300px] bg-muted/50 border border-border/50 rounded-md">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading editor...</p>
          </div>
        </div>
      }
    >
      <MonacoEditor {...props} />
    </Suspense>
  );
}

