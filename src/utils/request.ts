const axios = require('axios');
export const backendServerUrl = 'http://localhost:9003/';
export const restServerBaseUrl = `${backendServerUrl}api/`;

export const publicApiBaseUrl = `${restServerBaseUrl}public/`;

export const restServerApi = axios.create({
  baseURL: restServerBaseUrl,
});

export const publicApi = axios.create({ baseURL: publicApiBaseUrl });
