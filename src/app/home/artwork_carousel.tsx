"use client";

import { FeaturedImageGallery } from "@/components/featured_image_gallery";

import {
  Carousel,
  Typography,
  TypographyProps,
} from "@material-tailwind/react";

import React from "react";
export function ArtworkCarousel<C extends React.ElementType>(
  props: TypographyProps<C, { component?: C }> & {
    isValid: boolean;
  }
) {
  const imageData = [
    {
      imgelink:
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1432462770865-65b70566d673?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80",
    },
    {
      imgelink:
        "https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80",
    },
    {
      imgelink:
        "https://img1.daumcdn.net/thumb/R1280x0.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/aZCw/image/Mk9nPVVlIFCL-MvBHxaUDJFtDEY.png",
    },
  ];

  const [active, setActive] = React.useState(
    "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  );

  return (
    <section className=" sm:px-16 md:px-40 lg:60 !py-20">
      <div className="container mx-auto bg-ggrimGrey1">
        <div className="flex max-w-md flex-col items-start">
          {/* 여기서 max-w-lg로 조정 */}
          <div className="pt-5 pl-20 mb-2 ">
            <Typography
              className="!text-ggrimBrown1 text-3xl font-bold relative after:content-[''] after:block after:w-full after:h-1 after:bg-ggrimBrown1 after:mt-2"
              {...props}
            >
              Painting of the Week
            </Typography>
          </div>
        </div>
        <div className="w-lg bg-ggrimGrey1">
          <FeaturedImageGallery imageData={imageData} />
        </div>
      </div>
    </section>
  );
}
