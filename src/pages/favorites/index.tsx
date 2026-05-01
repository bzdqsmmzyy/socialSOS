import { View, Text } from '@tarojs/components'
import { useQuizStore } from '@/store/quiz-store'
import './index.css'

export default function Favorites() {
  const { getFavoritesList, toggleFavorite } = useQuizStore()
  const favQuestions = getFavoritesList()

  const handleUnfavorite = (qid: number, e: any) => {
    e.stopPropagation()
    toggleFavorite(qid)
  }

  if (favQuestions.length === 0) {
    return (
      <View className="fav-page">
        {/* Header */}
        <View className="fav-header">
          <Text className="block text-lg font-bold text-white">我的收藏</Text>
          <Text className="block text-xs text-white mt-2" style={{ opacity: 0.8 }}>还没有收藏哦～</Text>
        </View>
        <View className="fav-empty">
          <Text className="block text-3xl mb-3">💔</Text>
          <Text className="block text-base font-semibold text-gray-400">还没有收藏哦～</Text>
          <Text className="block text-xs text-gray-300 mt-2">去答题页收藏你觉得有用的话术吧！</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="fav-page">
      {/* Header */}
      <View className="fav-header">
        <Text className="block text-lg font-bold text-white">我的收藏</Text>
        <View className="fav-header-badge">
          <Text className="block text-xs font-bold text-white">已收藏 {favQuestions.length} 题</Text>
        </View>
      </View>

      {/* List */}
      <View className="fav-list">
        {favQuestions.map((q) => (
          <View key={q.id} className="fav-card">
            {/* Category badge */}
            <View className="fav-card-top">
              <View className="fav-cat-tag">
                <Text className="block text-xs font-semibold text-white">{q.categoryTag}</Text>
              </View>
              <View className="flex flex-row items-center gap-1">
                <Text className="block text-xs text-orange-300">{'⭐'.repeat(q.difficulty)}</Text>
              </View>
            </View>

            {/* Scene */}
            <Text className="block text-sm text-gray-800 leading-relaxed mt-3 mb-2">
              {q.scene}
            </Text>

            {/* Technique */}
            {q.technique && (
              <View className="fav-tech">
                <Text className="block text-xs text-green-700">💡 {q.technique}</Text>
              </View>
            )}

            {/* Unfavorite button */}
            <View className="fav-unfav" onClick={(e) => handleUnfavorite(q.id, e)}>
              <Text className="block text-xs font-semibold text-red-400">❤️ 已收藏</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="fav-bottom" />
    </View>
  )
}
