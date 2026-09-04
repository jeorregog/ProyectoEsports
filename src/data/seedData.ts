import type {
  UserStorageDTO,
  TeamStorageDTO,
  PlayerStorageDTO,
  MatchStorageDTO,
} from '../types/storage.types'

// Datos ficticios iniciales. Solo InitializationService debe importar este archivo.

const SEEDED_AT = new Date('2026-01-15T12:00:00.000Z').toISOString()

export const seedUsers: UserStorageDTO[] = [
  {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@esports.com',
    password: 'admin123',
    isAdmin: true,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
  {
    id: 'user-viewer',
    username: 'viewer',
    email: 'viewer@esports.com',
    password: 'viewer123',
    isAdmin: false,
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
  },
]

export const seedTeams: TeamStorageDTO[] = [
  {
    id: 'team-1',
    name: 'Crimson Wolves',
    followers: 452000,
    country: 'South Korea',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    playerIds: ['player-1', 'player-2'],
  },
  {
    id: 'team-2',
    name: 'Iron Falcons',
    followers: 318500,
    country: 'Germany',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    playerIds: ['player-3', 'player-4'],
  },
  {
    id: 'team-3',
    name: 'Neon Serpents',
    followers: 276300,
    country: 'Brazil',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    playerIds: ['player-5', 'player-6'],
  },
]

export const seedPlayers: PlayerStorageDTO[] = [
  {
    id: 'player-1',
    name: 'Min-jun Park',
    nickname: 'Frostbite',
    wins: 128,
    earnings: 185000,
    role: 'Duelist',
    country: 'South Korea',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    teamId: 'team-1',
  },
  {
    id: 'player-2',
    name: 'Ji-ho Lee',
    nickname: 'Wraith',
    wins: 96,
    earnings: 121000,
    role: 'Support',
    country: 'South Korea',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    teamId: 'team-1',
  },
  {
    id: 'player-3',
    name: 'Lukas Becker',
    nickname: 'Ironclad',
    wins: 84,
    earnings: 97500,
    role: 'Tank',
    country: 'Germany',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    teamId: 'team-2',
  },
  {
    id: 'player-4',
    name: 'Finn Hoffmann',
    nickname: 'Vortex',
    wins: 77,
    earnings: 88200,
    role: 'Sniper',
    country: 'Germany',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    teamId: 'team-2',
  },
  {
    id: 'player-5',
    name: 'Rafael Souza',
    nickname: 'Cobra',
    wins: 63,
    earnings: 71000,
    role: 'IGL',
    country: 'Brazil',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    teamId: 'team-3',
  },
  {
    id: 'player-6',
    name: 'Gabriel Almeida',
    nickname: 'Viper',
    wins: 59,
    earnings: 64500,
    role: 'Entry Fragger',
    country: 'Brazil',
    createdAt: SEEDED_AT,
    updatedAt: SEEDED_AT,
    teamId: 'team-3',
  },
]

export const seedMatches: MatchStorageDTO[] = [
  {
    id: 'match-1',
    game: 'Valorant',
    date: new Date('2026-01-05T18:00:00.000Z').toISOString(),
    team1Id: 'team-1',
    team2Id: 'team-2',
    winnerId: 'team-1',
  },
  {
    id: 'match-2',
    game: 'League of Legends',
    date: new Date('2026-01-08T20:00:00.000Z').toISOString(),
    team1Id: 'team-2',
    team2Id: 'team-3',
    winnerId: 'team-3',
  },
  {
    id: 'match-3',
    game: 'Valorant',
    date: new Date('2026-01-12T19:30:00.000Z').toISOString(),
    team1Id: 'team-1',
    team2Id: 'team-3',
    winnerId: 'team-1',
  },
]
