import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore } from "@/store/quiz-store"
import "./index.css"

export default function QuizList() {
  const { questions } = useQuizStore()

  const handleQuizTap = (questionId: number) => {
    Taro.navigateTo({ url: `/pages/quiz/index?id=${questionId}` })
  }

  return (
    <View className="page-container">
      {/* Header */}
      <View className="cat-header">
        <Text className="block text-xl font-bold text-white">📝 全部题库</Text>
        <Text className="block text-xs text-white text-opacity-80 mt-1">200+社交场景，持续更新中</Text>
      </View>

      {/* Quiz List */}
      <View className="quiz-list">
        {questions.map((q, index) => (
          <View
            key={q.id}
            className="quiz-item"
            onClick={() => handleQuizTap(q.id)}
          >
            <View className="quiz-num">
              <Text className="block text-xs font-bold text-primary">{index + 1}</Text>
            </View>
            <Text className="block flex-1 text-xs text-gray-900 leading-relaxed line-clamp-2">
              {q.scene}
            </Text>
          </View>
        ))}
        <View className="quiz-item locked">
          <View className="quiz-num-locked">
            <Text className="block text-xs">🔒</Text>
          </View>
          <Text className="block flex-1 text-xs text-gray-500">
            今日免费额度已用完，解锁全部200+题
          </Text>
        </View>
      </View>

      {/* Bottom spacing for TabBar */}
      <View className="h-24" />
    </View>
  )
}
