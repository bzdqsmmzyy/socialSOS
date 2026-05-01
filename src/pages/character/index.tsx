import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useQuizStore, CHARACTERS } from '@/store/quiz-store'
import './index.css'

export default function CharacterSelection() {
  const setCharacter = useQuizStore((s) => s.setCharacter)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelectedId(id)
  }

  const handleConfirm = () => {
    if (!selectedId) return
    setCharacter(selectedId)
    Taro.switchTab({ url: '/pages/index/index' })
  }

  return (
    <View className="c-page relative">
      {/* ===== Background Decoration ===== */}
      <View className="c-bg-deco">
        <View className="c-bg-deco-dot" />
        <View className="c-bg-deco-dot" />
        <View className="c-bg-deco-dot" />
      </View>

      {/* ===== Header ===== */}
      <View className="c-header relative z-10">
        <Text className="c-eyebrow block">FIRST STEP</Text>
        <Text className="c-title block">选择你的角色</Text>
        <Text className="c-subtitle block">
          选一个最像你的i人人设{'\n'}开启你的社交逆袭之旅
        </Text>
      </View>

      {/* ===== Character Cards ===== */}
      <View className="c-list relative z-10">
        {CHARACTERS.map((char) => {
          const isSelected = selectedId === char.id

          return (
            <View
              key={char.id}
              className={`c-card c-card-enter ${isSelected ? 'c-card-selected' : ''}`}
              onClick={() => handleSelect(char.id)}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <View className="c-checkmark">
                  <Text className="block text-base font-bold text-white">✓</Text>
                </View>
              )}

              {/* Emoji avatar */}
              <View className={`c-emoji ${isSelected ? 'c-emoji-selected' : 'c-emoji-idle'}`}>
                <Text className="c-emoji-text block">{char.emoji}</Text>
              </View>

              {/* Name + Description */}
              <View className="c-info">
                <Text className={`c-name block ${isSelected ? 'c-name-selected' : ''}`}>
                  {char.name}
                </Text>
                <Text className={`c-desc block ${isSelected ? 'c-desc-selected' : ''}`}>
                  {char.desc}
                </Text>
              </View>

              {/* Arrow */}
              <Text className={`c-arrow block ${isSelected ? 'c-arrow-selected' : ''}`}>
                ›
              </Text>
            </View>
          )
        })}
      </View>

      {/* ===== Confirm Button ===== */}
      <View className="c-btn-wrap relative z-10">
        <View
          className={`c-btn ${selectedId ? 'c-btn-active' : 'c-btn-disabled'}`}
          onClick={handleConfirm}
        >
          <Text className="block text-base font-bold text-center">
            {selectedId ? '✨ 确认选择，开始冒险' : '选一个角色开始冒险吧'}
          </Text>
        </View>
      </View>
    </View>
  )
}
