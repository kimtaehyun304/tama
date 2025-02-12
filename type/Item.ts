type ItemImageType = {
  alt: string;
  src: string[];
};

type ItemStockType = {
  id: number;
  size: string;
  stock: number;
};

type LocalStorageCartItemType = {
  itemStockId: number;
  orderCount: number;
};

type CartItemType = {
  price: number;
  discountedPrice: number;
  stock: ItemStockType;
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
  stocks: ItemStockType[];
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
