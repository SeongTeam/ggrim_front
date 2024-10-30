// components
import { Navbar, Footer } from "@/components";
import { ArtworkCarousel } from "./home/artwork_carousel";
import Gallery from "@/components/coverflowGallery";
import type { ImgData } from "@/types";

// sections

export default function Campaign() {
  return (
    <>
      <ArtworkCarousel />
      <Footer />
    </>
  );
}
