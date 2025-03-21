type FamilyCateogoryType = BaseCateogoryType &  {
  children: BaseCateogoryType[];
};

type BaseCateogoryType = {
  id: number;
  name: string;
};
