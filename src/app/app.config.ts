import { ApplicationConfig, provideZonelessChangeDetection, provideBrowserGlobalErrorListeners, Provider } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { Armchair, Package, Banknote, CreditCard, ShoppingBag } from 'lucide-angular';

const lucideIcons: Provider = {
  provide: LUCIDE_ICONS,
  multi: true,
  useValue: new LucideIconProvider({ Armchair, Package, Banknote, CreditCard, ShoppingBag }),
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    lucideIcons,
  ],
};
