export interface IGoogleTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expiry_date: number;
}

export interface IGooglePlusResponse {
  kind: string;
  etag: string;
  gender: string;
  emails: [{ value: string, type: string }];
  objectType: string;
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  url: string;
  image: {
    url: string;
    isDefault: boolean;
  };
  isPlusUser: boolean;
  circledByCound: number;
  verified: boolean;
}
