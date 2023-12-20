export interface SurveySearchResult {
  insurance: string;
  notification: string;
  notificationId: string;
  plate: string;
  brand: string;
  trademark: string;
  yearOfMark: string;
  fullName: string;
  carSequence: string;
  insured: string; // You might want to replace 'any' with a specific type if applicable
  carId: string;
  productType: string;
  garageName: string | null;
  townName: string | null;
  carClaimId: string | null;
  claimStatus: string;
  surveysCount: string;
  surveyStatus: string;
  companyLogo: string;
  tradeMarkLogo: string | null;
  brandLogo: string | null;
}
