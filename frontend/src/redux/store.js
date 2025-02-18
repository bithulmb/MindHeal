import { configureStore } from "@reduxjs/toolkit"
import AuthSliceReducer from "@/redux/slices/authSlice"
import psychologistProfileReducer from  "@/redux/slices//psychologistProfileSlice"

const store = configureStore({
    reducer : {
        auth : AuthSliceReducer,
        psychologistProfile : psychologistProfileReducer,
    }
})

export default store