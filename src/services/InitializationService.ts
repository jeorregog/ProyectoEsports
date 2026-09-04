import { seedMatches, seedPlayers, seedTeams, seedUsers } from '../data/seedData'
import { hasCollection, writeCollection, STORAGE_KEYS } from './storageKeys'

// Siembra LocalStorage en el primer arranque. Cada colección se revisa por
// separado y solo se escribe si no existe, así nunca se sobrescribe algo
// que el usuario ya modificó.
export class InitializationService {
  public static initialize(): void {
    if (!hasCollection(STORAGE_KEYS.USERS)) {
      writeCollection(STORAGE_KEYS.USERS, seedUsers)
    }

    if (!hasCollection(STORAGE_KEYS.TEAMS)) {
      writeCollection(STORAGE_KEYS.TEAMS, seedTeams)
    }

    if (!hasCollection(STORAGE_KEYS.PLAYERS)) {
      writeCollection(STORAGE_KEYS.PLAYERS, seedPlayers)
    }

    if (!hasCollection(STORAGE_KEYS.MATCHES)) {
      writeCollection(STORAGE_KEYS.MATCHES, seedMatches)
    }
  }
}
