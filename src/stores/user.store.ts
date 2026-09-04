import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import { UserService, type CreateUserInput, type UpdateUserInput } from '../services/UserService'
import type { User } from '../models/User'

export const useUserStore = defineStore('users', () => {
  const users = shallowRef<User[]>([])

  const userCount = computed(() => users.value.length)

  function fetchUsers(): User[] {
    users.value = UserService.getAll()
    return users.value
  }

  function getUserById(id: string): User | undefined {
    return users.value.find((user) => user.getId() === id)
  }

  function getUserByEmail(email: string): User | undefined {
    return users.value.find(
      (user) => user.getEmail().trim().toLowerCase() === email.trim().toLowerCase(),
    )
  }

  function createUser(input: CreateUserInput): User {
    const user = UserService.create(input)
    users.value = [...users.value, user]
    return user
  }

  function updateUser(id: string, input: UpdateUserInput): User | undefined {
    const user = UserService.update(id, input)

    if (!user) {
      return undefined
    }

    const index = users.value.findIndex((item) => item.getId() === id)
    users.value =
      index === -1
        ? [...users.value, user]
        : users.value.map((item, i) => (i === index ? user : item))

    return user
  }

  function deleteUser(id: string): boolean {
    const deleted = UserService.delete(id)

    if (deleted) {
      users.value = users.value.filter((user) => user.getId() !== id)
    }

    return deleted
  }

  return {
    users,
    userCount,
    fetchUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
  }
})
