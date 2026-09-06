import { Player } from '../models/Player'
import type { PlayerStorageDTO } from '../types/storage.types'
import { generateId, readCollection, writeCollection, STORAGE_KEYS } from './storageKeys'
import { TeamService } from './TeamService'

export interface CreatePlayerInput {
  name: string
  nickname: string
  wins: number
  earnings: number
  role: string
  country: string
  teamId: string
}

export type UpdatePlayerInput = Partial<CreatePlayerInput>

function readAllDTOs(): PlayerStorageDTO[] {
  return readCollection<PlayerStorageDTO>(STORAGE_KEYS.PLAYERS)
}

// Usa el accesor "shallow" de TeamService para evitar la recursión Team <-> Player.
function toModel(dto: PlayerStorageDTO): Player {
  const team = TeamService.getByIdShallow(dto.teamId)

  if (!team) {
    throw new Error(`Player "${dto.id}" references team "${dto.teamId}", which does not exist`)
  }

  return new Player(
    dto.id,
    dto.name,
    dto.nickname,
    dto.wins,
    dto.earnings,
    dto.role,
    dto.country,
    new Date(dto.createdAt),
    new Date(dto.updatedAt),
    team,
  )
}

export class PlayerService {
  public static getAll(): Player[] {
    return readAllDTOs().map(toModel)
  }

  public static getById(id: string): Player | undefined {
    const dto = readAllDTOs().find((item) => item.id === id)
    return dto ? toModel(dto) : undefined
  }

  public static getByTeamId(teamId: string): Player[] {
    return readAllDTOs()
      .filter((item) => item.teamId === teamId)
      .map(toModel)
  }

  public static create(input: CreatePlayerInput): Player {
    if (!TeamService.getByIdShallow(input.teamId)) {
      throw new Error(`Cannot create player: team "${input.teamId}" does not exist`)
    }

    const dtos = readAllDTOs()
    const now = new Date().toISOString()
    const dto: PlayerStorageDTO = {
      id: generateId(),
      name: input.name,
      nickname: input.nickname,
      wins: input.wins,
      earnings: input.earnings,
      role: input.role,
      country: input.country,
      createdAt: now,
      updatedAt: now,
      teamId: input.teamId,
    }

    writeCollection(STORAGE_KEYS.PLAYERS, [...dtos, dto])
    TeamService.syncPlayerIds(input.teamId)
    return toModel(dto)
  }

  public static update(id: string, input: UpdatePlayerInput): Player | undefined {
    const dtos = readAllDTOs()
    const index = dtos.findIndex((item) => item.id === id)
    const current = dtos[index]

    if (!current) {
      return undefined
    }

    const nextTeamId = input.teamId ?? current.teamId

    if (input.teamId && !TeamService.getByIdShallow(input.teamId)) {
      throw new Error(`Cannot update player: team "${input.teamId}" does not exist`)
    }

    const updated: PlayerStorageDTO = {
      id: current.id,
      name: input.name ?? current.name,
      nickname: input.nickname ?? current.nickname,
      wins: input.wins ?? current.wins,
      earnings: input.earnings ?? current.earnings,
      role: input.role ?? current.role,
      country: input.country ?? current.country,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
      teamId: nextTeamId,
    }

    dtos[index] = updated
    writeCollection(STORAGE_KEYS.PLAYERS, dtos)

    // Si cambió de equipo, hay que sincronizar playerIds en ambos equipos.
    TeamService.syncPlayerIds(nextTeamId)
    if (current.teamId !== nextTeamId) {
      TeamService.syncPlayerIds(current.teamId)
    }

    return toModel(updated)
  }

  public static delete(id: string): boolean {
    const dtos = readAllDTOs()
    const target = dtos.find((item) => item.id === id)

    if (!target) {
      return false
    }

    writeCollection(
      STORAGE_KEYS.PLAYERS,
      dtos.filter((item) => item.id !== id),
    )
    TeamService.syncPlayerIds(target.teamId)
    return true
  }

  // Uso interno: borra todos los players de un equipo, sin validar que el
  // equipo exista. La usa TeamService.delete para la cascada.
  public static deleteByTeamId(teamId: string): void {
    const dtos = readAllDTOs()
    writeCollection(
      STORAGE_KEYS.PLAYERS,
      dtos.filter((item) => item.teamId !== teamId),
    )
  }
}
