export interface SurveySearchDto {
  supplierId: string;
  lossCarSearchCode: string;
  lossCarSearchValue: string;
  surveyStatus: string;
  fromDate: string; // Assuming LocalDateTime is represented as Date in TypeScript
  toDate: string; // Assuming LocalDateTime is represented as Date in TypeScript
  vip: string;
  insuranceId: string;
  isSurveyRequestInformationIncluded: boolean;
}
