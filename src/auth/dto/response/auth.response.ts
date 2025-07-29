export class AuthResponse {
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}