type CateogoryType = {
  id: number;
  name: string;
  children: ChildCateogoryType[];
};

type ChildCateogoryType = {
  id: number;
  name: string;
};
