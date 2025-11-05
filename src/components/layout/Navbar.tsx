import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Code, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { KeyboardShortcuts } from '@/components/ui/KeyboardShortcuts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="glass-strong border-b border-border/50 sticky top-0 z-40 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 hover-scale transition-transform">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center glow-hover animate-float">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold gradient-text text-glow">
              Code Snippet Saver
            </h1>
          </div>

          {/* Theme & Shortcuts */}
          {user && (
            <div className="flex items-center gap-2">
              <KeyboardShortcuts onNewSnippet={() => {
                const btn = document.getElementById('new-snippet-btn');
                btn?.click();
              }} />
              <ThemeToggle />
            </div>
          )}

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium">
                      {((user.name || user.email)?.charAt(0) || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-foreground">{user.name || user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 glass border-border/50 shadow-elegant animate-scale-in"
              >
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary font-medium">
                      {((user.name || user.email)?.charAt(0) || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-primary/10">
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}