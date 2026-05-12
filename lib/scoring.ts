import type { Stage } from '@/types'

export const STAGE_MULTIPLIERS: Record<Stage, number> = {
  group: 1,
  round_of_32: 1.5,
  round_of_16: 2,
  quarterfinal: 2.5,
  semifinal: 3,
  third_place: 2,
  final: 4,
}

/**
 * Calcula los puntos para una predicción de partido.
 *
 * Sistema acordado en el Congreso Técnico:
 * - Marcador exacto: 4 pts bonus + 2 ganador + 1 goles local + 1 goles visita = 8 pts base
 * - Solo ganador/empate correcto: 2 pts base
 * - Los puntos se multiplican según la ronda (catch-up logic Mario Kart 🏎️)
 */
export function calculateMatchPoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
  stage: Stage
): number {
  let basePoints = 0

  // Signo del resultado: 1 = local gana, 0 = empate, -1 = visita gana
  const predictedResult = Math.sign(predictedHome - predictedAway)
  const actualResult = Math.sign(actualHome - actualAway)

  if (predictedHome === actualHome && predictedAway === actualAway) {
    // ¡Marcador exacto! 8 puntos base
    // Desglose: 4 (exacto) + 2 (ganador) + 1 (goles local) + 1 (goles visita)
    basePoints = 8
  } else if (predictedResult === actualResult) {
    // Solo el resultado correcto (sin marcador exacto): 2 puntos
    basePoints = 2
  }

  const multiplier = STAGE_MULTIPLIERS[stage]
  return Math.floor(basePoints * multiplier)
}

/**
 * Retorna el desglose de puntos para mostrar en la UI
 */
export function getPointsBreakdown(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
  stage: Stage
): { points: number; type: 'exact' | 'winner' | 'miss'; label: string } {
  const predictedResult = Math.sign(predictedHome - predictedAway)
  const actualResult = Math.sign(actualHome - actualAway)
  const multiplier = STAGE_MULTIPLIERS[stage]

  if (predictedHome === actualHome && predictedAway === actualAway) {
    const pts = Math.floor(8 * multiplier)
    return { points: pts, type: 'exact', label: `¡Exacto! +${pts} pts` }
  } else if (predictedResult === actualResult) {
    const pts = Math.floor(2 * multiplier)
    return { points: pts, type: 'winner', label: `Ganador ✓ +${pts} pts` }
  } else {
    return { points: 0, type: 'miss', label: 'Sin puntos' }
  }
}

/**
 * Distribución del premio ($300.000 × participantes)
 */
export function calculatePrizes(entryFee: number, participants: number) {
  const total = entryFee * participants
  return {
    total,
    champion: Math.floor(total * 0.65),       // 65% - Campeón Polla
    secondPlace: Math.floor(total * 0.15),    // 15% - Segundo lugar total
    firstRound: Math.floor(total * 0.20),     // 20% - Primer Seco (líder tras fase de grupos)
  }
}
