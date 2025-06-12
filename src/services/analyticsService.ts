import { appInsights } from '../appInsights';

export const AnalyticsService = {
  trackEvent(name: string, properties?: { [key: string]: any }) {
    appInsights.trackEvent({ name }, properties);
  },

  trackPageView(name?: string, url?: string) {
    appInsights.trackPageView({ name, uri: url });
  },

  trackException(error: Error, properties?: { [key: string]: any }) {
    appInsights.trackException({ error, properties });
  },

  trackMetric(name: string, average: number, properties?: { [key: string]: any }) {
    appInsights.trackMetric({ name, average }, properties);
  },

  trackTrace(message: string, properties?: { [key: string]: any }) {
    appInsights.trackTrace({ message }, properties);
  },

  setUserContext(userId: string, accountId?: string) {
    appInsights.setAuthenticatedUserContext(userId, accountId);
  },

  clearUserContext() {
    appInsights.clearAuthenticatedUserContext();
  }
}; 