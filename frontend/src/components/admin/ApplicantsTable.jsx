import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setAllApplicants } from '@/redux/applicationSlice';

const shortlistingStatus = ["Approved", "Declined"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`,
                { status }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                const updated = await axios.get(
                    `${APPLICATION_API_END_POINT}/${applicants._id}/applicants`,
                    { withCredentials: true }
                );

                dispatch(setAllApplicants(updated.data.donation));
            }
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    return (
        <div className="space-y-4 m-2 lg:m-0">
            {applicants?.applications?.map((item) => (
                <div
                    key={item._id}
                    className="bg-[#f9fafb] border border-gray-300 rounded-lg shadow-sm"
                >

                    <div className="flex justify-between items-center px-4 py-3 border-b bg-orange-50 rounded-t-lg">
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                Donation Application
                            </p>
                            <p className="text-xs text-gray-500">
                                {item?.applicant?.createdAt.split("T")[0]}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <StatusBadge status={item.status} />

                            <Popover>
                                <PopoverTrigger>
                                    <MoreHorizontal className="cursor-pointer text-gray-600" />
                                </PopoverTrigger>
                                <PopoverContent className="w-32">
                                    {shortlistingStatus.map((status, index) => (
                                        <div
                                            key={index}
                                            onClick={() => statusHandler(status, item._id)}
                                            className="my-2 cursor-pointer hover:text-blue-600"
                                        >
                                            {status}
                                        </div>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>


                    <div className="bg-amber-50 px-4 py-4 border-b">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Donation Requested
                        </p>

                        <div className="grid grid-cols-12 gap-y-3 text-sm">
                            <Label className="col-span-3">Items</Label>
                            <Value className="col-span-9">
                                {item?.requestedItems?.join(", ")}
                            </Value>

                            <Label className="col-span-3">Units</Label>
                            <Value className="col-span-9">
                                {item?.requestedUnits}
                            </Value>
                        </div>
                    </div>


                    <div className="bg-amber-50 px-4 py-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                            Applicant Details
                        </p>

                        <div className="grid grid-cols-12 gap-y-3 text-sm">
                            <Label className="col-span-3">Full Name</Label>
                            <Value className="col-span-9">
                                {item?.applicant?.fullname}
                            </Value>

                            <Label className="col-span-3">Email</Label>
                            <Value className="col-span-9">
                                {item?.applicant?.email}
                            </Value>

                            <Label className="col-span-3">Contact</Label>
                            <Value className="col-span-9">
                                {item?.applicant?.phoneNumber}
                            </Value>

                            <Label className="col-span-3">Address</Label>
                            <Value className="col-span-9">
                                {item?.applicant?.profile?.address}
                            </Value>

                            <Label className="col-span-3">License</Label>
                            <Value className="col-span-9">
                                {item?.applicant?.profile?.license ? (
                                    <a
                                        href={item.applicant.profile.license}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline font-medium"
                                    >
                                        {"License File/Image"}
                                    </a>
                                ) : (
                                    "Not Provided"
                                )}
                            </Value>
                        </div>
                    </div>
                </div>
            ))}
        </div>




    );
};

const Value = ({ children, className = "" }) => (
    <p className={`text-gray-900 ${className}`}>
        {children || "NA"}
    </p>
);
const Label = ({ children, className = "" }) => (
    <p className={`text-gray-500 font-medium ${className}`}>
        {children}
    </p>
);
const StatusBadge = ({ status }) => {
    const styles = {
        approved: "bg-green-100 text-green-700",
        declined: "bg-red-100 text-red-700",
        pending: "bg-yellow-100 text-yellow-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
      ${styles[status] || styles.pending}`}
        >
            {status}
        </span>
    );
};

export default ApplicantsTable;