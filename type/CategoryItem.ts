type CategoryItemType = {
  content: CategoryItemContentType[];
  page: PageType;
  message: string;
};

type CategoryItemContentType = {
  name: string;
  price: number;
  discountedPrice: number;
  relatedColorItems: RelatedCategoryColorItemType[];
};

type RelatedCategoryColorItemType = {
  colorItemId: number;
  color: string;
  hexCode: string;
  uploadFile: UploadFileType;
};

type FamilyColorType = BaseColorType & {
  children: BaseColorType[];
};

type BaseColorType = {
  id: number;
  name: string;
  hexCode: string;
};

type CategoryBestItemType = {
  colorItemId: number;
  name: string;
  price: number;
  discountedPrice: number;
  uploadFile: UploadFileType;
  avgRating: number;
  reviewCount: number;
};

type UploadFileType = {
  originalFileName: string;
  storedFileName: string;
};
