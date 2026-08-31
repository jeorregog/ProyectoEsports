// Claves de LocalStorage. Solo los Services pueden usar este archivo directamente.

export const STORAGE_KEYS = {
  USERS: 'esports:users',
  PLAYERS: 'esports:players',
  TEAMS: 'esports:teams',
  MATCHES: 'esports:matches',
  SESSION: 'esports:session',
} as const

export type CollectionStorageKey =
  | typeof STORAGE_KEYS.USERS
  | typeof STORAGE_KEYS.PLAYERS
  | typeof STORAGE_KEYS.TEAMS
  | typeof STORAGE_KEYS.MATCHES

// Lee un arreglo desde LocalStorage. Si no existe o está corrupto, devuelve [].
export function readCollection<T>(key: CollectionStorageKey): T[] {
  const raw = localStorage.getItem(key)

  if (raw === null) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : []
  } catch {
    return []
  }
}

export function writeCollection<T>(key: CollectionStorageKey, collection: T[]): void {
  localStorage.setItem(key, JSON.stringify(collection))
}

// Usado por InitializationService para saber si ya hay datos sembrados.
export function hasCollection(key: CollectionStorageKey): boolean {
  return localStorage.getItem(key) !== null
}

export function readSessionUserId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.SESSION)
}

export function writeSessionUserId(userId: string | null): void {
  if (userId === null) {
    localStorage.removeItem(STORAGE_KEYS.SESSION)
    return
  }

  localStorage.setItem(STORAGE_KEYS.SESSION, userId)
}
