export interface Email {
  from?: string;
  to?: string;
  cc?: string;
  subject?: string;
  text?: string;
  image?: File | null;
}
