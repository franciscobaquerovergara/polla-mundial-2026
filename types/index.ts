export type PaymentStatus = 'pending' | 'confirmed' | 'rejected'
export type Stage = 'group' | 'round_of_32' | 'round_of_16' | 'quarterfinal' | 'semifinal' | 'third_place' | 'final'
export type BonusType = 'golden_boot' | 'golden_glove' | 'top_assists' | 'champion' | 'last_team' | 'worst_adicto'

export interface Profile {
  id: string
  username: string
  full_name: string
  phone?: string
  city?: string
  payment_status: PaymentStatus
  payment_reference?: string
  payment_date?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
}

export interface Team {
  id: number
  name: string
  flag: string
  group_name?: string
  confederation?: string
}

export interface Match {
  id: number
  home_team_id?: number
  away_team_id?: number
  home_team_label?: string
  away_team_label?: string
  home_team?: Team
  away_team?: Team
  match_date: string
  venue?: string
  city?: string
  stage: Stage
  group_name?: string
  match_number: number
  home_score?: number
  away_score?: number
  is_played: boolean
  predictions_locked: boolean
  // Prediction del usuario actual (si existe)
  user_prediction?: Prediction
}

export interface Prediction {
  id: number
  user_id: string
  match_id: number
  predicted_home: number
  predicted_away: number
  points_awarded: number
  created_at: string
  updated_at: string
}

export interface BonusPrediction {
  id: number
  user_id: string
  bonus_type: BonusType
  prediction: string
  points_awarded: number
  created_at: string
}

export interface BonusResult {
  bonus_type: BonusType
  result?: string
  points_value: number
  is_resolved: boolean
  resolved_at?: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  full_name: string
  city?: string
  payment_status: PaymentStatus
  match_points: number
  bonus_points: number
  total_points: number
  correct_predictions: number
  total_predictions: number
  position: number
}

export const STAGE_LABELS: Record<Stage, string> = {
  group: 'Fase de Grupos',
  round_of_32: 'Ronda de 32',
  round_of_16: 'Octavos de Final',
  quarterfinal: 'Cuartos de Final',
  semifinal: 'Semifinal',
  third_place: 'Tercer Puesto',
  final: 'Gran Final',
}

export const STAGE_MULTIPLIERS: Record<Stage, number> = {
  group: 1,
  round_of_32: 1.5,
  round_of_16: 2,
  quarterfinal: 2.5,
  semifinal: 3,
  third_place: 2,
  final: 4,
}

export const BONUS_LABELS: Record<BonusType, { label: string; description: string; emoji: string; points: number }> = {
  golden_boot:   { label: 'Bota de Oro',       description: 'Goleador del torneo',               emoji: '👟', points: 20 },
  golden_glove:  { label: 'Guante de Oro',      description: 'Mejor arquero del torneo',          emoji: '🧤', points: 15 },
  top_assists:   { label: 'Rey de Asistencias', description: 'Jugador con más asistencias',       emoji: '🎯', points: 15 },
  champion:      { label: 'Campeón del Mundial', description: 'Equipo campeón',                   emoji: '🏆', points: 20 },
  last_team:     { label: 'La Cueva del Oso',   description: 'Peor equipo del Mundial (último)',  emoji: '🐻', points: 20 },
  worst_adicto:  { label: 'El Peor Adicto',     description: 'Peor jugador del grupo Adictos (30 ptos - ¡salvajada!)', emoji: '💀', points: 30 },
}
