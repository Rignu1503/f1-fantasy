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
  penalties = signal<Record<string, string[]>>({});
  showForm = signal<boolean>(false);
  expandedRaceId = signal<string | null>(null);
  editingRaceId = signal<string | null>(null);
  openPenaltyDropdownId = signal<string | null>(null);
  savedMessage = signal<string>('');

  penaltyOptions = [
    { id: '5s', label: '5s (-7 pts)' },
    { id: '10s', label: '10s (-10 pts)' },
    { id: '20s', label: '20s (-15 pts)' },
    { id: 'monetary', label: 'Multa (-3 pts)' },
    { id: 'stop-and-go', label: 'Stop & Go (-7 pts)' },
    { id: 'dsquared', label: 'DSQ (-30 pts)' }
  ];

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
    const pens: Record<string, string[]> = {};
    this.drivers.forEach(d => {
      pos[d.id] = -1; // -1 means unset
      pens[d.id] = [];
    });
    this.positions.set(pos);
    this.penalties.set(pens);
  }

  togglePenaltyDropdown(driverId: string, event: Event): void {
    event.stopPropagation();
    if (this.openPenaltyDropdownId() === driverId) {
      this.openPenaltyDropdownId.set(null);
    } else {
      this.openPenaltyDropdownId.set(driverId);
    }
  }

  setPosition(driverId: string, positionStr: string): void {
    const pos = { ...this.positions() };
    pos[driverId] = parseInt(positionStr, 10);
    this.positions.set(pos);
  }

  togglePenalty(driverId: string, penaltyId: string): void {
    const pens = { ...this.penalties() };
    const driverPens = pens[driverId] ? [...pens[driverId]] : [];
    
    if (driverPens.includes(penaltyId)) {
      pens[driverId] = driverPens.filter(p => p !== penaltyId);
    } else {
      driverPens.push(penaltyId);
      pens[driverId] = driverPens;
    }
    this.penalties.set(pens);
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
    const penObj = this.penalties();
    
    Object.keys(posObj).forEach(driverId => {
      const position = posObj[driverId];
      if (position !== -1) {
        results.push({ 
          driverId, 
          position,
          penalties: penObj[driverId] || []
        });
      }
    });

    const newRace: Race = {
      id: this.editingRaceId() || Date.now().toString(),
      name: this.raceName().trim(),
      date: this.raceDate(),
      results
    };

    let updated: Race[];
    if (this.editingRaceId()) {
      updated = this.races().map(r => r.id === this.editingRaceId() ? newRace : r);
      this.savedMessage.set(`¡Resultados de ${newRace.name} actualizados!`);
    } else {
      updated = [newRace, ...this.races()];
      this.savedMessage.set(`¡Resultados de ${newRace.name} guardados!`);
    }

    this.races.set(updated);
    this.storageService.saveRaces(updated);

    this.resetForm();
    setTimeout(() => this.savedMessage.set(''), 3000);
  }

  resetForm(): void {
    this.raceName.set('');
    const today = new Date().toISOString().split('T')[0];
    this.raceDate.set(today);
    this.initPositions();
    this.showForm.set(false);
    this.editingRaceId.set(null);
    this.openPenaltyDropdownId.set(null);
  }

  toggleForm(): void {
    if (this.showForm()) {
      this.resetForm();
    } else {
      this.showForm.set(true);
    }
  }

  editRace(race: Race, event: Event): void {
    event.stopPropagation();
    this.editingRaceId.set(race.id);
    this.raceName.set(race.name);
    this.raceDate.set(race.date);
    
    const pos: Record<string, number> = {};
    const pens: Record<string, string[]> = {};
    this.drivers.forEach(d => {
      pos[d.id] = -1;
      pens[d.id] = [];
    });
    
    race.results.forEach(r => {
      pos[r.driverId] = r.position;
      pens[r.driverId] = r.penalties || [];
    });
    
    this.positions.set(pos);
    this.penalties.set(pens);
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    return Array.from({length: 22}, (_, i) => i + 1);
  }

  getPenaltyLabels(penaltyIds: string[] | undefined): string {
    if (!penaltyIds || penaltyIds.length === 0) return '';
    return penaltyIds.map(id => this.penaltyOptions.find(p => p.id === id)?.label || id).join(', ');
  }
}
