export interface Driver {
  id: string;
  name: string;
  team: string;
  teamColor: string;
}

export interface Participant {
  id: string;
  name: string;
  driverIds: string[];
  locked: boolean;
}

export interface RaceResult {
  driverId: string;
  position: number; // 1-20, 0 = DNF
}

export interface Race {
  id: string;
  name: string;
  date: string;
  results: RaceResult[];
}

export interface RankedParticipant {
  participant: Participant;
  totalPoints: number;
  driverPoints: { driverId: string; points: number }[];
}
