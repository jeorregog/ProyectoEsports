import type { User } from '../models/User'
import { UserService } from './UserService'
import { readSessionUserId, writeSessionUserId } from './storageKeys'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
}

// Nota: password se compara en texto plano, sin hashing. Ningún documento del
// proyecto pide hashing para el Entregable 1; confirmar con el equipo antes
// del Entregable 2.
export class AuthService {
  public static login(credentials: LoginCredentials): User {
    const user = UserService.getByEmail(credentials.email)

    if (!user || user.getPassword() !== credentials.password) {
      throw new Error('Invalid email or password')
    }

    writeSessionUserId(user.getId())
    return user
  }

  public static logout(): void {
    writeSessionUserId(null)
  }

  // Registra un usuario no-admin y arranca su sesión. isAdmin no se expone
  // aquí a propósito: las cuentas admin se gestionan desde AdminUsersView.
  public static register(input: RegisterInput): User {
    const user = UserService.create({
      username: input.username,
      email: input.email,
      password: input.password,
      isAdmin: false,
    })

    writeSessionUserId(user.getId())
    return user
  }

  public static getCurrentUser(): User | undefined {
    const userId = readSessionUserId()
    return userId ? UserService.getById(userId) : undefined
  }

  public static isAuthenticated(): boolean {
    return this.getCurrentUser() !== undefined
  }

  public static isAdmin(): boolean {
    return this.getCurrentUser()?.getIsAdmin() ?? false
  }
}
