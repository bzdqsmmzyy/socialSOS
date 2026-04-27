import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useState, useEffect } from "react"
import { useQuizStore, CATEGORIES, QuizQuestion } from "@/store/quiz-store"
import "./index.css"

export default function CategoryDetail() {
  const [categoryId, setCategoryId] = useState(1)
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>([])
  const { toggleFavorite, favorites } = useQuizStore()

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    if (params?.categoryId) {
      setCategoryId(Number(params.categoryId))
    }
  }, [])

  useEffect(() => {
    const allQuestions = useQuizStore.getState().questions
    const filtered = allQuestions.filter((q) => q.categoryId === categoryId)
    setFilteredQuestions(filtered)
  }, [categoryId])

  const category = CATEGORIES.find((c) => c.id === categoryId)

  const handleQuizTap = (questionId: number) => {
    Taro.navigateTo({ url: `/pages/quiz/index?id=${questionId}` })
  }

  return (
    <View className="page-container">
      {/* Category Header */}
      <View className="cat-detail-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text className="text-lg text-white">←</Text>
        </View>
        <Text className="block text-lg font-bold text-white">{category?.emoji} {category?.name}</Text>
        <View />
      </View>

      {/* Category Info */}
      <View className="cat-info-card">
        <Text className="block text-sm text-gray-600 leading-relaxed">
          {category?.description}
        </Text>
        <View className="cat-info-stats">
          <View className="cat-info-stat">
            <Text className="block text-lg font-bold text-primary">{filteredQuestions.length}</Text>
            <Text className="block text-xs text-gray-500">题目数</Text>
          </View>
          <View className="cat-info-stat">
            <Text className="block text-lg font-bold text-primary">{category?.count}</Text>
            <Text className="block text-xs text-gray-500">总题数</Text>
          </View>
        </View>
      </View>

      {/* Questions List */}
      <View className="cat-questions">
        {filteredQuestions.map((q, index) => (
          <View
            key={q.id}
            className="cat-question-item"
            onClick={() => handleQuizTap(q.id)}
          >
            <View className="flex-1">
              <Text className="block text-sm font-medium text-gray-900 leading-relaxed">
                {index + 1}. {q.scene}
              </Text>
            </View>
            <View
              className="fav-icon"
              onClick={(e) => { e.stopPropagation(); toggleFavorite(q.id) }}
            >
              <Text className="block text-sm">
                {favorites.includes(q.id) ? "❤️" : "🤍"}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
