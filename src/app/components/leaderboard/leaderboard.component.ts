import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { ScoringService } from '../../services/scoring.service';
import { DRIVERS } from '../../data/drivers.data';
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

  drivers = DRIVERS;

  ranking = computed(() => {
    return this.scoringService.getRanking(this.participants(), this.races());
  });

  maxPoints = computed(() => {
    const ranks = this.ranking();
    return ranks.length > 0 ? ranks[0].totalPoints : 0;
  });

  constructor(
    private storageService: StorageService,
    public scoringService: ScoringService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.participants.set(this.storageService.loadParticipants());
    this.races.set(this.storageService.loadRaces());
  }

  getDriverById(id: string): Driver | undefined {
    return this.drivers.find(d => d.id === id);
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

  getDriverPointsByRace(driverId: string): { raceName: string; points: number }[] {
    return this.races().map(race => ({
      raceName: race.name,
      points: this.scoringService.getDriverPointsForRace(driverId, race)
    }));
  }
}
