import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore } from "@/store/quiz-store"
import "./index.css"

export default function Result() {
  const { userStats } = useQuizStore()

  const handleRestart = () => {
    Taro.switchTab({ url: "/pages/index/index" })
  }

  const handleReview = () => {
    Taro.switchTab({ url: "/pages/quiz-list/index" })
  }

  return (
    <View className="page-container">
      {/* Result Header */}
      <View className="result-header">
        <Text className="block text-6xl mb-4">🎉</Text>
        <Text className="block text-xl font-bold text-white">练习完成</Text>
        <Text className="block text-sm text-white text-opacity-80 mt-2">你今天的社交急救训练已完成</Text>
      </View>

      {/* Stats Cards */}
      <View className="result-stats">
        <View className="result-stat-card">
          <Text className="block text-3xl mb-2">📊</Text>
          <Text className="block text-2xl font-bold text-primary">{userStats.practiced}</Text>
          <Text className="block text-xs text-gray-500 mt-1">累计练习</Text>
        </View>
        <View className="result-stat-card">
          <Text className="block text-3xl mb-2">🎯</Text>
          <Text className="block text-2xl font-bold text-primary">{userStats.accuracy}%</Text>
          <Text className="block text-xs text-gray-500 mt-1">正确率</Text>
        </View>
        <View className="result-stat-card">
          <Text className="block text-3xl mb-2">🔥</Text>
          <Text className="block text-2xl font-bold text-primary">{userStats.streak}</Text>
          <Text className="block text-xs text-gray-500 mt-1">连续天数</Text>
        </View>
      </View>

      {/* Tip Card */}
      <View className="tip-card">
        <Text className="block text-sm font-semibold text-gray-900 mb-2">💪 社交小贴士</Text>
        <Text className="block text-sm text-gray-600 leading-relaxed">
          每天坚持3分钟练习，社交能力就像肌肉一样会越来越强！关键不是完美应对，而是敢于迈出第一步。
        </Text>
      </View>

      {/* Buttons */}
      <View className="result-buttons">
        <View className="result-btn-primary" onClick={handleRestart}>
          <Text className="block text-base font-semibold text-white">回到首页</Text>
        </View>
        <View className="result-btn-secondary" onClick={handleReview}>
          <Text className="block text-base font-semibold text-primary">复习题目</Text>
        </View>
      </View>
    </View>
  )
}
