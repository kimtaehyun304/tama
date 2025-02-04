type CategoryItemType = {
  content: CategoryItemContentType[];
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

type ColorType = {
  id: number;
  name: string;
  hexCode: string;
};
