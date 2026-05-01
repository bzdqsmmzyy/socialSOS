import { View, Text } from '@tarojs/components'
import { useQuizStore } from '@/store/quiz-store'
import { useState } from 'react'
import './index.css'

export default function Cheatsheets() {
  const getCheatsheets = useQuizStore((s) => s.getCheatsheets)
  const sheets = getCheatsheets()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggleCategory = (tag: string) => {
    setExpanded((prev) => ({ ...prev, [tag]: !prev[tag] }))
  }

  // Group by category tag
  const grouped: Record<string, typeof sheets> = {}
  for (const s of sheets) {
    if (!grouped[s.categoryTag]) grouped[s.categoryTag] = []
    grouped[s.categoryTag].push(s)
  }

  if (sheets.length === 0) {
    return (
      <View className="cs-page">
        <View className="cs-header">
          <Text className="block text-lg font-bold text-white">小抄集</Text>
          <Text className="block text-xs text-white mt-2" style={{ opacity: 0.8 }}>
            还没有收集到小抄～
          </Text>
        </View>
        <View className="cs-empty">
          <Text className="block text-3xl mb-3">📝</Text>
          <Text className="block text-base font-semibold text-gray-400">还没有收集到小抄～</Text>
          <Text className="block text-xs text-gray-300 mt-2">答对题目后小抄会自动归集到这里！</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="cs-page">
      {/* Header */}
      <View className="cs-header">
        <Text className="block text-lg font-bold text-white">小抄集</Text>
        <View className="cs-header-badge">
          <Text className="block text-xs font-bold text-white">已收集 {sheets.length} 条小抄 🔥</Text>
        </View>
      </View>

      {/* Categories */}
      <View className="cs-list">
        {Object.entries(grouped).map(([tag, items]) => {
          const isOpen = expanded[tag] !== false
          return (
            <View key={tag} className="cs-group">
              {/* Category header */}
              <View className="cs-group-header" onClick={() => toggleCategory(tag)}>
                <View className="cs-group-bar" />
                <Text className="block text-sm font-semibold text-gray-800 flex-1">{tag}</Text>
                <Text className="block text-xs text-gray-400 mr-2">{items.length}条</Text>
                <Text className="block text-base text-gray-300">{isOpen ? '▾' : '▸'}</Text>
              </View>

              {/* Items */}
              {isOpen && (
                <View className="cs-group-body">
                  {items.map((item, i) => (
                    <View key={i} className="cs-item">
                      {/* One line rule */}
                      <View className="cs-rule-wrap">
                        <Text className="block text-xs font-bold text-gray-900 leading-relaxed">
                          {item.cheatsheet.oneLineRule}
                        </Text>
                      </View>
                      {/* Remember this */}
                      <View className="cs-remember">
                        <Text className="block text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                          {item.cheatsheet.rememberThis}
                        </Text>
                      </View>
                      {/* Source */}
                      <Text className="block text-xs text-gray-300 mt-2">
                        — {item.question.scene}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        })}
      </View>

      <View className="cs-bottom" />
    </View>
  )
}
