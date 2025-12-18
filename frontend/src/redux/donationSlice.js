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
        // clearDonationState: () => initialState,

        updateDonationInList: (state, action) => {
            state.allDonations = state.allDonations.map(donation =>
                // Ensure hum dono ko string mein convert karke match karein
                donation._id.toString() === action.payload._id.toString()
                    ? action.payload
                    : donation
            );
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
    setRefetchTrigger,
    clearDonationState,
    updateDonationInList,
} = donationSlice.actions;

export default donationSlice.reducer;
