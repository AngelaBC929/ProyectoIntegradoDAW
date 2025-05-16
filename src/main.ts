import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configuración de las rutas
    importProvidersFrom(HttpClientModule), // Se asegura de que HttpClient esté disponible
  ],
}).catch(err => console.error(err));
