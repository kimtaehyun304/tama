type ItemImageType = {
  alt: string;
  src: string[];
};

type ColorItemSizeStockType = {
  id: number;
  size: string;
  stock: number;
};

type StorageItemType = {
  itemStockId: number;
  orderCount: number;
};

//장바구니 or 주문 상품
type StorageItemDetailType = {
  price: number;
  discountedPrice: number;
  sizeStocks: ColorItemSizeStockType;
  colorItemId: number;
  color: string;
  name: string;
  image: string;
};

type OrderItemType = {
  price: number;
  discountedPrice: number;
  sizeStocks: ColorItemSizeStockType;
  colorItemId: number;
  color: string;
  name: string;
  image: string;
};


type CommonInfoType = {
  id: number;
  gender: string;
  yearSeason: string;
  name: string;
  description: string;
  dateOfManufacture: string;
  countryOfManufacture: string;
  manufacturer: string;
  category: string;
  textile: string;
  precaution: string;
};

type RelatedColorItemType = {
  id: number;
  color: string;
  imageSrc: string;
};

type ColorItemType = {
  images: string[];
  id: number;
  color: string;
  price: number;
  discountedPrice: number;
  common: CommonInfoType;
  stocks: ColorItemSizeStockType[];
  relatedColorItems: RelatedColorItemType[];
};

type ReviewType = {
  avgRating: number;
  content: ReviewContent[];
  page: PageType;
};

type ReviewContent = {
  member: ReviewMember;
  option: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

type ReviewMember = {
  nickname: string;
  height: string;
  weight: string;
};

type MinMaxPrice = {
  minPrice: number;
  maxPrice: number;
};

type PageType = {
  page: number;
  size: number;
  //totalElements: number;
  pageCount: number;
  rowCount: number;
};
