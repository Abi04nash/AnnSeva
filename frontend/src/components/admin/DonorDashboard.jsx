import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { Card, CardContent } from "../ui/card";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList
} from 'recharts';
import {
    Activity,
    Users,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    Utensils,
    Calendar,
    Loader2
} from "lucide-react";
import useGetAllAdminDonations from '@/hooks/useGetAllAdminDonations'

const DonorDashboard = () => {
    useGetAllAdminDonations();

    const { user } = useSelector((store) => store.auth);
    const { allAdminDonations } = useSelector((store) => store.donation);
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState([]);
    const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {

            setIsLoadingApplicants(true);
            try {
                if (allAdminDonations.length === 0) {
                    setApplicants([]);
                    setIsLoadingApplicants(false);
                    return;
                }

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
            } finally {
                setIsLoadingApplicants(false);
            }
        };


        if (allAdminDonations) {
            fetchApplicants();
        }
    }, [allAdminDonations]);

    const totalDonations = allAdminDonations?.length || 0;
    const activeDonations = allAdminDonations?.filter(d => d.status === "active").length || 0;

    const totalApplications = applicants.length;
    const approved = applicants.filter(a => a.status?.toLowerCase() === "approved").length;
    const rejected = applicants.filter(a => a.status?.toLowerCase() === "rejected" || a.status?.toLowerCase() === "declined").length;
    const pending = applicants.filter(a => a.status?.toLowerCase() === "pending").length;

    const applicationStats = [
        { name: 'Approved', value: approved, color: '#22c55e' },
        { name: 'Pending', value: pending, color: '#f59e0b' },
        { name: 'Rejected', value: rejected, color: '#ef4444' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                        <p className="text-gray-500 mt-1">
                            Welcome back, <span className="font-semibold text-[#F83002]">{user?.fullname}</span>!
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/donations/create")}
                        className="bg-[#F83002] hover:bg-[#d92902] text-white px-6 py-2.5 rounded-full font-medium shadow-lg shadow-orange-200 transition-all flex items-center gap-2"
                    >
                        <Utensils className="w-4 h-4"/>
                        Donate Food
                    </button>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-800">{totalDonations}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-full">
                                <Package className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Listings</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-800">{activeDonations}</h3>
                            </div>
                            <div className="p-3 bg-green-50 rounded-full">
                                <Activity className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Applications</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-800">
                                    {isLoadingApplicants ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : totalApplications}
                                </h3>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-full">
                                <Users className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Approved</p>
                                <h3 className="text-3xl font-bold mt-1 text-green-600">
                                    {isLoadingApplicants ? <Loader2 className="w-6 h-6 animate-spin text-green-200" /> : approved}
                                </h3>
                            </div>
                             <div className="p-3 bg-green-50 rounded-full">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <h3 className="text-3xl font-bold mt-1 text-orange-500">
                                    {isLoadingApplicants ? <Loader2 className="w-6 h-6 animate-spin text-orange-200" /> : pending}
                                </h3>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-full">
                            <Clock className="w-8 h-8 text-orange-400" />
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Rejected</p>
                                <h3 className="text-3xl font-bold mt-1 text-red-500">
                                    {isLoadingApplicants ? <Loader2 className="w-6 h-6 animate-spin text-red-200" /> : rejected}
                                </h3>
                            </div>
                            <div className="p-3 bg-red-50 rounded-full">
                            <XCircle className="w-8 h-8 text-red-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">


                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-black">Application Status</h3>
                                <p className="text-sm text-gray-500">Overview of request outcomes</p>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            {isLoadingApplicants ? (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={applicationStats}
                                        layout="vertical"
                                        margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            width={100}
                                            tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <XAxis type="number" hide />
                                        <Tooltip
                                            cursor={{ fill: '#f9fafb' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }}></div>
                                                                <p className="text-sm font-semibold text-gray-700">{data.name}</p>
                                                            </div>
                                                            <p className="text-2xl font-bold text-gray-900">
                                                                {data.value} <span className="text-xs font-medium text-gray-400">requests</span>
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar
                                            dataKey="value"
                                            radius={[0, 6, 6, 0]}
                                            barSize={40}
                                            animationDuration={1500}
                                        >
                                            {applicationStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                            <LabelList
                                                dataKey="value"
                                                position="right"
                                                fill="#6b7280"
                                                fontSize={12}
                                                fontWeight={600}
                                                formatter={(value) => value > 0 ? value : ''}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>


                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-6 text-black">Active vs Inactive</h3>
                        <div className="h-[250px] w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Active', value: activeDonations, color: '#22c55e' },
                                            { name: 'Inactive', value: totalDonations - activeDonations, color: '#e5e7eb' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        <Cell fill="#22c55e" />
                                        <Cell fill="#e5e7eb" />
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4">
                            <span className="text-3xl font-bold text-gray-800">{activeDonations}</span>
                            <p className="text-gray-500 text-sm">Active Donations Now</p>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-black">Recent <span className="text-[#F83002]">Donations</span></h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse">
                            <thead className="bg-gray-50 text-black text-xs uppercase font-bold">
                                <tr>
                                    <th className="p-4 text-left whitespace-nowrap">Title</th>
                                    <th className="p-4 text-center whitespace-nowrap">Quantity</th>
                                    <th className="p-4 text-center whitespace-nowrap">Listed Date</th>
                                    <th className="p-4 text-center whitespace-nowrap">Requests</th>
                                    <th className="p-4 text-center whitespace-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {allAdminDonations?.slice(0, 5).map((d) => (
                                    <tr key={d._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-orange-100 shrink-0 flex items-center justify-center text-[#F83002]">
                                                <Utensils className="w-4 h-4" />
                                            </div>
                                            <span className="truncate text-gray-900">{d.title}</span>
                                        </td>
                                        <td className="p-4 text-center text-gray-900">{d.quantity} Units</td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex text-gray-900 items-center justify-center gap-2">
                                                <Calendar className="w-3 h-3 text-gray-800" />
                                                {d.createdAt?.split("T")[0]}
                                            </div>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {d.applications?.length || 0} Applicants
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${d.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {d.status === 'active' ? 'Active' : 'Expired'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {(!allAdminDonations || allAdminDonations.length === 0) && (
                            <div className="text-center p-10 text-gray-500">
                                No donations found. Start by donating food!
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DonorDashboard;