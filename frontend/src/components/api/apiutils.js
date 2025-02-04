import { ACCESS_TOKEN } from "@/utils/constants/constants"
import api from "./api"

export const refreshAccessToken = async () => {
    try {
        const response = await api.post('/api/auth/login/refresh/')
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
        await api.post("/api/auth/logout/")
        localStorage.removeItem(ACCESS_TOKEN)
        console.log("logged out succesfully")

    }  catch (error) {
        console.error('Logout failed:', error.response?.data);
      }
}