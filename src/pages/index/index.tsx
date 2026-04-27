import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { Badge } from "@/components/ui/badge"
import { useQuizStore, CATEGORIES } from "@/store/quiz-store"
import PaymentModal from "@/components/payment-modal"
import "./index.css"

export default function Index() {
  const { userStats, getTodayQuestion, showPaymentModal, setShowPaymentModal } = useQuizStore()
  const todayQuestion = getTodayQuestion()

  const handleStartQuiz = () => {
    useQuizStore.getState().setCurrentQuestionIndex(todayQuestion.id - 1)
    Taro.navigateTo({ url: `/pages/quiz/index?id=${todayQuestion.id}` })
  }

  const handleCategoryTap = (categoryId: number) => {
    Taro.navigateTo({ url: `/pages/category-detail/index?categoryId=${categoryId}` })
  }

  return (
    <View className="page-container">
      {/* Home Header */}
      <View className="home-header">
        <Text className="block text-2xl font-bold text-white">🆘 社交急救包</Text>
        <Text className="block text-sm text-white text-opacity-90 mt-1">每天3分钟，告别社交尴尬</Text>
        <View className="home-stats">
          <View className="stat-card">
            <Text className="block text-xl font-bold text-white">{userStats.practiced}</Text>
            <Text className="block text-xs text-white text-opacity-85 mt-1">已练习</Text>
          </View>
          <View className="stat-card">
            <Text className="block text-xl font-bold text-white">{userStats.streak}天</Text>
            <Text className="block text-xs text-white text-opacity-85 mt-1">连续打卡</Text>
          </View>
          <View className="stat-card">
            <Text className="block text-xl font-bold text-white">{userStats.accuracy}%</Text>
            <Text className="block text-xs text-white text-opacity-85 mt-1">正确率</Text>
          </View>
        </View>
      </View>

      {/* Today Recommendation */}
      <Text className="block text-base font-bold text-gray-900 px-5 pt-5 pb-3">📋 今日推荐</Text>
      <View className="today-card" onClick={handleStartQuiz}>
        <Badge variant="outline" className="bg-red-50 text-primary border-red-100 mb-2">
          🔥 热门场景
        </Badge>
        <Text className="block text-sm text-gray-900 leading-relaxed mb-3">
          {todayQuestion.sceneFull}
        </Text>
        <View className="today-btn" onClick={handleStartQuiz}>
          <Text className="text-sm font-semibold text-white">🎯 开始答题</Text>
        </View>
      </View>

      {/* Category Grid */}
      <Text className="block text-base font-bold text-gray-900 px-5 pt-5 pb-3">📂 场景分类</Text>
      <View className="category-grid">
        {CATEGORIES.map((cat) => (
          <View
            key={cat.id}
            className="cat-card"
            onClick={() => handleCategoryTap(cat.id)}
          >
            <Text className="block text-3xl mb-2">{cat.emoji}</Text>
            <Text className="block text-xs font-semibold text-gray-900">{cat.name}</Text>
            <Text className="block text-xs text-gray-500 mt-1">{cat.count}题</Text>
          </View>
        ))}
      </View>

      {/* Unlock Banner */}
      <View className="unlock-banner" onClick={() => setShowPaymentModal(true)}>
        <View className="flex-1">
          <Text className="block text-sm font-semibold text-white">🔓 解锁全部200+题库</Text>
          <Text className="block text-xs text-white text-opacity-80 mt-1">无限练习 · 分类浏览 · 收藏功能</Text>
        </View>
        <View className="unlock-price-tag">
          <Text className="text-sm font-bold text-purple-700">¥19.9</Text>
        </View>
      </View>

      {/* Bottom spacing for TabBar */}
      <View className="h-24" />

      {/* Payment Modal */}
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
