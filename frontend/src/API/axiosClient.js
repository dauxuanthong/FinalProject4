import axios from "axios";
import queryString from "query-string";

//set ip default config http requests
const axiosClient = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      "content-type": "application/json",
    },
    paramsSerializer: params => queryString.stringify(params),
});

//handle token here
axiosClient.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("accessToken"))?.accessToken;
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//handle data
axiosClient.interceptors.response.use(
    (response) => {
      if (response && response.data) {
        return response.data;
      }
      return response;
    },
    (error) => {
      if(error.response.status === 403){
        localStorage.removeItem("status");
      };
      throw error;
    }
  );  
export default axiosClient;