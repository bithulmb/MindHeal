import api from "@/components/api/api";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchPsychologistProfile = createAsyncThunk(
    'psychologistProfileSlice/fetchPsychologistProfile',
    async (_, {rejectWithValue} ) => {
        
        try {
            
            const response = await api.get('/api/psychologist/profile/')
            return response.data
        } catch (error) {
            console.log("error while fetching psychologist profile",error)
            return rejectWithValue(error.response?.data || "Error fetching psychologist profile")
        }
    }
)


const psychologistProfileSlice = createSlice({
    name : 'psychologistProfileSlice',
    initialState : {
        profile : null,
        loading : false,
        error : null
    },
    reducers : {
        resetProfile: (state) => {
            state.profile = null;
            state.loading = false;
            state.error = null;
        },

        setProfile : (state, action) => {
            state.profile = action.payload
        }
      },
    extraReducers : (builder) => {
        builder
            .addCase(fetchPsychologistProfile.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPsychologistProfile.fulfilled, (state, action) => {
                state.loading = false
                state.profile = action.payload
                
            })
            .addCase(fetchPsychologistProfile.rejected, (state,action) => {
                state.loading = false
                state.error = action.payload
            })

    }
})

export default psychologistProfileSlice.reducer
export const { resetProfile, setProfile} = psychologistProfileSlice.actions