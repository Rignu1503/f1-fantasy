import { Injectable } from '@angular/core';
import { Participant, Race } from '../models';

const PARTICIPANTS_KEY = 'f1fantasy_participants';
const RACES_KEY = 'f1fantasy_races';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  saveParticipants(participants: Participant[]): void {
    localStorage.setItem(PARTICIPANTS_KEY, JSON.stringify(participants));
  }

  loadParticipants(): Participant[] {
    const data = localStorage.getItem(PARTICIPANTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveRaces(races: Race[]): void {
    localStorage.setItem(RACES_KEY, JSON.stringify(races));
  }

  loadRaces(): Race[] {
    const data = localStorage.getItem(RACES_KEY);
    return data ? JSON.parse(data) : [];
  }
}
