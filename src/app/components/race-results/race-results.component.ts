import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { DRIVERS } from '../../data/drivers.data';
import { Race, RaceResult } from '../../models';

@Component({
  selector: 'app-race-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './race-results.component.html',
  styleUrl: './race-results.component.css'
})
export class RaceResultsComponent implements OnInit {
  races = signal<Race[]>([]);
  raceName = signal<string>('');
  raceDate = signal<string>('');
  positions = signal<Record<string, number>>({});
  showForm = signal<boolean>(false);
  expandedRaceId = signal<string | null>(null);
  savedMessage = signal<string>('');

  drivers = DRIVERS;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.races.set(this.storageService.loadRaces());
    this.initPositions();
    const today = new Date().toISOString().split('T')[0];
    this.raceDate.set(today);
  }

  initPositions(): void {
    const pos: Record<string, number> = {};
    this.drivers.forEach(d => pos[d.id] = -1); // -1 means unset
    this.positions.set(pos);
  }

  setPosition(driverId: string, positionStr: string): void {
    const pos = { ...this.positions() };
    pos[driverId] = parseInt(positionStr, 10);
    this.positions.set(pos);
  }

  hasPositionConflict(driverId: string): boolean {
    const pos = this.positions()[driverId];
    if (pos <= 0) return false; // DNF (0) or unset (-1) can be duplicated
    
    let count = 0;
    Object.values(this.positions()).forEach(p => {
      if (p === pos) count++;
    });
    return count > 1;
  }

  isFormValid(): boolean {
    if (!this.raceName().trim()) return false;
    
    let hasSetPosition = false;
    let hasConflict = false;
    
    const posObj = this.positions();
    const posCounts: Record<number, number> = {};
    
    Object.values(posObj).forEach(p => {
      if (p !== -1) hasSetPosition = true;
      if (p > 0) {
        posCounts[p] = (posCounts[p] || 0) + 1;
        if (posCounts[p] > 1) hasConflict = true;
      }
    });

    return hasSetPosition && !hasConflict;
  }

  saveRace(): void {
    if (!this.isFormValid()) return;

    const results: RaceResult[] = [];
    const posObj = this.positions();
    
    Object.keys(posObj).forEach(driverId => {
      const position = posObj[driverId];
      if (position !== -1) {
        results.push({ driverId, position });
      }
    });

    const newRace: Race = {
      id: Date.now().toString(),
      name: this.raceName().trim(),
      date: this.raceDate(),
      results
    };

    const updated = [newRace, ...this.races()];
    this.races.set(updated);
    this.storageService.saveRaces(updated);

    // Reset form
    this.raceName.set('');
    this.initPositions();
    this.showForm.set(false);
    
    // Show confirmation
    this.savedMessage.set(`¡Resultados de ${newRace.name} guardados!`);
    setTimeout(() => this.savedMessage.set(''), 3000);
  }

  clearAllRaces(): void {
    if (confirm('¿Estás seguro de eliminar TODOS los resultados de carreras? Esta acción no se puede deshacer.')) {
      this.races.set([]);
      this.storageService.saveRaces([]);
      this.expandedRaceId.set(null);
    }
  }

  deleteRace(id: string): void {
    if (confirm('¿Estás seguro de eliminar los resultados de esta carrera?')) {
      const updated = this.races().filter(r => r.id !== id);
      this.races.set(updated);
      this.storageService.saveRaces(updated);
      if (this.expandedRaceId() === id) this.expandedRaceId.set(null);
    }
  }

  toggleRaceDetails(raceId: string): void {
    if (this.expandedRaceId() === raceId) {
      this.expandedRaceId.set(null);
    } else {
      this.expandedRaceId.set(raceId);
    }
  }

  getDriverName(driverId: string): string {
    return this.drivers.find(d => d.id === driverId)?.name || 'Desconocido';
  }

  getDriverTeamColor(driverId: string): string {
    return this.drivers.find(d => d.id === driverId)?.teamColor || '#ffffff';
  }

  getPositionLabel(position: number): string {
    if (position === -1) return '--';
    if (position === 0) return 'DNF';
    return `P${position}`;
  }
  
  getPositionsArray(): number[] {
    return Array.from({length: 20}, (_, i) => i + 1);
  }
}
