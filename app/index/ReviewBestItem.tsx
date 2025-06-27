

export default () => {
    /*
  <section className="xl:block my-16">
    <nav className="flex justify-between items-end border-b pb-6 px-3 xl:px-0 text">
      <div className="flex justify-start items-end gap-x-4">
        <span className="font-extrabold text-3xl"> 리뷰가 좋은 인기상품</span>
        <span className="hidden xl:inline text-[#999]  text-sm">
          최근 30일간 별점과 리뷰수를 반영하여 선정된 제품입니다.
        </span>
      </div>
      <Link href={"/"} className="text-end text-[#777]">
        더보기 &#10095;
      </Link>
    </nav>

    <nav className="">
      <div className="grid px-1 sm:px-0 gap-x-1 sm:gap-x-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-6 xl:gap-6 justify-items-center xl:justify-items-start">
        {items.map((item, index) => (
          <Link href={`/items/${item.id}`} key={`categoryBestimages-${index}`}>
            <div className="relative max-w-[232px]">
              <Image src={item.src} alt={item.alt} width={232} height={232} />
              <div className="absolute top-2 left-2 bg-[#ffffff] p-1">
                {index + 1}위
              </div>
              <div className="">
                <div className="py-1">{item.name}</div>
                <div className="flex items-center gap-x-2 py-1">
                  <span>
                    <span className="font-semibold">
                      {item.discountedPrice
                        ? item.discountedPrice.toLocaleString("ko-KR")
                        : item.price.toLocaleString("ko-KR")}
                    </span>
                    원
                  </span>
                  <span className="text-sm text-[#aaa]">
                    {item.discountedPrice &&
                      `${item.price.toLocaleString("ko-KR")}원`}
                  </span>
                </div>
                <div className="flex items-center gap-x-1 text-sm text-[#aaa]">
                  <Image
                    src="/icon/icon-star.png"
                    alt={item.alt}
                    width={16}
                    height={16}
                  />
                  {item.starRatingAvg}
                  <span>({item.comments})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  </section>;
  */
};
