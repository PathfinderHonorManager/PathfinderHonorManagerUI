import { App } from 'vue';
import { appInsights } from '../appInsights';

export const analyticsPlugin = {
  install(app: App) {
    if (import.meta.env.PROD) {
      app.config.globalProperties.$appInsights = appInsights;
    }
  }
}; 