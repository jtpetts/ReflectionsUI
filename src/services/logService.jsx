import * as Sentry from "@sentry/browser";
import env from "../env";

export function init() {
  // Sentry.init({
  //   dsn: env.reflectionsSentryDSN()
  // });

  const dsn = 'https://262540e1e48c472396769becb58ae9ce@o204294.ingest.sentry.io/1327145';

  Sentry.init({
    dsn: dsn
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
