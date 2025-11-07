import { createSlice } from "@reduxjs/toolkit";

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
    },
});

export const { setSingleDonor, setDonors, setSearchDonorByText } = donorSlice.actions;
export default donorSlice.reducer;
