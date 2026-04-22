type CourierResponse = {
  code: string;
  kor: string;
  eng: string;
};

type TrackingDetail = {
  timeString: string;
  where: string;
  kind: string;
};

type DeliveryTrackingResponse = {
  invoiceNo: string;
  courierName: string;
  trackingDetails: TrackingDetail[];
  message?: string
};
