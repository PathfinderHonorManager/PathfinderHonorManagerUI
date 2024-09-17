import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const isProd = import.meta.env.PROD;

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: isProd ? 'InstrumentationKey=a2279141-0836-4494-9910-bf67ac9c4de7;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=03912ac7-9943-43f0-93d4-8ebc28108e96' : '',
    disableTelemetry: !isProd,
    disableAjaxTracking: !isProd,
    disableExceptionTracking: !isProd,
    enableAutoRouteTracking: isProd,
  }
});

if (isProd) {
  appInsights.loadAppInsights();
  appInsights.trackPageView();
}