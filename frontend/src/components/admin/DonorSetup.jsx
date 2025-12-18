import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { DONOR_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetDonorById from '@/hooks/useGetDonorsById'

const DonorSetup = () => {
    const params = useParams();
    useGetDonorById(params.id);

    const { singleDonor } = useSelector(store => store.donor);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        donorType: ""

    });


    const [newLogoFile, setNewLogoFile] = useState(null);
    const [existingLogoUrl, setExistingLogoUrl] = useState("");

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }


    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewLogoFile(file);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        formData.append("donorType", input.donorType);



        if (newLogoFile) {
            formData.append("file", newLogoFile);
        }

        try {
            setLoading(true);
            const res = await axios.put(`${DONOR_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/donors");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (singleDonor) {
            setInput({
                name: singleDonor.name || "",
                description: singleDonor.description || "",
                website: singleDonor.website || "",
                location: singleDonor.location || "",
                donorType: singleDonor.donorType || ""

            });

            setExistingLogoUrl(singleDonor.file || "");
            setNewLogoFile(null); // Clear any old file selection
        }
    }, [singleDonor]);

    return (
        <div>
            <Navbar />
            <div className='p-4 max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <Button onClick={() => navigate("/admin/donors")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                        <ArrowLeft />
                        <span>Back</span>
                    </Button>
                    <div className='grid grid-cols-2 gap-4'>
                        {/* Name, Description, Website, Location */}
                        <div>
                            <Label className="my-2">Source Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="my-2">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="my-2">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="my-2">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="my-2">Source Type</Label>
                            <select
                                name="donorType"
                                value={input.donorType}
                                onChange={changeEventHandler}
                                className="w-full border p-2 rounded"
                            >
                                <option value="RESTAURANT">Restaurant</option>
                                <option value="HOTEL">Hotel</option>
                                <option value="SHOP">Shop / Store</option>
                                <option value="EVENT">Event / Catering</option>
                                <option value="BY_HOUSE">By House</option>
                            </select>
                        </div>


                        <div>
                            <Label className="my-2">Logo</Label>

                            {(newLogoFile || existingLogoUrl) && (
                                <div className='my-2'>
                                    <img
                                        src={newLogoFile ? URL.createObjectURL(newLogoFile) : existingLogoUrl}
                                        alt="Logo Preview"
                                        className="w-20 h-20 object-cover border rounded"
                                    />
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {newLogoFile ? `New: ${newLogoFile.name}` : "Current Logo"}
                                    </p>
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="bg-[#F83002] w-full my-4">Update</Button>
                    )}
                </form>
            </div>
        </div>
    )
}


export default DonorSetup