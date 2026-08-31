import { User } from '../models/User'
import type { UserStorageDTO } from '../types/storage.types'
import { readCollection, writeCollection, STORAGE_KEYS } from './storageKeys'

export interface CreateUserInput {
  username: string
  email: string
  password: string
  isAdmin: boolean
}

export type UpdateUserInput = Partial<CreateUserInput>

function toModel(dto: UserStorageDTO): User {
  return new User(
    dto.id,
    dto.username,
    dto.email,
    dto.password,
    dto.isAdmin,
    new Date(dto.createdAt),
    new Date(dto.updatedAt),
  )
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function readAllDTOs(): UserStorageDTO[] {
  return readCollection<UserStorageDTO>(STORAGE_KEYS.USERS)
}

export class UserService {
  public static getAll(): User[] {
    return readAllDTOs().map(toModel)
  }

  public static getById(id: string): User | undefined {
    const dto = readAllDTOs().find((item) => item.id === id)
    return dto ? toModel(dto) : undefined
  }

  public static getByEmail(email: string): User | undefined {
    const target = normalizeEmail(email)
    const dto = readAllDTOs().find((item) => normalizeEmail(item.email) === target)
    return dto ? toModel(dto) : undefined
  }

  public static create(input: CreateUserInput): User {
    const dtos = readAllDTOs()

    if (dtos.some((item) => normalizeEmail(item.email) === normalizeEmail(input.email))) {
      throw new Error(`A user with email "${input.email}" already exists`)
    }

    const now = new Date().toISOString()
    const dto: UserStorageDTO = {
      id: crypto.randomUUID(),
      username: input.username,
      email: input.email,
      password: input.password,
      isAdmin: input.isAdmin,
      createdAt: now,
      updatedAt: now,
    }

    writeCollection(STORAGE_KEYS.USERS, [...dtos, dto])
    return toModel(dto)
  }

  public static update(id: string, input: UpdateUserInput): User | undefined {
    const dtos = readAllDTOs()
    const index = dtos.findIndex((item) => item.id === id)
    const current = dtos[index]

    if (!current) {
      return undefined
    }

    // Evita que un update deje a dos usuarios con el mismo email.
    const nextEmail = input.email
    if (
      nextEmail &&
      dtos.some(
        (item) => item.id !== id && normalizeEmail(item.email) === normalizeEmail(nextEmail),
      )
    ) {
      throw new Error(`A user with email "${nextEmail}" already exists`)
    }

    const updated: UserStorageDTO = {
      id: current.id,
      username: input.username ?? current.username,
      email: input.email ?? current.email,
      password: input.password ?? current.password,
      isAdmin: input.isAdmin ?? current.isAdmin,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    }

    dtos[index] = updated
    writeCollection(STORAGE_KEYS.USERS, dtos)
    return toModel(updated)
  }

  public static delete(id: string): boolean {
    const dtos = readAllDTOs()
    const next = dtos.filter((item) => item.id !== id)

    if (next.length === dtos.length) {
      return false
    }

    writeCollection(STORAGE_KEYS.USERS, next)
    return true
  }
}
