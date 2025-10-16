"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const images: BannerImageType[] = [
  { src: "/banner1.jpg", alt: "Banner 1" },
  { src: "/banner2.jpg", alt: "Banner 2" },
  { src: "/banner3.jpg", alt: "Banner 3" },
];

type CustomArrowProps = {
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

function NextArrow(props: CustomArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props: CustomArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

export default function BannerSlider() {
  const settings = {
    pauseOnHover: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  //<Image>는 새로고침마다 이미지가 감빡 거림 (메모리 캐시라 0ms인데도 불구하고)
  //<img>는 안 감빡 거림 (단, 메모리 캐시는 아님)
  //근데 페이지 전환할 땐 안 감빡거려서 <Image>가 난 듯. 
  return (
    <section className="pb-5">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative w-full h-[400px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className=""
            />
          </div>
        ))}
      </Slider>
    </section>
  );
}
