import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/constants"
import api from "./api"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";


// export const checkRefreshToken = async () => {
//     try {
//         const response = await api.get('/api/auth/check-refresh-token/');
//         if (response.status === 200) {
//             console.log("Refresh token exists");
//             return true;
//         }
//     } catch (error) {
//         console.error("Refresh token not found or invalid:", error.response?.data || error.message);
//         return false;
//     }
// };


export const refreshAccessToken = async () => {


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

        const navigate = useNavigate()
        navigate(`/`)
        console.log("logged out succesfully")
        

    }  catch (error) {
        console.error('Logout failed:', error.response?.data);
      }
}