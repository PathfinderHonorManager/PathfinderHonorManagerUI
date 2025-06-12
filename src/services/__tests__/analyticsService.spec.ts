import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../analyticsService';
import { appInsights } from '../../appInsights';

vi.mock('../../appInsights', () => ({
  appInsights: {
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    trackException: vi.fn(),
    trackMetric: vi.fn(),
    trackTrace: vi.fn(),
    setAuthenticatedUserContext: vi.fn(),
    clearAuthenticatedUserContext: vi.fn()
  }
}));

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track events', () => {
    const eventName = 'test_event';
    const properties = { key: 'value' };
    
    AnalyticsService.trackEvent(eventName, properties);
    
    expect(appInsights.trackEvent).toHaveBeenCalledWith(
      { name: eventName },
      properties
    );
  });

  it('should track page views', () => {
    const pageName = 'test_page';
    const url = '/test-url';
    
    AnalyticsService.trackPageView(pageName, url);
    
    expect(appInsights.trackPageView).toHaveBeenCalledWith({
      name: pageName,
      uri: url
    });
  });

  it('should track exceptions', () => {
    const error = new Error('test error');
    const properties = { key: 'value' };
    
    AnalyticsService.trackException(error, properties);
    
    expect(appInsights.trackException).toHaveBeenCalledWith(
      { error, properties }
    );
  });

  it('should track metrics', () => {
    const name = 'test_metric';
    const average = 42;
    const properties = { key: 'value' };
    
    AnalyticsService.trackMetric(name, average, properties);
    
    expect(appInsights.trackMetric).toHaveBeenCalledWith(
      { name, average },
      properties
    );
  });

  it('should track traces', () => {
    const message = 'test trace';
    const properties = { key: 'value' };
    
    AnalyticsService.trackTrace(message, properties);
    
    expect(appInsights.trackTrace).toHaveBeenCalledWith(
      { message },
      properties
    );
  });

  it('should set user context', () => {
    const userId = 'test-user-id';
    const accountId = 'test-account-id';
    
    AnalyticsService.setUserContext(userId, accountId);
    
    expect(appInsights.setAuthenticatedUserContext).toHaveBeenCalledWith(
      userId,
      accountId
    );
  });

  it('should clear user context', () => {
    AnalyticsService.clearUserContext();
    
    expect(appInsights.clearAuthenticatedUserContext).toHaveBeenCalled();
  });
}); 