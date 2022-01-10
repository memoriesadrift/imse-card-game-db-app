// Home
export const home = '/'

// Auth
export const login = '/login'

// Games
export const games = '/games'
export const addGame = '/games/add'
export const game = (id: number | string) => `/games/${id}`
export const editGame = (id: number | string) => `/games/edit/${id}`
export const reviewGame = (id: number | string) => `/games/review/${id}`

// Reports
export const reports = '/reports'
