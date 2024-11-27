import { Navbar, Footer } from "@/components";
import { ArtworkCarousel } from "./home/artwork_carousel";
import Gallery from "@/components/coverflowGallery";
import { ArtworkQuiz } from "./home/artwork_quiz";
import { MackRecoilUI } from "../mock/mock_recoil";
import { Painting } from "@/mock/data/entity/mock_painting";
import { MCQAttribute } from "@/types/mcq_types";

const getData = async (): Promise<Painting[]> => {
  const response = await fetch("http://localhost:3000/api/json", {
    cache: "no-cache",
  });
  const res = await response.json();
  return res.data;
};

export default async function Campaign() {
  const data: Painting[] = await getData();

  const attrs1: MCQAttribute = {
    displayAnswers: data.slice(0, 3),
    answer: data.slice(3, 4),
    id: "1234",
    isFinalized: true,
    question:
      "라파엘로의 가장 유명한 작품 중 하나로, 바티칸 궁전의 벽화를 장식하며 고전 철학자들을 묘사한 작품의 제목은 무엇인가?",
    selectedAnswer: 3,
    showHintButton: true,
  };

  return (
    <>
      <h1>{data[0].artistName}</h1>
      <ArtworkCarousel />
      <ArtworkQuiz mcqAttributes={[attrs1]} />
      {/* <MackRecoilUI></MackRecoilUI> */}
      {/* <Footer /> */}
    </>
  );
}
