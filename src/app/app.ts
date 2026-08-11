import { Component, signal, inject } from '@angular/core';
import { ParticipantsComponent } from './components/participants/participants.component';
import { RaceResultsComponent } from './components/race-results/race-results.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LeagueService, League } from './services/league.service';

type Tab = 'participants' | 'races' | 'leaderboard';

interface TabConfig {
  id: Tab;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [ParticipantsComponent, RaceResultsComponent, LeaderboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  activeTab = signal<Tab>('participants');
  private leagueService = inject(LeagueService);

  get activeLeague() {
    return this.leagueService.activeLeague;
  }

  setLeague(league: League) {
    this.leagueService.setLeague(league);
  }

  tabs: TabConfig[] = [
    { id: 'participants', label: 'Participantes', icon: '👥' },
    { id: 'races', label: 'Carreras', icon: '🏁' },
    { id: 'leaderboard', label: 'Clasificación', icon: '🏆' },
  ];

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}
