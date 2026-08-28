import type { Team } from './Team'

export class Match {
  private id: string
  private game: string
  private date: Date
  private team1: Team
  private team2: Team
  private winner: Team

  public constructor(id: string, game: string, date: Date, team1: Team, team2: Team, winner: Team) {
    this.ensureDifferentTeams(team1, team2)
    this.ensureWinnerBelongsToMatch(winner, team1, team2)

    this.id = id
    this.game = game
    this.date = new Date(date)
    this.team1 = team1
    this.team2 = team2
    this.winner = winner
  }

  public getId(): string {
    return this.id
  }

  public setId(id: string): void {
    this.id = id
  }

  public getGame(): string {
    return this.game
  }

  public setGame(game: string): void {
    this.game = game
  }

  public getDate(): Date {
    return new Date(this.date)
  }

  public setDate(date: Date): void {
    this.date = new Date(date)
  }

  public getTeam1(): Team {
    return this.team1
  }

  public setTeam1(team1: Team): void {
    this.ensureDifferentTeams(team1, this.team2)
    this.ensureWinnerBelongsToMatch(this.winner, team1, this.team2)
    this.team1 = team1
  }

  public getTeam2(): Team {
    return this.team2
  }

  public setTeam2(team2: Team): void {
    this.ensureDifferentTeams(this.team1, team2)
    this.ensureWinnerBelongsToMatch(this.winner, this.team1, team2)
    this.team2 = team2
  }

  public getWinner(): Team {
    return this.winner
  }

  public setWinner(winner: Team): void {
    this.ensureWinnerBelongsToMatch(winner, this.team1, this.team2)
    this.winner = winner
  }

  private ensureDifferentTeams(team1: Team, team2: Team): void {
    if (team1.getId() === team2.getId()) {
      throw new Error('Match teams must be different')
    }
  }

  private ensureWinnerBelongsToMatch(winner: Team, team1: Team, team2: Team): void {
    const winnerId = winner.getId()

    if (winnerId !== team1.getId() && winnerId !== team2.getId()) {
      throw new Error('Match winner must be one of the participating teams')
    }
  }
}
