import type { Team } from './Team'

export class Player {
  private id: string
  private name: string
  private nickname: string
  private wins: number
  private earnings: number
  private role: string
  private country: string
  private createdAt: Date
  private updatedAt: Date
  private team: Team

  public constructor(
    id: string,
    name: string,
    nickname: string,
    wins: number,
    earnings: number,
    role: string,
    country: string,
    createdAt: Date,
    updatedAt: Date,
    team: Team,
  ) {
    this.id = id
    this.name = name
    this.nickname = nickname
    this.wins = wins
    this.earnings = earnings
    this.role = role
    this.country = country
    this.createdAt = new Date(createdAt)
    this.updatedAt = new Date(updatedAt)
    this.team = team
  }

  public getId(): string {
    return this.id
  }

  public setId(id: string): void {
    this.id = id
  }

  public getName(): string {
    return this.name
  }

  public setName(name: string): void {
    this.name = name
  }

  public getNickname(): string {
    return this.nickname
  }

  public setNickname(nickname: string): void {
    this.nickname = nickname
  }

  public getWins(): number {
    return this.wins
  }

  public setWins(wins: number): void {
    this.wins = wins
  }

  public getEarnings(): number {
    return this.earnings
  }

  public setEarnings(earnings: number): void {
    this.earnings = earnings
  }

  public getRole(): string {
    return this.role
  }

  public setRole(role: string): void {
    this.role = role
  }

  public getCountry(): string {
    return this.country
  }

  public setCountry(country: string): void {
    this.country = country
  }

  public getCreatedAt(): Date {
    return new Date(this.createdAt)
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = new Date(createdAt)
  }

  public getUpdatedAt(): Date {
    return new Date(this.updatedAt)
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = new Date(updatedAt)
  }

  public getTeam(): Team {
    return this.team
  }

  public setTeam(team: Team): void {
    this.team = team
  }
}
