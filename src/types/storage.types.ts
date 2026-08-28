export interface UserStorageDTO {
  id: string
  username: string
  email: string
  password: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface PlayerStorageDTO {
  id: string
  name: string
  nickname: string
  wins: number
  earnings: number
  role: string
  country: string
  createdAt: string
  updatedAt: string
  teamId: string
}

export interface TeamStorageDTO {
  id: string
  name: string
  followers: number
  country: string
  createdAt: string
  updatedAt: string
  playerIds: string[]
}

export interface MatchStorageDTO {
  id: string
  game: string
  date: string
  team1Id: string
  team2Id: string
  winnerId: string
}
