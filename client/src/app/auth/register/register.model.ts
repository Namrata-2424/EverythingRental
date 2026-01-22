export interface Address {
  city: string;
  locality: string;
  pincode: string;
  stateName: string;
  country: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: Address;
}
