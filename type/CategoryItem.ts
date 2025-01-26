type CategoryItemType = {
  content: CategoryItemContentType[];
  page: PageType;
};

type CategoryItemContentType = {
  name: string;
  price: number;
  discountedPrice: number;
  relatedColorItems: RlatedColorItemType[];
};

type RlatedColorItemType = {
  colorItemId: number;
  color: string;
  hexCode: string;
  imageSrc: string;
  totalStock: number;
};

type PageType = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

type ColorType = {
  id: number;
  name: string;
  hexCode: string;
};
