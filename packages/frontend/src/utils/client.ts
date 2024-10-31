import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import paths from 'api';

const fetchClient = createFetchClient<paths>({
  baseUrl: "http://localhost:52600/api/",
});

const $api = createClient(fetchClient);

export {
  $api,
  fetchClient as client
};