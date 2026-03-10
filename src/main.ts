import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .then(() => {
    const appLoader = document.getElementById('app-loader');

    if (!appLoader) {
      return;
    }

    appLoader.classList.add('hidden');
    window.setTimeout(() => appLoader.remove(), 250);
  })
  .catch((err) => console.error(err));
