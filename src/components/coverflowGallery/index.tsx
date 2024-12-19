// 'use client';

// import { ImageSlider } from './imageSlider';
// import { useGalleryStore } from './store';

// interface GalleryProps {
//     galleryData: any;
//     allSerie: string[];
//     allTags: string[];
// }

// const Gallery = ({ galleryData }: GalleryProps) => {
//     // const locale = useParams()?.locale as LocaleTypes
//     const { isOpen, setIsOpen, selectedSerie, selectedTags, selectTag } = useGalleryStore();
//     const toggleMenu = () => {
//         setIsOpen(!isOpen);
//     };

//     const isNotMobile = 10000 > 568;
//     /** TODO     windowWidth > 568 사용시 에러 발생 제거 해야함 */
//     const portraitDimensions = {
//         width: isNotMobile ? 350 : 225,
//         height: isNotMobile ? 450 : 300,
//     };
//     const landscapeDimensions = {
//         width: isNotMobile ? 583 : 400,
//         height: isNotMobile ? 450 : 300,
//     };

//     return (
//         <>
//             <div className="mb-20 pt-10 w-screen ">
//                 <ImageSlider
//                     imageData={galleryData}
//                     portraitDimensions={portraitDimensions}
//                     landscapeDimensions={landscapeDimensions}
//                     selectedSerie={selectedSerie}
//                     selectedTags={selectedTags}
//                     selectTag={selectTag}
//                 />
//             </div>
//         </>
//     );
// };

// export default Gallery;
