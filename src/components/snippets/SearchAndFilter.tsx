import React, { useState } from 'react';
import { useSnippets } from '@/contexts/SnippetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, Filter, X, Tag, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  favoritesOnly?: boolean;
  onFavoritesOnlyChange?: (favoritesOnly: boolean) => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedTags,
  onTagsChange,
  favoritesOnly = false,
  onFavoritesOnlyChange,
}: SearchAndFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { languages, allTags } = useSnippets();

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(selectedTags.filter((t) => t !== tag));
  };

  const clearFilters = () => {
    onSearchChange('');
    onLanguageChange('');
    onTagsChange([]);
    onFavoritesOnlyChange?.(false);
  };

  const hasActiveFilters =
    searchQuery || selectedLanguage || selectedTags.length > 0 || favoritesOnly;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets by title, description, code, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 ${
            showFilters ? 'bg-primary/10 border-primary/50' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {favoritesOnly && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-yellow-500/30 text-yellow-500 bg-yellow-500/10"
            >
              <Star className="w-3 h-3 fill-current" />
              Favorites
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => onFavoritesOnlyChange?.(false)}
              />
            </Badge>
          )}
          {selectedLanguage && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-primary/30 text-primary"
            >
              {selectedLanguage}
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => onLanguageChange('')}
              />
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:text-destructive"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4 glass border-border/50 animate-fade-in">
          <div className="space-y-4">
            {/* Favorites Filter */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorites-only"
                checked={favoritesOnly}
                onCheckedChange={(checked) => onFavoritesOnlyChange?.(!!checked)}
              />
              <label
                htmlFor="favorites-only"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                <Star
                  className={`w-4 h-4 ${
                    favoritesOnly ? 'fill-yellow-500 text-yellow-500' : ''
                  }`}
                />
                Show favorites only
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Language Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select
                  value={selectedLanguage || 'all'}
                  onValueChange={(value) =>
                    onLanguageChange(value === 'all' ? '' : value)
                  }
                >
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/50">
                    <SelectItem value="all">All languages</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-primary/10 hover:border-primary/50'
                        }`}
                        onClick={() =>
                          selectedTags.includes(tag)
                            ? removeTag(tag)
                            : addTag(tag)
                        }
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                {allTags.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
