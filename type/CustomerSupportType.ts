type FaqPagingType = {
  content: FaqType[];
  page: PageType;
  message?: string;
};

type FaqType = {
  title: string;
  description: string;
  category: string;
};

