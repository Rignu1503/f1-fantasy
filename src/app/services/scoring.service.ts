import { Injectable } from '@angular/core';
import { Race, Participant, RankedParticipant } from '../models';

const POINTS_MAP: Record<number, number> = {
  1: 30,
  2: 25,
  3: 20,
  4: 18,
  5: 15,
  6: 14,
  7: 13,
  8: 12,
  9: 11,
  10: 10,
  11: 9,
  12: 8,
  13: 7,
  14: 6,
  15: 5,
  16: 4,
  17: 3,
  18: 2,
  19: 1,
  20: 1,
  21: 1,
  22: 1,
};

@Injectable({
  providedIn: 'root',
})
export class ScoringService {
  getPointsForPosition(position: number): number {
    return POINTS_MAP[position] ?? 0;
  }

  getDriverPointsForRace(driverId: string, race: Race): number {
    const result = race.results.find((r) => r.driverId === driverId);
    if (!result || result.position === 0) return 0;
    return this.getPointsForPosition(result.position);
  }

  getDriverTotalPoints(driverId: string, races: Race[]): number {
    return races.reduce((total, race) => total + this.getDriverPointsForRace(driverId, race), 0);
  }

  getParticipantTotalScore(participant: Participant, races: Race[]): number {
    return participant.driverIds.reduce(
      (total, driverId) => total + this.getDriverTotalPoints(driverId, races),
      0
    );
  }

  getRanking(participants: Participant[], races: Race[]): RankedParticipant[] {
    return participants
      .map((participant) => ({
        participant,
        totalPoints: this.getParticipantTotalScore(participant, races),
        driverPoints: participant.driverIds.map((driverId) => ({
          driverId,
          points: this.getDriverTotalPoints(driverId, races),
        })),
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }
}
