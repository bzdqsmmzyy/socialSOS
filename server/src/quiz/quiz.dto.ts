export interface QuizOptionDto {
  letter: string
  text: string
}

export interface QuizQuestionDto {
  id: number
  categoryId: number
  categoryName: string
  categoryEmoji: string
  scene: string
  sceneFull: string
  hint: string
  options: QuizOptionDto[]
  correctIndex: number
  bestAnswer: string
  technique: string
  analysis: string
  difficulty: number
  isHot?: boolean
  isNew?: boolean
}

export interface CategoryDto {
  id: number
  name: string
  emoji: string
  count: number
  description: string
}

export interface UserStatsDto {
  practiced: number
  streak: number
  accuracy: number
  favorites: number
}
