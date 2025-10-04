'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  availableKategori: string[];
  availableTags: string[];
  selectedKategori: string[];
  selectedTags: string[];
  sortBy: string;
  onKategoriChange: (kategori: string[]) => void;
  onTagsChange: (tags: string[]) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  availableKategori,
  availableTags,
  selectedKategori,
  selectedTags,
  sortBy,
  onKategoriChange,
  onTagsChange,
  onSortChange,
  onClearFilters,
}: ProductFiltersProps) {
  const hasActiveFilters = selectedKategori.length > 0 || selectedTags.length > 0;

  const handleKategoriToggle = (kategori: string) => {
    if (selectedKategori.includes(kategori)) {
      onKategoriChange(selectedKategori.filter((k) => k !== kategori));
    } else {
      onKategoriChange([...selectedKategori, kategori]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold">Filter</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs sm:text-sm"
          >
            <X className="mr-1 h-3 w-3" />
            <span className="hidden sm:inline">Hapus Filter</span>
            <span className="sm:hidden">Hapus</span>
          </Button>
        )}
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <Label className="text-xs sm:text-sm font-medium">Urutkan</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="mt-2 h-9 sm:h-10 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru" className="text-sm">Terbaru</SelectItem>
              <SelectItem value="harga_terendah" className="text-sm">Harga Terendah</SelectItem>
              <SelectItem value="harga_tertinggi" className="text-sm">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {availableKategori.length > 0 && (
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium">Kategori</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3">
              {availableKategori.map((kategori) => (
                <div key={kategori} className="flex items-center space-x-2">
                  <Checkbox
                    id={`kategori-${kategori}`}
                    checked={selectedKategori.includes(kategori)}
                    onCheckedChange={() => handleKategoriToggle(kategori)}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`kategori-${kategori}`}
                    className="text-xs sm:text-sm font-normal leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {kategori}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {availableTags.length > 0 && (
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-xs sm:text-sm font-medium">Tag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 sm:space-y-3">
              {availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`tag-${tag}`}
                    className="text-xs sm:text-sm font-normal leading-relaxed cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
