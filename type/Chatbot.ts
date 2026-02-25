type RecommendedCondition = {
  genders?: Gender[]; // MALE, FEMALE
  seasonKeyword?: string; // SS, FW
  categoryNames?: string[]; // 코트, 티셔츠 등
  minPrice?: number; // 최소 가격
  maxPrice?: number; // 최대 가격
  colorNames?: string[]; // 색상
  textile?: string; // 면, 나일론 등
  isContainSoldOut?: boolean;
  descriptionKeywords?: string[]; // 확장 키워드
};

type RecommendedItem = {
  colorItemId: number;
  name: string;
  originalPrice: number;
  nowPrice: number;
  uploadFile: UploadFileType;
};

//user, assistant에 따라 구조가 달라져서 ? 씀
type ChatMessage = {
  role: "user" | "assistant";
  content?: string;
  recommendedCondition?: RecommendedCondition;
  recommendedItems?: RecommendedItem[];
};

type Gender = "MALE" | "FEMALE" | "BOTH";
