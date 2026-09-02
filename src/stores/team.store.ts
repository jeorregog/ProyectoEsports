import { computed, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import type { Team } from '../models/Team'
import { TeamService, type CreateTeamInput, type UpdateTeamInput } from '../services/TeamService'


export const useTeamStore = defineStore('teams', () => {
  const teams = shallowRef<Team[]>([])

  const teamCount = computed(() => teams.value.length)

  function fetchTeams(): Team[] {
    teams.value = TeamService.getAll()
    return teams.value
  }

  function getTeamById(id: string): Team | undefined {
    return teams.value.find((team) => team.getId() === id)
  }

  function createTeam(input: CreateTeamInput): Team {
    const team = TeamService.create(input)
    teams.value = [...teams.value, team]
    return team
  }

  function updateTeam(id: string, input: UpdateTeamInput): Team | undefined {
    const team = TeamService.update(id, input)

    if (!team) {
      return undefined
    }

    const index = teams.value.findIndex((item) => item.getId() === id)
    teams.value =
      index === -1
        ? [...teams.value, team]
        : teams.value.map((item, i) => (i === index ? team : item))

    return team
  }

  function deleteTeam(id: string): boolean {
    const deleted = TeamService.delete(id)

    if (deleted) {
      teams.value = teams.value.filter((team) => team.getId() !== id)
    }

    return deleted
  }

  return {
    teams,
    teamCount,
    fetchTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
  }
})