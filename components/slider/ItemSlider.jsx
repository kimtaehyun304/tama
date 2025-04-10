import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

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

export default function ItemSlider({ uploadFiles }) {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const sliderRef1 = useRef();
  const sliderRef2 = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setNav1(sliderRef1.current);
    setNav2(sliderRef2.current);
  }, []);

  useEffect(() => {
    console.log(activeIndex);
  }, [activeIndex]);

  return (
    <section className="">
      <Slider asNavFor={nav2} ref={sliderRef1} {...hiddenArrowSettings}>
        {uploadFiles.map((uploadFile, index) => (
          <div
            className="relative w-full h-[400px] xl:h-[600px]"
            key={`item-${index}`}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uploadFile.storedFileName}`}
              alt={uploadFile.originalFileName}
              fill
            />
          </div>
        ))}
      </Slider>

      {/*slidesToShow모다 이미지 수가 작으면 출력 안되는 버그 있어서 infinite 껐다가, setActiveindex 안돼서 다시 킴 */}
      <Slider
        asNavFor={nav1}
        ref={sliderRef2}
        slidesToShow={Math.min(6, uploadFiles.length)} // 👈 여기에 주의!
        swipeToSlide={true}
        focusOnSelect={true}
        beforeChange={(current, next) => {
          console.log(next);
          setActiveIndex(next);
        }}
        infinite={true}
      >
        {uploadFiles.map((uploadFile, index) => (
          <div className="pr-1" key={`item-detail-${index}`}>
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uploadFile.storedFileName}`}
              alt={uploadFile.originalFileName}
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
