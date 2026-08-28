import type { Player } from './Player'

export class Team {
  private id: string
  private name: string
  private followers: number
  private country: string
  private createdAt: Date
  private updatedAt: Date
  private players: Player[]

  public constructor(
    id: string,
    name: string,
    followers: number,
    country: string,
    createdAt: Date,
    updatedAt: Date,
    players: Player[] = [],
  ) {
    this.id = id
    this.name = name
    this.followers = followers
    this.country = country
    this.createdAt = new Date(createdAt)
    this.updatedAt = new Date(updatedAt)
    this.players = [...players]
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

  public getFollowers(): number {
    return this.followers
  }

  public setFollowers(followers: number): void {
    this.followers = followers
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

  public getPlayers(): Player[] {
    return [...this.players]
  }

  public setPlayers(players: Player[]): void {
    this.players = [...players]
  }
}
