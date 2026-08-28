export class User {
  private id: string
  private username: string
  private email: string
  private password: string
  private isAdmin: boolean
  private createdAt: Date
  private updatedAt: Date

  public constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    isAdmin: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id
    this.username = username
    this.email = email
    this.password = password
    this.isAdmin = isAdmin
    this.createdAt = new Date(createdAt)
    this.updatedAt = new Date(updatedAt)
  }

  public getId(): string {
    return this.id
  }

  public setId(id: string): void {
    this.id = id
  }

  public getUsername(): string {
    return this.username
  }

  public setUsername(username: string): void {
    this.username = username
  }

  public getEmail(): string {
    return this.email
  }

  public setEmail(email: string): void {
    this.email = email
  }

  public getPassword(): string {
    return this.password
  }

  public setPassword(password: string): void {
    this.password = password
  }

  public getIsAdmin(): boolean {
    return this.isAdmin
  }

  public setIsAdmin(isAdmin: boolean): void {
    this.isAdmin = isAdmin
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
}
