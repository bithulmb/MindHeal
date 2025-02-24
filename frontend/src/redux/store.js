import { configureStore } from "@reduxjs/toolkit"
import AuthSliceReducer from "@/redux/slices/authSlice"
import psychologistProfileReducer from  "@/redux/slices//psychologistProfileSlice"
import patientProfileReducer from  "@/redux/slices//patientProfileSlice"

const store = configureStore({
    reducer : {
        auth : AuthSliceReducer,
        psychologistProfile : psychologistProfileReducer,
        patientProfile : patientProfileReducer,
    }
})

export default store