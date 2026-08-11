import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { LeagueService } from '../../services/league.service';
import { DRIVERS as F1_DRIVERS } from '../../data/drivers.data';
import { NASCAR_DRIVERS } from '../../data/nascar.data';
import { Participant, Driver } from '../../models';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css'
})
export class ParticipantsComponent implements OnInit {
  participants = signal<Participant[]>([]);
  newName = signal<string>('');
  selectedDriverIds = signal<string[]>([]);
  
  private storageService = inject(StorageService);
  private leagueService = inject(LeagueService);

  drivers = computed(() => this.leagueService.activeLeague() === 'F1' ? F1_DRIVERS : NASCAR_DRIVERS);

  constructor() {
    effect(() => {
      const league = this.leagueService.activeLeague();
      this.participants.set(this.storageService.loadParticipants(league));
      this.selectedDriverIds.set([]); // Limpiar selección al cambiar de liga
    });
  }

  ngOnInit(): void {
  }

  getDriverById(id: string): Driver | undefined {
    return this.drivers().find(d => d.id === id);
  }

  isDriverSelected(driverId: string): boolean {
    return this.selectedDriverIds().includes(driverId);
  }

  isDriverTaken(driverId: string): boolean {
    return false; // Permite que varios jugadores elijan al mismo piloto
  }

  toggleDriver(driverId: string): void {
    if (this.isDriverTaken(driverId)) return;

    const current = this.selectedDriverIds();
    if (current.includes(driverId)) {
      this.selectedDriverIds.set(current.filter(id => id !== driverId));
    } else if (current.length < 4) {
      this.selectedDriverIds.set([...current, driverId]);
    }
  }

  addParticipant(): void {
    const name = this.newName().trim();
    if (!name || this.selectedDriverIds().length !== 4) return;
    
    if (this.participants().some(p => p.name.toLowerCase() === name.toLowerCase())) {
      alert('Ya existe un participante con ese nombre');
      return;
    }

    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
      driverIds: this.selectedDriverIds(),
      locked: true
    };

    const updated = [...this.participants(), newParticipant];
    this.participants.set(updated);
    this.storageService.saveParticipants(this.leagueService.activeLeague(), updated);
    
    this.newName.set('');
    this.selectedDriverIds.set([]);
  }

  removeParticipant(id: string): void {
    if (confirm('¿Estás seguro de eliminar este participante?')) {
      const updated = this.participants().filter(p => p.id !== id);
      this.participants.set(updated);
      this.storageService.saveParticipants(this.leagueService.activeLeague(), updated);
    }
  }
}
