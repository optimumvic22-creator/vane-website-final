export const TOUR_INTERVAL = 7000
export type TourState = {
  index: number
  direction: number
  cycles: number
  manual: boolean
  announcement: number | null
}
export const initialTourState: TourState = {
  index: 0,
  direction: 1,
  cycles: 0,
  manual: false,
  announcement: null,
}
export type TourAction =
  | { type: 'manual'; index: number; count: number }
  | { type: 'tick'; count: number }
export function tourReducer(state: TourState, action: TourAction): TourState {
  if (!action.count) return state
  if (action.type === 'manual') {
    const index = (action.index + action.count) % action.count
    return {
      ...state,
      index,
      direction: action.index >= state.index ? 1 : -1,
      manual: true,
      announcement: index,
    }
  }
  if (state.manual || state.cycles >= 2) return state
  const next = (state.index + 1) % action.count
  return {
    ...state,
    index: next,
    direction: 1,
    cycles: state.cycles + (next === 0 ? 1 : 0),
    announcement: null,
  }
}
export function tourKeyIndex(key: string, index: number, count: number) {
  if (!count) return null
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  if (key === 'ArrowRight' || key === 'ArrowDown') return (index + 1) % count
  if (key === 'ArrowLeft' || key === 'ArrowUp')
    return (index - 1 + count) % count
  if (key === 'Enter' || key === ' ') return index
  return null
}
