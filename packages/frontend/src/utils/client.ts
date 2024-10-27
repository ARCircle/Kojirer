import createFetchClient from "openapi-fetch";
import paths from 'api';

const fetchClient = createFetchClient<paths>({
  baseUrl: "http://localhost:52600/api/",
});

export default fetchClient;