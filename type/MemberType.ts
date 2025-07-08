type MemberPayemntSetUpType = {
  id: number;
  nickname: string;
  email: string;
  phone: string;
};

type MemberOrderSetUpType = {
  id: number;
  nickname: string;
  email: string;
  phone: string;
  addresses: AddressResponse[];
};

//개인정보
type MemberInformationType = {
  email: string;
  phone: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
  height?: number;
  weight?: number;
  authority: AuthorityType;
};

type AddressResponse = {
  id: number;
  name: string; // 우편번호
  zipCode: string; // 우편번호
  street: string; // 도로명 주소
  detail: string; // 상세 주소
  receiverNickname: string;
  receiverPhone: string;
  isDefault: boolean;
};

type AuthorityType = "MEMBER" | "ADMIN";

type AddressFormState = {
  receiverNickname: string;
  receiverPhone: string;
  zoneCode: number | undefined;
  streetAddress: string;
  detailAddress: string;
  addressName: string;
};

type isAdminResponse = {
  isAdmin: boolean;
};
