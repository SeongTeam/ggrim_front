// components
import { Navbar, Footer } from "@/components";
import { ArtworkCarousel } from "./home/artwork_carousel";
import Gallery from "@/components/coverflowGallery";
import type { ImgData } from "@/types";
import { ArtworkQuiz } from "./home/artwork_quiz";

// sections

export default function Campaign() {
  return (
    <>
      <ArtworkCarousel />
      <ArtworkQuiz />
      {/* <Footer /> */}
    </>
  );
}
