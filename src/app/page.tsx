import { Navbar, Footer } from "@/components";
import { ArtworkCarousel } from "./home/artwork_carousel";
import Gallery from "@/components/coverflowGallery";
import type { ImgData } from "@/types";
import { ArtworkQuiz } from "./home/artwork_quiz";
import { MackRecoilUI } from "../mock/mock_recoil";

export default function Campaign() {
  return (
    <>
      <ArtworkCarousel />
      <ArtworkQuiz />
      <MackRecoilUI></MackRecoilUI>
      {/* <Footer /> */}
    </>
  );
}
