import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/constants"
import api from "./api"


export const checkRefreshToken = async () => {
    try {
        const response = await api.get('/api/auth/check-refresh-token/');
        if (response.status === 200) {
            console.log("Refresh token exists");
            return true;
        }
    } catch (error) {
        console.error("Refresh token not found or invalid:", error.response?.data || error.message);
        return false;
    }
};


export const refreshAccessToken = async () => {
    // const refreshTokenExists = await checkRefreshToken();

    // if (!refreshTokenExists) {
    //     console.error("No refresh token found");
    //     throw new Error("No refresh token found");
    // }

    try {
        const refresh = localStorage.getItem(REFRESH_TOKEN)
        const response = await api.post('/api/auth/login/refresh/',{refresh})
        const { access } = response.data

        localStorage.setItem(ACCESS_TOKEN,access)
        console.log("access token refreshed")
    }
    catch (error){
        console.error("failed to refresh access token", error.response?.data)
        throw error
    }
}

export const userLogout = async () => {
    try{
        // await api.post("/api/auth/logout/")
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(REFRESH_TOKEN)
        console.log("logged out succesfully")

    }  catch (error) {
        console.error('Logout failed:', error.response?.data);
      }
}