import { Injectable, signal, computed } from '@angular/core';

export type League = 'F1' | 'NASCAR';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {
  activeLeague = signal<League>('F1');
  maxDrivers = computed(() => this.activeLeague() === 'F1' ? 4 : 3);

  setLeague(league: League) {
    this.activeLeague.set(league);
  }
}

