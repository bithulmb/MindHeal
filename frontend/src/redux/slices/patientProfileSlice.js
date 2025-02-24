import api from "@/components/api/api";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchPatientProfile = createAsyncThunk(
    'patientProfileSlice/fetchPatientProfile',
    async (_, {rejectWithValue} ) => {
        
        try {
            
            const response = await api.get('/api/user/profile/')

            localStorage.setItem('userProfile', JSON.stringify(response.data));
            return response.data
        } catch (error) {
            console.log("error while fetching patient profile",error)
            return rejectWithValue(error.response?.data || "Error fetching patient profile")
        }
    }
)


const storedProfile = localStorage.getItem('userProfile');

const patientProfileSlice = createSlice({
    name : 'patientProfileSlice',
    initialState : {
        profile : storedProfile ? JSON.parse(storedProfile) : null,
        loading : false,
        error : null
    },
    reducers : {
        resetPatientProfile: (state) => {
            state.profile = null;
            state.loading = false;
            state.error = null;
        },

        setPatientProfile : (state, action) => {
            state.profile = action.payload
        }
      },
    extraReducers : (builder) => {
        builder
            .addCase(fetchPatientProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPatientProfile.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload
                
            })
            .addCase(fetchPatientProfile.rejected, (state,action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default patientProfileSlice.reducer
export const { resetPatientProfile, setPatientProfile} = patientProfileSlice.actions