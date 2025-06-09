import paths from 'api';
import createFetchClient from 'openapi-fetch';
import createClient from 'openapi-react-query';

const fetchClient = createFetchClient<paths>({
  baseUrl: '/api/',
});

const $api = createClient(fetchClient);

export { $api, fetchClient as client };
