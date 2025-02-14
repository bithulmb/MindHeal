import { ACCESS_TOKEN } from "@/utils/constants/constants";
import axios from "axios";
import { refreshAccessToken, userLogout } from "./apiutils";

//creating axios api instance
const api = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL,
    headers : {
        "Content-Type" : 'application/json',
    },
})

//modifying requests using axios interceptors by adding access token in headers
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN)

        if (accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }

)

//modifying response to handle refresh tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (originalRequest.url.includes("api/auth/login/") && error.response.status === 401) {
            return Promise.reject(error); 
        }

        if (error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true
            try {
                await refreshAccessToken();

                return api(originalRequest)
            }
            catch(refreshError){
                console.error("refresh token failed", refreshError)
                userLogout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)



export default api
