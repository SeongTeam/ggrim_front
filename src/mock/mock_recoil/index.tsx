'use client';

import React from 'react';
import { useRecoilState } from 'recoil';
import { imageListState } from './store';
import Images from './components/images';
import Metadata from './components/metadata';

import './styles.css';

export function MackRecoilUI() {
    const [imageList, setImageList] = useRecoilState(imageListState);
    const counter = imageList.length + 1;
    const addImage = () => {
        setImageList([...imageList, counter]);
    };
    return (
        <section className=" sm:px-16 md:px-40 lg:60 !py-20">
            <div className="container mx-auto ">
                {/* 여기서 max-w-lg로 조정 */}
                <div className="pt-5 pl-20 mb-2 ">MOCK recoil </div>
                <div className="MackRecoilUI">
                    <Images />
                    <Metadata />
                </div>
                {/* I just didn't prepare mote than 6 image to load :)  */}
                {counter <= 6 && <button onClick={addImage}>Add image</button>}
            </div>
        </section>
    );
}
