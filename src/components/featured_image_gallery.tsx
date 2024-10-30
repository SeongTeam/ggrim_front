"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "@/components/style/gallery.module.css";

type FeaturedImageGalleryProps = {
  imageData: { imgelink: string }[];
};

export const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({
  imageData,
}) => {
  const [active, setActive] = React.useState(
    "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  );

  // return (
  //   <div
  //     // className="grid gap-4 max-w-lg bg-slate-400"
  //     className="grid gap-4 max-w-lg w-full aspect-[4/5] border-4 border-gray-300 rounded-lg overflow-hidden bg-white flex items-center justify-center"
  //   >
  //     <div className="p-4">
  //       <img
  //         // className="h-auto w-full  rounded-lg object-cover object-center md:h-[480px]"
  //         className="object-contain h-full w-full"
  //         src={active}
  //         alt=""
  //       />
  //     </div>
  //     <div className="grid grid-cols-5 gap-4">
  //       {imageData.map(({ imgelink }, index) => (
  //         <div key={index}>
  //           <img
  //             onClick={() => setActive(imgelink)}
  //             src={imgelink}
  //             className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
  //             alt="gallery-image"
  //           />
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex gap-8 mx-auto flex-col-reverse xl:flex-row">
      {/* Main Image Carousel */}
      <div className="max-w-lg w-full aspect-[4/5] xl:w-[1062px]">
        <img
          // className="h-auto w-full  rounded-lg object-cover object-center md:h-[480px]"
          className="object-contain h-full w-full"
          src={active}
          alt=""
        />
      </div>

      {/* Thumbnail Navigation */}
      <div className="xl:w-[126px] w-full">
        <Swiper
          slidesPerView={0}
          spaceBetween={10}
          direction="vertical"
          className={`${styles.navForSlider}`}
        >
          {imageData.map(({ imgelink }, index) => (
            <SwiperSlide key={index}>
              <img
                src={imgelink}
                alt={`Thumbnail ${index}`}
                onClick={() => setActive(imgelink)}
                className="cursor-pointer h-[110px] rounded-2xl border-2 border-gray-200 hover:border-indigo-600 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedImageGalleryProps;
