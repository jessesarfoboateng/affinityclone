export interface IdentityInfo {
  ghanaCardNumber: string;
  ghanaCardFront: string | null;
  ghanaCardBack: string | null;
}

export interface SelfieInfo {
  selfie: string | null;
}

export interface ApplicationData {
  identityInfo: IdentityInfo;
  selfieInfo: SelfieInfo;
  // Add other application data types as needed
} 