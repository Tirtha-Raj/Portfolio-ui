export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
