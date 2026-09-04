import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import type { Player } from '../models/Player'
import {
  PlayerService,
  type CreatePlayerInput,
  type UpdatePlayerInput,
} from '../services/PlayerService'


export const usePlayerStore = defineStore('players', () => {
  const players = shallowRef<Player[]>([])

  const playerCount = computed(() => players.value.length)

  function fetchPlayers(): Player[] {
    players.value = PlayerService.getAll()
    return players.value
  }

  function getPlayerById(id: string): Player | undefined {
    return players.value.find((player) => player.getId() === id)
  }

  function getPlayersByTeamId(teamId: string): Player[] {
    return players.value.filter((player) => player.getTeam().getId() === teamId)
  }

  function createPlayer(input: CreatePlayerInput): Player {
    const player = PlayerService.create(input)
    players.value = [...players.value, player]
    return player
  }

  function updatePlayer(id: string, input: UpdatePlayerInput): Player | undefined {
    const player = PlayerService.update(id, input)

    if (!player) {
      return undefined
    }

    const index = players.value.findIndex((item) => item.getId() === id)
    players.value =
      index === -1
        ? [...players.value, player]
        : players.value.map((item, i) => (i === index ? player : item))

    return player
  }

  function deletePlayer(id: string): boolean {
    const deleted = PlayerService.delete(id)

    if (deleted) {
      players.value = players.value.filter((player) => player.getId() !== id)
    }

    return deleted
  }

  return {
    players,
    playerCount,
    fetchPlayers,
    getPlayerById,
    getPlayersByTeamId,
    createPlayer,
    updatePlayer,
    deletePlayer,
  }
})
