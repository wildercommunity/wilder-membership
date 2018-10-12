const axios = require('axios');

export function subscribe(params) {
  const api = axios.create({
    baseURL: 'https://wt-fc9679ce7625bd77470a290dafbfa8f9-0.sandbox.auth0-extend.com/stripe-subscription',
  });

  return api.post('/subscribe', {
    email: params.email,
    source: params.source,
  });
}
