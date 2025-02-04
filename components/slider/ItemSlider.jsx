import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 타입스크립트로하니까 에러 못잡겠습니다 2024-12-20

function HiddenNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none" }}
      onClick={onClick}
    />
  );
}

function HiddenPrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "none" }}
      onClick={onClick}
    />
  );
}

const hiddenArrowSettings = {
  nextArrow: <HiddenNextArrow />,
  prevArrow: <HiddenPrevArrow />,
};

function XlHiddenNextArrow(props) {
  let { className, onClick } = props;
  //className += " hidden xl:block";
  return <div className={className} onClick={onClick} />;
}

function XlHiddenPrevArrow(props) {
  let { className, onClick } = props;
  //className += " hidden xl:block";
  return <div className={className} onClick={onClick} />;
}

const xlHiddenArrowSettings = {
  nextArrow: <XlHiddenNextArrow />,
  prevArrow: <XlHiddenPrevArrow />,
};

export default function ItemSlider({ images, itemName }) {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const sliderRef1 = useRef();
  const sliderRef2 = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  return (
    <section className="">
      <Slider asNavFor={nav2} ref={sliderRef1} {...hiddenArrowSettings}>
        {images.map((src, index) => (
          <div
            className="relative w-full h-[400px] xl:h-[600px]"
            key={`item-${index}`}
          >
            <Image src={src} alt={itemName} fill />
          </div>
        ))}
      </Slider>

      <Slider
        asNavFor={nav1}
        ref={sliderRef2}
        slidesToShow={6}
        swipeToSlide={true}
        focusOnSelect={true}
        beforeChange={(current, next) => setActiveIndex(next)}
        //infinite={false}
      >
        {images.map((src, index) => (
          <div className="pr-1" key={`item-detail-${index}`}>
            <Image
              src={src}
              alt={itemName}
              width={100}
              height={100}
              className={`${
                activeIndex === index ? "border border-black" : ""
              }`}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}
