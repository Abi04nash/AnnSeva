import { createSlice } from "@reduxjs/toolkit";

// ✅ Define initialState separately
const initialState = {
    allDonations: [],
    allAdminDonations: [],
    singleDonation: null,
    searchDonationByText: "",
    allAppliedDonations: [],
    searchedQuery: "",
    refetchTrigger: false,
};

const donationSlice = createSlice({
    name: "donation",
    initialState,
    reducers: {
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
        setRefetchTrigger: (state) => {
            state.refetchTrigger = !state.refetchTrigger;
        },

        // ✅ Properly reset to initialState
       
    },
});

export const {
    setAllDonations,
    setSingleDonation,
    setAllAdminDonations,
    setSearchDonationByText,
    setAllAppliedDonations,
    setSearchedQuery,
    setRefetchTrigger,
    clearDonationState,
} = donationSlice.actions;

export default donationSlice.reducer;
