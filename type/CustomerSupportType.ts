type FaqPagingType = {
  content: FaqType[];
  page: PageType;
  message?: string;
};

type FaqType = {
  question: string;
  answer: string;
  category: string;
};

