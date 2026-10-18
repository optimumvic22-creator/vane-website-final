export type FigureHandle = {
  setActive: (active: boolean) => void
  destroy: () => void
}
export function mountFigure(
  stage: HTMLElement,
  name: string,
  still: boolean,
  reduced: boolean,
): FigureHandle
