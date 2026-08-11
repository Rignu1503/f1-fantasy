import { Injectable } from '@angular/core';
import { Participant, Race } from '../models';
import { League } from './league.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private getPrefix(league: League): string {
    return league === 'F1' ? 'f1fantasy' : 'nascarfantasy';
  }

  saveParticipants(league: League, participants: Participant[]): void {
    localStorage.setItem(`${this.getPrefix(league)}_participants`, JSON.stringify(participants));
  }

  loadParticipants(league: League): Participant[] {
    const data = localStorage.getItem(`${this.getPrefix(league)}_participants`);
    return data ? JSON.parse(data) : [];
  }

  saveRaces(league: League, races: Race[]): void {
    localStorage.setItem(`${this.getPrefix(league)}_races`, JSON.stringify(races));
  }

  loadRaces(league: League): Race[] {
    const data = localStorage.getItem(`${this.getPrefix(league)}_races`);
    return data ? JSON.parse(data) : [];
  }
}
