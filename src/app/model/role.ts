export class Role {
  id?: string;
  coreProfile?: string;
  description?: string;
  granted?: boolean;

  constructor(
    id: string,
    coreProfile: string,
    description: string,
    granted: boolean
  ) {
    this.id = id;
    this.coreProfile = coreProfile;
    this.description = description;
    this.granted = granted;
  }
}
