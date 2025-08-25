import 'zone.js/node';
import { bootstrapApplication } from '@angular/platform-browser';
import { config as appConfig } from './app/app.config.server';
import { App } from './app/app';

export default function() {
  return bootstrapApplication(App, appConfig);
}
