import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Ponto de entrada: inicializa o componente raiz com a configuração global da aplicação.
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
