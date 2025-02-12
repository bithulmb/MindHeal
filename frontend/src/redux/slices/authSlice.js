import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/constants";
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const token = localStorage.getItem(ACCESS_TOKEN)

const initialState = {
    user : token ? jwtDecode(token) : null,
    token : token,
    role : token ? jwtDecode(token).role : null,
    isAuthenticated : !!token,
    loading : false,
    error : null
}

export const AuthSlice = createSlice({
    name : "auth",
    initialState,
    reducers : {
        // loginStart : (state) => {
        //     state.loading = true
        //     state.error = null

        // },
        loginSuccess : (state, action) => {
            
            const access = action.payload.token
                        
            const decoded = jwtDecode(access)

            state.token = access
            state.isAuthenticated = true
            state.user = decoded
            state.role = action.payload.role
            state.loading = false

            
           
        },

        // loginFailure : (state,action) => {
        //     state.error = action.payload
        //     state.loading = false
        // },

        logout : (state) => {
            
            
            state.user = null
            state.token = null
            state.isAuthenticated = false

        }
    }
})

export const {loginStart,loginSuccess,loginFailure,logout} = AuthSlice.actions
export default AuthSlice.reducer