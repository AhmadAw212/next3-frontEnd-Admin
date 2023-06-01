export class CoreUser {
  active?: number;
  displayName?: string;
  userName: string;
  email?: string;
  userLimitDoctorFees?: number;
  userLimitTaxiFees?: number;
  userLimitSurveyFees?: number;
  userLimitExceedPercentage?: number;
  userLimitLawyerFees?: number;
  companyId?: number;
  branchId?: number;
  recoverLimit?: number;
  userLimitHospitalFees?: number;
  paymentLimit?: number;
  userLimitExpertFees?: number;
  companyDescription?: string;
  userEmailSignature?: string;
  constructor(
    active: number,
    displayName: string,
    userName: string,
    email: string,
    userLimitDoctorFees: number,
    userLimitTaxiFees: number,
    userLimitSurveyFees: number,
    userLimitExceedPercentage: number,
    userLimitLawyerFees: number,
    companyId: number,
    branchId: number,
    recoverLimit: number,
    userLimitHospitalFees: number,
    paymentLimit: number,
    userLimitExpertFees: number,
    companyDescription: string,
    userEmailSignature: string
  ) {
    this.active = active;
    (this.displayName = displayName),
      (this.userName = userName),
      (this.email = email),
      (this.userLimitDoctorFees = userLimitDoctorFees),
      (this.userLimitTaxiFees = userLimitTaxiFees),
      (this.userLimitSurveyFees = userLimitSurveyFees),
      (this.userLimitExceedPercentage = userLimitExceedPercentage),
      (this.userLimitLawyerFees = userLimitLawyerFees),
      (this.companyId = companyId),
      (this.branchId = branchId),
      (this.recoverLimit = recoverLimit),
      (this.userLimitHospitalFees = userLimitHospitalFees),
      (this.paymentLimit = paymentLimit),
      (this.userLimitExpertFees = userLimitExpertFees),
      (this.companyDescription = companyDescription);
    this.userEmailSignature = userEmailSignature;
  }

  public static fromJSON(json: any): CoreUser {
    let companyId = parseInt(json.companyId);
    let branchId = parseInt(json.branchId);
    return new CoreUser(
      json.active,
      json.displayName,
      json.userName,
      json.email,
      json.userLimitDoctorFees,
      json.userLimitTaxiFees,
      json.userLimitSurveyFees,
      json.userLimitExceedPercentage,
      json.userLimitLawyerFees,
      companyId,
      branchId,
      json.recoverLimit,
      json.userLimitHospitalFees,
      json.paymentLimit,
      json.userLimitExpertFees,
      json.companyDescription,
      json.userEmailSignature
    );
  }
}
