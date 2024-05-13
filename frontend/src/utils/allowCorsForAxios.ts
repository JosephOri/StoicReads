import { Axios } from 'axios';
export const allowCorsForAxios = (axios: Axios) => {
  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
};
