import { App } from 'vue';
import { AnalyticsService } from '../services/analyticsService';
import { useAuth0 } from '@auth0/auth0-vue';
import { watch } from 'vue';
import { appInsights } from '../appInsights';

export const analyticsPlugin = {
  install(app: App) {
    if (import.meta.env.PROD) {
      app.config.globalProperties.$appInsights = appInsights;
      
      // Track user authentication state
      const { isAuthenticated, user } = useAuth0();
      
      watch(isAuthenticated, (authenticated) => {
        if (authenticated && user.value?.sub) {
          AnalyticsService.setUserContext(user.value.sub);
        } else {
          AnalyticsService.clearUserContext();
        }
      });
    }
  }
}; 