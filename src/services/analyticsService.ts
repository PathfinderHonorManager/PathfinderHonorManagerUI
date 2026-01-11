import { appInsights } from '../appInsights';

export const AnalyticsService = {
  trackEvent(name: string, properties?: Record<string, unknown>) {
    appInsights.trackEvent({ name }, properties);
  },

  trackPageView(name?: string, url?: string) {
    appInsights.trackPageView({ name, uri: url });
  },

  trackException(error: Error, properties?: Record<string, unknown>) {
    appInsights.trackException({ error, properties });
  },

  trackMetric(name: string, average: number, properties?: Record<string, unknown>) {
    appInsights.trackMetric({ name, average }, properties);
  },

  trackTrace(message: string, properties?: Record<string, unknown>) {
    appInsights.trackTrace({ message }, properties);
  },

  setUserContext(userId: string, accountId?: string) {
    appInsights.setAuthenticatedUserContext(userId, accountId);
  },

  clearUserContext() {
    appInsights.clearAuthenticatedUserContext();
  }
}; 
