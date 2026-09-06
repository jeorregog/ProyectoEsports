import { Team } from '../models/Team'
import type { PlayerStorageDTO, TeamStorageDTO } from '../types/storage.types'
import { generateId, readCollection, writeCollection, STORAGE_KEYS } from './storageKeys'
import { PlayerService } from './PlayerService'

export interface CreateTeamInput {
  name: string
  followers: number
  country: string
}

export type UpdateTeamInput = Partial<CreateTeamInput>

function readAllDTOs(): TeamStorageDTO[] {
  return readCollection<TeamStorageDTO>(STORAGE_KEYS.TEAMS)
}

// Team sin players. Se usa para romper la recursión Team <-> Player (ver toModel).
function toShallowModel(dto: TeamStorageDTO): Team {
  return new Team(
    dto.id,
    dto.name,
    dto.followers,
    dto.country,
    new Date(dto.createdAt),
    new Date(dto.updatedAt),
    [],
  )
}

function toModel(dto: TeamStorageDTO): Team {
  const team = toShallowModel(dto)
  team.setPlayers(PlayerService.getByTeamId(dto.id))
  return team
}

export class TeamService {
  public static getAll(): Team[] {
    return readAllDTOs().map(toModel)
  }

  public static getById(id: string): Team | undefined {
    const dto = readAllDTOs().find((item) => item.id === id)
    return dto ? toModel(dto) : undefined
  }

  // Uso interno: Team con players siempre vacío, sin llamar a PlayerService.
  // PlayerService la usa para construir el `team` de un Player sin caer en
  // recursión infinita (Team -> players -> player.team -> players -> ...).
  public static getByIdShallow(id: string): Team | undefined {
    const dto = readAllDTOs().find((item) => item.id === id)
    return dto ? toShallowModel(dto) : undefined
  }

  public static create(input: CreateTeamInput): Team {
    const dtos = readAllDTOs()
    const now = new Date().toISOString()
    const dto: TeamStorageDTO = {
      id: generateId(),
      name: input.name,
      followers: input.followers,
      country: input.country,
      createdAt: now,
      updatedAt: now,
      playerIds: [],
    }

    writeCollection(STORAGE_KEYS.TEAMS, [...dtos, dto])
    return toModel(dto)
  }

  public static update(id: string, input: UpdateTeamInput): Team | undefined {
    const dtos = readAllDTOs()
    const index = dtos.findIndex((item) => item.id === id)
    const current = dtos[index]

    if (!current) {
      return undefined
    }

    const updated: TeamStorageDTO = {
      id: current.id,
      name: input.name ?? current.name,
      followers: input.followers ?? current.followers,
      country: input.country ?? current.country,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
      playerIds: current.playerIds,
    }

    dtos[index] = updated
    writeCollection(STORAGE_KEYS.TEAMS, dtos)
    return toModel(updated)
  }

  // Borra el equipo y en cascada a sus players, porque Player.team es
  // obligatorio en el modelo (un player no puede quedar sin equipo).
  public static delete(id: string): boolean {
    const dtos = readAllDTOs()
    const next = dtos.filter((item) => item.id !== id)

    if (next.length === dtos.length) {
      return false
    }

    writeCollection(STORAGE_KEYS.TEAMS, next)
    PlayerService.deleteByTeamId(id)
    return true
  }

  // Recalcula playerIds a partir de la colección real de players.
  // PlayerStorageDTO.teamId es la fuente de verdad; playerIds es un espejo
  // que se mantiene sincronizado por compatibilidad con el DTO aprobado.
  public static syncPlayerIds(teamId: string): void {
    const dtos = readAllDTOs()
    const index = dtos.findIndex((item) => item.id === teamId)
    const current = dtos[index]

    if (!current) {
      return
    }

    const playerIds = readCollection<PlayerStorageDTO>(STORAGE_KEYS.PLAYERS)
      .filter((item) => item.teamId === teamId)
      .map((item) => item.id)

    dtos[index] = { ...current, playerIds }
    writeCollection(STORAGE_KEYS.TEAMS, dtos)
  }
}
