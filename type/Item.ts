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
  common: CommonInfoType;
  stocks: ItemStockType[];
  relatedColorItems: RelatedColorItemType[];
};

type ReviewType = {
  result: number;
  starRatingAvg: number;
  data: Data[];
};

type Data = {
  rating: number;
  email: string;
  createdAt: Date;
  height: number;
  weight: number;
  item: string;
  content: string;
};
