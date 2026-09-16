import { describe, expect, it } from 'vitest'
import { Match } from '../src/models/Match'
import { Team } from '../src/models/Team'

function createTeam(id: string, name: string): Team {
  const date = new Date('2026-01-01T00:00:00.000Z')

  return new Team(id, name, 1000, 'CO', date, date)
}

describe('Match', () => {
  const team1 = createTeam('team-1', 'Team One')
  const team2 = createTeam('team-2', 'Team Two')

  it('debe crear una partida con equipos diferentes', () => {
    const date = new Date('2026-02-01T00:00:00.000Z')

    const match = new Match(
      'match-1',
      'Valorant',
      date,
      team1,
      team2,
      team1,
    )

    expect(match.getId()).toBe('match-1')
    expect(match.getGame()).toBe('Valorant')
    expect(match.getTeam1()).toBe(team1)
    expect(match.getTeam2()).toBe(team2)
    expect(match.getWinner()).toBe(team1)
  })

  it('debe permitir que el segundo equipo sea el ganador', () => {
    const match = new Match(
      'match-2',
      'Valorant',
      new Date('2026-02-01T00:00:00.000Z'),
      team1,
      team2,
      team2,
    )

    expect(match.getWinner()).toBe(team2)
  })

  it('debe rechazar una partida con el mismo equipo en ambos lados', () => {
    expect(() => {
      new Match(
        'match-3',
        'Valorant',
        new Date('2026-02-01T00:00:00.000Z'),
        team1,
        team1,
        team1,
      )
    }).toThrow('Match teams must be different')
  })

  it('debe rechazar un ganador que no participa en la partida', () => {
    const team3 = createTeam('team-3', 'Team Three')

    expect(() => {
      new Match(
        'match-4',
        'Valorant',
        new Date('2026-02-01T00:00:00.000Z'),
        team1,
        team2,
        team3,
      )
    }).toThrow('Match winner must be one of the participating teams')
  })
})