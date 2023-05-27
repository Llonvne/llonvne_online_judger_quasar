import axios from 'axios';

// 这是后台服务的地址配置处，请最后不加斜杠
export const backendServerUrl = 'http://localhost:9003';

// 此处定义了后台服务器的 Spring Data REST Api 访问根地址
export const restServerBaseUrl = `${backendServerUrl}/api`;
// 此处定义了后台服务器其余 Api 访问地址
export const publicApiBaseUrl = `${backendServerUrl}`;

export const restServerApi = axios.create({ baseURL: restServerBaseUrl });

export const publicApi = axios.create({ baseURL: publicApiBaseUrl });

export enum ApiType {
  LOGIN = 'signin',
  REGISTER = 'signup',
}
