import { configureStore } from "@reduxjs/toolkit"
import AuthSliceReducer from "@/redux/slices/authSlice"


const store = configureStore({
    reducer : {
        auth : AuthSliceReducer,
    }
})

export default store