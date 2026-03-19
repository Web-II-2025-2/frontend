export interface GuestProfile {
  id: number;
  name: string;
  cpf: string;
  phoneNumber: string;
  credentialId: number;
}

export type TabId = "profile" | "reservations";