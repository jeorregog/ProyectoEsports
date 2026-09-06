import { Match } from '../models/Match'
import type { Team } from '../models/Team'
import type { MatchStorageDTO } from '../types/storage.types'
import { generateId, readCollection, writeCollection, STORAGE_KEYS } from './storageKeys'
import { TeamService } from './TeamService'

export interface CreateMatchInput {
  game: string
  date: Date
  team1Id: string
  team2Id: string
  winnerId: string
}

export type UpdateMatchInput = Partial<CreateMatchInput>

function readAllDTOs(): MatchStorageDTO[] {
  return readCollection<MatchStorageDTO>(STORAGE_KEYS.MATCHES)
}

function toDTO(match: Match): MatchStorageDTO {
  return {
    id: match.getId(),
    game: match.getGame(),
    date: match.getDate().toISOString(),
    team1Id: match.getTeam1().getId(),
    team2Id: match.getTeam2().getId(),
    winnerId: match.getWinner().getId(),
  }
}

function resolveWinner(winnerId: string, team1: Team, team2: Team): Team {
  if (winnerId === team1.getId()) {
    return team1
  }

  if (winnerId === team2.getId()) {
    return team2
  }

  throw new Error('Match winner must be one of the participating teams')
}

// Usa el accesor "shallow" de TeamService: un match no necesita la lista de players.
function toModel(dto: MatchStorageDTO): Match {
  const team1 = TeamService.getByIdShallow(dto.team1Id)
  const team2 = TeamService.getByIdShallow(dto.team2Id)

  if (!team1 || !team2) {
    throw new Error(`Match "${dto.id}" references a team that does not exist`)
  }

  const winner = resolveWinner(dto.winnerId, team1, team2)
  return new Match(dto.id, dto.game, new Date(dto.date), team1, team2, winner)
}

export class MatchService {
  public static getAll(): Match[] {
    return readAllDTOs().map(toModel)
  }

  public static getById(id: string): Match | undefined {
    const dto = readAllDTOs().find((item) => item.id === id)
    return dto ? toModel(dto) : undefined
  }

  public static getByTeamId(teamId: string): Match[] {
    return readAllDTOs()
      .filter((item) => item.team1Id === teamId || item.team2Id === teamId)
      .map(toModel)
  }

  public static create(input: CreateMatchInput): Match {
    const team1 = TeamService.getByIdShallow(input.team1Id)
    const team2 = TeamService.getByIdShallow(input.team2Id)

    if (!team1 || !team2) {
      throw new Error('Cannot create match: one or both teams do not exist')
    }

    const winner = resolveWinner(input.winnerId, team1, team2)
    // El constructor de Match vuelve a validar (equipos distintos, winner
    // participante) como garantía a nivel de dominio.
    const match = new Match(generateId(), input.game, input.date, team1, team2, winner)

    writeCollection(STORAGE_KEYS.MATCHES, [...readAllDTOs(), toDTO(match)])
    return match
  }

  public static update(id: string, input: UpdateMatchInput): Match | undefined {
    const dtos = readAllDTOs()
    const index = dtos.findIndex((item) => item.id === id)
    const current = dtos[index]

    if (!current) {
      return undefined
    }

    const game = input.game ?? current.game
    const date = input.date ?? new Date(current.date)
    const team1Id = input.team1Id ?? current.team1Id
    const team2Id = input.team2Id ?? current.team2Id
    const winnerId = input.winnerId ?? current.winnerId

    const team1 = TeamService.getByIdShallow(team1Id)
    const team2 = TeamService.getByIdShallow(team2Id)

    if (!team1 || !team2) {
      throw new Error('Cannot update match: one or both teams do not exist')
    }

    const winner = resolveWinner(winnerId, team1, team2)
    const match = new Match(current.id, game, date, team1, team2, winner)

    dtos[index] = toDTO(match)
    writeCollection(STORAGE_KEYS.MATCHES, dtos)
    return match
  }

  public static delete(id: string): boolean {
    const dtos = readAllDTOs()
    const next = dtos.filter((item) => item.id !== id)

    if (next.length === dtos.length) {
      return false
    }

    writeCollection(STORAGE_KEYS.MATCHES, next)
    return true
  }
}
