/**
 * Unified 7-domain color palette.
 * Single source of truth. Imported by MqsDashboard, MqsInteractive, and any
 * future component that needs per-domain coloring.
 *
 * Tuned for readable separation on near-black MQS visualizations:
 * warm-leaning hues with two muted cool anchors for separation. DTC, the
 * differentiator, gets the only violet in the system so it always stands out.
 */
export const DOMAIN_COLORS: Record<string, string> = {
  GAIT:  '#E3B341',  // Amber gold: flagship domain, closest to brand warmth
  POST:  '#54B39A',  // Muted teal: stability, calm counterpoint
  FORCE: '#7E9CC0',  // Slate blue: strength, cool steel anchor
  POWER: '#D95749',  // Vermilion: explosive output
  MOTOR: '#94B47C',  // Sage green: coordination and control
  NEURO: '#DD7CA4',  // Rose: reactivity
  DTC:   '#B18CE8',  // Lavender violet: dual task cost, the differentiator
}
