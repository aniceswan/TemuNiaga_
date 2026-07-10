export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    koperasiRef: string | null;
  };
}
