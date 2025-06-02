import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { jwtInterceptor } from './app/shared/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configuración de las rutas
    importProvidersFrom(HttpClientModule), // Se asegura de que HttpClient esté disponible
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ],
}).catch(err => console.error(err));
