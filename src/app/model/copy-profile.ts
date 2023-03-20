import { Profiles } from './profiles';

export interface CopyProfile {
  sourceUserId?: string;
  destinationUserId?: string;
  profiles?: Profiles[];
}
