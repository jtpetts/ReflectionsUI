function reflectionsApiUrl() {
  return process.env.REACT_APP_REFLECTIONS_API;
}

function reflectionsSentryDSN() {
  return process.env.REACT_SENTRY_DSN;
}

const env = { reflectionsApiUrl, reflectionsSentryDSN };
export default env;
