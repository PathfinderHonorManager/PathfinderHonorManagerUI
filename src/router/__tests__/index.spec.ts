import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsService } from '../../services/analyticsService';
import { analyticsAfterEach } from '../index';
import type { RouteLocationNormalized } from 'vue-router';

vi.mock('../../services/analyticsService', () => ({
  AnalyticsService: {
    trackPageView: vi.fn()
  }
}));

describe('Router Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should track page views after navigation', () => {
    const to = {
      name: 'test-page',
      fullPath: '/test-path'
    } as RouteLocationNormalized;

    analyticsAfterEach(to);

    expect(AnalyticsService.trackPageView).toHaveBeenCalledWith(
      'test-page',
      '/test-path'
    );
  });

  it('should handle undefined page name', () => {
    const to = {
      name: undefined,
      fullPath: '/test-path'
    } as RouteLocationNormalized;

    analyticsAfterEach(to);

    expect(AnalyticsService.trackPageView).toHaveBeenCalledWith(
      undefined,
      '/test-path'
    );
  });
}); 