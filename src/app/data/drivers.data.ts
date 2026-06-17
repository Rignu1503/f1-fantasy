import { Driver } from '../models';

export const DRIVERS: Driver[] = [
  // Red Bull
  { id: 'verstappen', name: 'Max Verstappen', team: 'Red Bull', teamColor: '#3671C6' },
  { id: 'hadjar', name: 'Isack Hadjar', team: 'Red Bull', teamColor: '#3671C6' },

  // Ferrari
  { id: 'leclerc', name: 'Charles Leclerc', team: 'Ferrari', teamColor: '#E8002D' },
  { id: 'hamilton', name: 'Lewis Hamilton', team: 'Ferrari', teamColor: '#E8002D' },

  // McLaren
  { id: 'norris', name: 'Lando Norris', team: 'McLaren', teamColor: '#FF8000' },
  { id: 'piastri', name: 'Oscar Piastri', team: 'McLaren', teamColor: '#FF8000' },

  // Mercedes
  { id: 'russell', name: 'George Russell', team: 'Mercedes', teamColor: '#27F4D2' },
  { id: 'antonelli', name: 'Kimi Antonelli', team: 'Mercedes', teamColor: '#27F4D2' },

  // Aston Martin
  { id: 'alonso', name: 'Fernando Alonso', team: 'Aston Martin', teamColor: '#229971' },
  { id: 'stroll', name: 'Lance Stroll', team: 'Aston Martin', teamColor: '#229971' },

  // Alpine
  { id: 'gasly', name: 'Pierre Gasly', team: 'Alpine', teamColor: '#0093CC' },
  { id: 'colapinto', name: 'Franco Colapinto', team: 'Alpine', teamColor: '#0093CC' },

  // Racing Bulls
  { id: 'lawson', name: 'Liam Lawson', team: 'Racing Bulls', teamColor: '#6692FF' },
  { id: 'lindblad', name: 'Arvid Lindblad', team: 'Racing Bulls', teamColor: '#6692FF' },

  // Williams
  { id: 'sainz', name: 'Carlos Sainz', team: 'Williams', teamColor: '#64C4FF' },
  { id: 'albon', name: 'Alex Albon', team: 'Williams', teamColor: '#64C4FF' },

  // Audi
  { id: 'hulkenberg', name: 'Nico Hülkenberg', team: 'Audi', teamColor: '#C00000' },
  { id: 'bortoleto', name: 'Gabriel Bortoleto', team: 'Audi', teamColor: '#C00000' },

  // Haas
  { id: 'ocon', name: 'Esteban Ocon', team: 'Haas', teamColor: '#B6BABD' },
  { id: 'bearman', name: 'Oliver Bearman', team: 'Haas', teamColor: '#B6BABD' },

  // Cadillac
  { id: 'perez', name: 'Sergio Perez', team: 'Cadillac', teamColor: '#003DA5' },
  { id: 'bottas', name: 'Valtteri Bottas', team: 'Cadillac', teamColor: '#003DA5' },
];