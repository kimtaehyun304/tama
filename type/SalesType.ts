type AdminSalesResponse = {
  monthSales: MonthSale[];
  categorySales: CategorySale[];
};

type MonthSale = {
  orderDate: Date;
  orderCount: number;
  orderTotal: number;
};

type CategorySale = {
  categoryName: string;
  orderCount: number;
  orderTotal: number;
  children: CategorySale[];
};
