import React from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchedQuery } from '@/redux/donationSlice'

const categories = [
    "Groceries",
    "Foods",
    "Snacks",
    "Vegetables",
    "Fruits",
    "Others"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const searchDonationHandler = (query) => {
        dispatch(setSearchedQuery(query))
        navigate("/browse")
    }

    return (
        <div>
            <Carousel className="cal w-[60%] max-w-xl mx-auto my-20 relative">
                <CarouselContent>
                    {categories.map((cat, index) => (
                        <CarouselItem key={index} className="md:basis-[40%] lg:basis-1/3">
                            <Button
                                onClick={() => searchDonationHandler(cat)}
                                variant="outline"
                                className="bad bg-amber-600 text-white rounded-full hover:bg-amber-700 transition"
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Laptop arrows */}
                <CarouselPrevious className="hidden md:block" />
                <CarouselNext className="hidden md:block" />

                {/* Mobile arrows */}
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-20 md:hidden" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-20 md:hidden" />
            </Carousel>
        </div>

    )
}

export default CategoryCarousel
