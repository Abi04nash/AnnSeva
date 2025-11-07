import { createSlice } from "@reduxjs/toolkit";

const donationSlice = createSlice({
    name: "donation",
    initialState: {
        allDonations: [],
        allAdminDonations: [],
        singleDonation: null,
        searchDonationByText: "",
        allAppliedDonations: [],  
        searchedQuery: "",
    },
    reducers: {
        // actions
        setAllDonations: (state, action) => {
            state.allDonations = action.payload;
        },
        setSingleDonation: (state, action) => {
            state.singleDonation = action.payload;
        },
        setAllAdminDonations: (state, action) => {
            state.allAdminDonations = action.payload;
        },
        setSearchDonationByText: (state, action) => {
            state.searchDonationByText = action.payload;
        },
        setAllAppliedDonations: (state, action) => {  
            state.allAppliedDonations = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
    },
});

export const {
    setAllDonations,
    setSingleDonation,
    setAllAdminDonations,
    setSearchDonationByText,
    setAllAppliedDonations,   
    setSearchedQuery,
} = donationSlice.actions;

export default donationSlice.reducer;
