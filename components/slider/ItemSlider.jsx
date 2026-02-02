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

  return (
    <section className="">
      <Slider
        asNavFor={nav2}
        ref={sliderRef1}
        {...hiddenArrowSettings}
        adaptiveHeight={true}
      >
        {uploadFiles.map((uploadFile, index) => (
          <div
            className="relative w-full h-[400px] xl:h-[600px]"
            key={`item-${index}`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uploadFile.storedFileName}`}
              alt={uploadFile.originalFileName}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>

      {/*slidesToShow모다 이미지 수가 작으면 출력 안되는 버그 있어서 infinite 껐다가, setActiveindex 안돼서 다시 킴 */}
      <Slider
        asNavFor={nav1}
        ref={sliderRef2}
        slidesToShow={Math.min(6, uploadFiles.length)}
        swipeToSlide={6}
        focusOnSelect={true}
        beforeChange={(current, next) => {
          setActiveIndex(next);
        }}
        infinite={true}
        adaptiveHeight={true}
      >
        {uploadFiles.map((uploadFile, index) => (
          <div className="pr-1" key={`item-detail-${index}`}>
            <div className="w-[100px] h-[100px] relative">
              <img
                src={`${process.env.NEXT_PUBLIC_CDN_URL}/${uploadFile.storedFileName}`}
                alt={uploadFile.originalFileName}
                className={`object-contain ${
                  activeIndex === index ? "border border-black" : ""
                }`}
              />
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
