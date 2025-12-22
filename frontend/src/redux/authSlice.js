import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        updateUserSavedDonations: (state, action) => {
      const donationId = action.payload;

      if (!state.user) return;

      const alreadySaved = state.user.savedDonations.includes(donationId);

      if (alreadySaved) {
        state.user.savedDonations = state.user.savedDonations.filter(
          id => id !== donationId
        );
      } else {
        state.user.savedDonations.push(donationId);
      }
    }
    }
});
export const {setLoading, setUser, updateUserSavedDonations} = authSlice.actions;
export default authSlice.reducer;