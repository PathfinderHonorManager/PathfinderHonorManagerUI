import axios from "axios";
import { useAuth0 } from "@auth0/auth0-vue";

export function jwtInterceptor() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  axios.interceptors.request.use((request) => {
    // add auth header with jwt if account is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(
      "https://pathfinderhonormanager.azurewebsites.net"
    );

    if (isAuthenticated && isApiUrl) {
      const token = getAccessTokenSilently();
      request.headers.common.Authorization = `Bearer ${token}`;
    }

    return request;
  });
}
