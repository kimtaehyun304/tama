type CategoryItemType = {
  content: CategoryItemContentType[];
  page: PageType;
  message:string;
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
  page: number;
  size: number;
  //totalElements: number;
  pageCount: number;
  rowCount: number;
};

type ColorType = {
  id: number;
  name: string;
  hexCode: string;
};
