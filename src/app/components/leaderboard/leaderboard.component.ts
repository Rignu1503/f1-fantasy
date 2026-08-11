import { Component, OnInit, computed, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { ScoringService } from '../../services/scoring.service';
import { LeagueService } from '../../services/league.service';
import { DRIVERS as F1_DRIVERS } from '../../data/drivers.data';
import { NASCAR_DRIVERS } from '../../data/nascar.data';
import { Participant, Race, RankedParticipant, Driver } from '../../models';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  participants = signal<Participant[]>([]);
  races = signal<Race[]>([]);
  expandedParticipantId = signal<string | null>(null);

  private storageService = inject(StorageService);
  public scoringService = inject(ScoringService);
  private leagueService = inject(LeagueService);

  drivers = computed(() => this.leagueService.activeLeague() === 'F1' ? F1_DRIVERS : NASCAR_DRIVERS);

  ranking = computed(() => {
    return this.scoringService.getRanking(this.participants(), this.races());
  });

  maxPoints = computed(() => {
    const ranks = this.ranking();
    return ranks.length > 0 ? ranks[0].totalPoints : 0;
  });

  constructor() {
    effect(() => {
      const league = this.leagueService.activeLeague();
      this.participants.set(this.storageService.loadParticipants(league));
      this.races.set(this.storageService.loadRaces(league));
      this.expandedParticipantId.set(null);
    });
  }

  ngOnInit(): void {
  }

  getDriverById(id: string): Driver | undefined {
    return this.drivers().find(d => d.id === id);
  }

  getMedal(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return (index + 1).toString();
  }

  getPointsPercentage(points: number): number {
    const max = this.maxPoints();
    if (max === 0) return 0;
    return (points / max) * 100;
  }

  toggleDetails(participantId: string): void {
    if (this.expandedParticipantId() === participantId) {
      this.expandedParticipantId.set(null);
    } else {
      this.expandedParticipantId.set(participantId);
    }
  }

  getDriverRaceResult(driverId: string, race: Race): { points: number; penalties?: string[] } {
    const result = race.results.find(r => r.driverId === driverId);
    return {
      points: this.scoringService.getDriverPointsForRace(driverId, race),
      penalties: result?.penalties
    };
  }

  getPenaltyLabels(penaltyIds: string[] | undefined): string {
    if (!penaltyIds || penaltyIds.length === 0) return '';
    const labels: Record<string, string> = {
      '5s': '5s',
      '10s': '10s',
      '20s': '20s',
      'monetary': 'Multa',
      'stop-and-go': 'Stop & Go',
      'dsquared': 'DSQ'
    };
    return penaltyIds.map(id => labels[id] || id).join(', ');
  }
}
