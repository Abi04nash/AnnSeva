import React from 'react';
import LatestDonationCard from './LatestDonationCards';
import { useSelector } from 'react-redux';


const LatestDonations = () => {
    const { allDonations } = useSelector(store => store.donation);

    return (
        <div className="mx-auto my-10 p-[1%]">
            <h1 className="head text-4xl lg:p-0 lg:text-4xl font-bold">
                Latest <span className="text-[#F83002]">Donations</span> Available
            </h1>

            <div className="lado grid grid-cols-3 gap-4 my-5">
                {
                    !allDonations || allDonations.length === 0
                        ? <span>No Donations Available</span>
                        : allDonations.slice(0, 6).map((donation) => (
                            <LatestDonationCard key={donation._id} donation={donation} />
                        ))
                }

            </div>
        </div>
    );
};

export default LatestDonations;
