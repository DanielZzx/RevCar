import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { credenciaisInterceptor } from './shared/credenciais.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Captura erros globais do navegador e os repassa ao Angular.
    provideBrowserGlobalErrorListeners(),
    // Registra as rotas definidas em app.routes.ts.
    provideRouter(routes),
    // Cliente HTTP com o interceptor que envia o cookie de sessão em todas as chamadas.
    provideHttpClient(withInterceptors([credenciaisInterceptor]))
  ]
};
