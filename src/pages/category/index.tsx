import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useState } from "react"
import { CATEGORIES } from "@/store/quiz-store"
import "./index.css"

const FILTER_OPTIONS = [
  { label: "全部", value: "all" },
  { label: "🔥 热门", value: "hot" },
  { label: "⭐ 收藏", value: "fav" },
  { label: "🆕 新题", value: "new" }
]

export default function Category() {
  const [activeFilter, setActiveFilter] = useState("all")

  const handleCategoryTap = (categoryId: number) => {
    Taro.navigateTo({ url: `/pages/category-detail/index?categoryId=${categoryId}` })
  }

  return (
    <View className="page-container">
      {/* Category Header */}
      <View className="cat-header">
        <Text className="block text-xl font-bold text-white">📂 场景分类</Text>
        <View className="cat-filter">
          {FILTER_OPTIONS.map((filter) => (
            <View
              key={filter.value}
              className={`filter-btn ${activeFilter === filter.value ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              <Text className={`text-xs font-medium ${activeFilter === filter.value ? "text-primary" : "text-white"}`}>
                {filter.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Category List */}
      <View className="cat-list">
        {CATEGORIES.map((cat) => (
          <View
            key={cat.id}
            className="cat-item"
            onClick={() => handleCategoryTap(cat.id)}
          >
            <Text className="block text-3xl">{cat.emoji}</Text>
            <View className="flex-1">
              <Text className="block text-sm font-semibold text-gray-900">{cat.name}</Text>
              <Text className="block text-xs text-gray-500 mt-1">{cat.count}题 · {cat.description}</Text>
            </View>
            <Text className="block text-lg text-gray-400">›</Text>
          </View>
        ))}
      </View>

      {/* Bottom spacing for TabBar */}
      <View className="h-24" />
    </View>
  )
}
