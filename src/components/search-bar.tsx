
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <form onSubmit={handleSearch} className="glass-card rounded-xl p-1 flex items-center animate-fade-in">
      <Input
        type="search"
        placeholder="Search Google..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button 
        type="submit" 
        size="sm" 
        variant="ghost" 
        className="text-gray-400 hover:text-white"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default SearchBar;
