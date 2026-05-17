import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MenuData } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class ImageCacheService {
  private readonly doc = inject(DOCUMENT);
  private readonly cache = new Map<string, HTMLImageElement>();
  readonly status = signal({ total: 0, loaded: 0 });

  preloadFromMenu(menu: MenuData): void {
    const urls: string[] = [];
    for (const cat of Object.values(menu)) {
      if (cat.imageUrl) urls.push(cat.imageUrl);
      for (const item of Object.values(cat.items ?? {})) {
        if (item.imageUrl) urls.push(item.imageUrl);
      }
    }
    this.preload(urls);
  }

  preload(urls: string[]): void {
    const fresh = urls.filter(u => u && !this.cache.has(u));
    if (!fresh.length) return;
    this.status.update(s => ({ total: s.total + fresh.length, loaded: s.loaded }));
    for (const url of fresh) {
      const img = this.doc.createElement('img') as HTMLImageElement;
      img.onload = () => this.status.update(s => ({ ...s, loaded: s.loaded + 1 }));
      img.onerror = () => this.status.update(s => ({ ...s, loaded: s.loaded + 1 }));
      img.src = url;
      this.cache.set(url, img);
    }
  }
}
