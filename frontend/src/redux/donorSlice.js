import { createSlice } from "@reduxjs/toolkit";


// ✅ Define initialState OUTSIDE the slice
const initialState = {
  singleDonor: null,
  donors: [],
  searchDonorByText: "",
};

const donorSlice = createSlice({
    name: "donor",
    initialState: {
        singleDonor: null,
        donors: [],
        searchDonorByText: "",
    },
    reducers: {
        // actions
        setSingleDonor: (state, action) => {
            state.singleDonor = action.payload;
        },
        setDonors: (state, action) => {
            state.donors = action.payload;
        },
        setSearchDonorByText: (state, action) => {
            state.searchDonorByText = action.payload;
        },
        
        clearDonorState: (state) => {
            // State ko wapas initial state par reset kar dein
            Object.assign(state, initialState);
        }
    },
});

export const { setSingleDonor, setDonors, setSearchDonorByText , clearDonorState } = donorSlice.actions;
export default donorSlice.reducer;
