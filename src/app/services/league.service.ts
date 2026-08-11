import { Injectable, signal } from '@angular/core';

export type League = 'F1' | 'NASCAR';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  activeLeague = signal<League>('F1');

  setLeague(league: League) {
    this.activeLeague.set(league);
  }
}
