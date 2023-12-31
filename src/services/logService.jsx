import * as Sentry from "@sentry/browser";
import env from "../env";

export function init() {
  Sentry.init({
    dsn: env.reflectionsSentryDSN()
  });
}

export function log(error) {
  Sentry.captureException(error);
}

//SENTRY_DSN environment variable
//$ npm install @sentry/browser@4.3.0
// Sentry.captureException(err);
const logService = {
  init,
  log
};
export default logService;
