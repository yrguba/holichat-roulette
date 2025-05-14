import axios from "axios";
import Cookies from "universal-cookie";

const http = axios.create();
const cookies = new Cookies();

const excludesMessages = ["Unauthorized"];

interface OptionsType {
  path: string;
  domain: string;
}

const options: OptionsType = {
  path: "/",
  domain: window.location.hostname,
};

const onRespSuccess = (resp: any) => {
  const respNotification = resp.data.message;

  if (respNotification) {
  }
};

const onRespError = (error: any) => {};

http.interceptors.request.use(
  (config: any) => {
    // @ts-ignore
    const token = cookies.get("cookie_name", options);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (resp) => {
    onRespSuccess(resp);
    return resp;
  },
  (error) => {
    console.warn("Interceptor error:", error, error.response);
    onRespError(error);
    return Promise.reject(error);
  },
);

export default http;
