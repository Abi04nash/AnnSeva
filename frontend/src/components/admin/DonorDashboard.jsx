import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { Card, CardContent } from "../ui/card";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";

const DonorDashboard = () => {
    const { user } = useSelector((store) => store.auth);
    const { allAdminDonations } = useSelector((store) => store.donation);

    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const allApplicants = await Promise.all(
                    allAdminDonations.map(async (donation) => {
                        const res = await axios.get(
                            `${APPLICATION_API_END_POINT}/${donation._id}/applicants`,
                            { withCredentials: true }
                        );


                        return res.data.donation?.applications || [];
                    })
                );

                setApplicants(allApplicants.flat());
            } catch (error) {
                console.error("Failed to fetch applicants", error);
            }
        };

        if (allAdminDonations.length > 0) {
            fetchApplicants();
        }
    }, [allAdminDonations]);



    const totalDonations = allAdminDonations.length;
    const activeDonations = allAdminDonations.filter(d => d.status === "active").length;

    const totalApplications = applicants.length;
    const approved = applicants.filter(a => a.status?.toLowerCase() === "approved").length;
    const declined = applicants.filter(a => a.status?.toLowerCase() === "declined").length;

    return (
        <>
            <Navbar />
            <div className="max-w-6xl px-2 mx-auto my-10">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold"><span className="text-[#F83002]">Welcome</span>, {user?.fullname} 👋</h1>
                </div>


                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <Card><CardContent className="p-3 font-semibold">Total Donations<br />{totalDonations}</CardContent></Card>
                    <Card><CardContent className="p-3 font-semibold">Active<br />{activeDonations}</CardContent></Card>
                    <Card><CardContent className="p-3 font-semibold">Applications<br />{totalApplications}</CardContent></Card>
                    <Card><CardContent className="p-3 font-semibold text-green-600">Approved<br />{approved}</CardContent></Card>
                    <Card><CardContent className="p-3 font-semibold text-red-600">Declined<br />{declined}</CardContent></Card>
                </div>


                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-3">Recent <span className="text-[#F83002]">Donations</span></h2>
                    <div className="bg-white rounded-md shadow p-4">
                        {allAdminDonations.slice(0, 5).map((d) => (
                            <div key={d._id} className="flex justify-between border-b py-2 text-sm">
                                <span>{d.title}</span>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium
                                    ${d.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-gray-600"
                                    }`}>{d.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DonorDashboard;
