import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import type { Match } from '../models/Match'
import {
  MatchService,
  type CreateMatchInput,
  type UpdateMatchInput,
} from '../services/MatchService'

export const useMatchStore = defineStore('matches', () => {
  const matches = shallowRef<Match[]>([])

  const matchCount = computed(() => matches.value.length)

  function fetchMatches(): Match[] {
    matches.value = MatchService.getAll()
    return matches.value
  }

  function getMatchById(id: string): Match | undefined {
    return matches.value.find((match) => match.getId() === id)
  }

  function getMatchesByTeamId(teamId: string): Match[] {
    return matches.value.filter(
      (match) => match.getTeam1().getId() === teamId || match.getTeam2().getId() === teamId,
    )
  }

  function createMatch(input: CreateMatchInput): Match {
    const match = MatchService.create(input)
    matches.value = [...matches.value, match]
    return match
  }

  function updateMatch(id: string, input: UpdateMatchInput): Match | undefined {
    const match = MatchService.update(id, input)

    if (!match) {
      return undefined
    }

    const index = matches.value.findIndex((item) => item.getId() === id)
    matches.value =
      index === -1
        ? [...matches.value, match]
        : matches.value.map((item, i) => (i === index ? match : item))

    return match
  }

  function deleteMatch(id: string): boolean {
    const deleted = MatchService.delete(id)

    if (deleted) {
      matches.value = matches.value.filter((match) => match.getId() !== id)
    }

    return deleted
  }

  return {
    matches,
    matchCount,
    fetchMatches,
    getMatchById,
    getMatchesByTeamId,
    createMatch,
    updateMatch,
    deleteMatch,
  }
})
