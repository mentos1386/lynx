export interface IOAuth<UserResponse, TokenResponse> {

  verifyToken(token: string): Promise<TokenResponse>;

  getUserInfo(token: string): Promise<UserResponse>;

}
