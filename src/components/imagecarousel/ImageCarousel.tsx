'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { PhoneImageType } from "@/lib/types";

interface PhoneCarouselProps {
  images: PhoneImageType[];
  phoneName: string;
}

export default function PhoneCarousel({ images, phoneName }: PhoneCarouselProps) {
  return (
    <div className="phone-carousel-container w-full py-12 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        spaceBetween={20}
        speed={1000}
        pagination={{ clickable: true }}
        navigation={true}
      >
        {images.map((img) => (
          <SwiperSlide key={img.id} className="!w-auto">
            <div className="relative w-full  h-[60vh] sm:h-[450px]">
              <Image
                src={img.url}
                alt={`${phoneName} - ${img.color}`}
                width={500}
                height={600}
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
