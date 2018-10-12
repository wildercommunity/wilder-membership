const axios = require('axios');


export function registerUser(params) {
  const api = axios.create({
    baseURL: 'https://wildercommunity.eu.auth0.com',
  });

  return api.post('/dbconnections/signup', {
    client_id: 'CTshhEjYm6IzQHHX1VYsUFS8ZyNc8aZQ',
    email: params.email,
    password: params.password,
    connection: 'Username-Password-Authentication',
    user_metadata: { firstName: params.firstname,
      lastName: params.lastname,
      role: 'MEMBER',
      stripeCustomerId: params.stripeCustomerId},
  });
}
