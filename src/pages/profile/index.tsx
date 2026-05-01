import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore, getRank } from "@/store/quiz-store"
import { useState } from "react"
import { getHeaderPaddingTop } from "@/utils/safe-area"
import "./index.css"

export default function Profile() {
  const {
    character, setCharacter, characters, totalXP, rankProgress,
    userStats, streakDays, favorites, quizResult
  } = useQuizStore()

  const [showCharSwitcher, setShowCharSwitcher] = useState(false)

  const currentChar = characters.find(c => c.id === character) || characters[0]
  const { rank: currentRank } = getRank(totalXP)

  const practiced = userStats.practiced || 0
  const favCount = favorites.length || 0
  const accuracy = practiced > 0 ? userStats.accuracy : 0
  const cheatsheetCount = useQuizStore.getState().getCheatsheets().length

  const menuItems = [
    { icon: "📚", text: "我的收藏", badge: favCount > 0 ? String(favCount) : null, url: "/pages/favorites/index" },
    { icon: "📝", text: "小抄集", badge: String(cheatsheetCount), url: "/pages/cheatsheets/index" },
    { icon: "🎬", text: "微剧系列", badge: null, url: "/pages/series/index" },
    { icon: "📊", text: "社恐测评", badge: quizResult ? quizResult.type : "未测评", isQuizBadge: true, url: "/pages/quiz/index" },
    { icon: "⚙️", text: "设置", badge: null, url: "/pages/settings/index" },
    { icon: "💬", text: "意见反馈", badge: null, url: null }
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (!item.url) return
    Taro.navigateTo({ url: item.url })
  }

  const handleCharSwitch = (charId: string) => {
    setCharacter(charId)
    setShowCharSwitcher(false)
  }

  return (
    <View className="p-page">
      {/* ===== Header ===== */}
      <View className="p-header" style={{ paddingTop: `${getHeaderPaddingTop(24)}px` }}>
        {/* Character display */}
        <View className="p-char-circle" onClick={() => setShowCharSwitcher(!showCharSwitcher)}>
          <Text className="block text-3xl">{currentChar.emoji}</Text>
        </View>
        <Text className="block text-xl font-bold text-white mt-3">{currentChar.name}</Text>
        <View className="p-char-hint mt-1" onClick={() => setShowCharSwitcher(!showCharSwitcher)}>
          <Text className="block text-xs text-white" style="opacity:0.75">点击换角色</Text>
        </View>

        {/* Rank badge */}
        <View className="p-rank-badge" onClick={() => setShowCharSwitcher(!showCharSwitcher)}>
          <Text className="block text-sm font-semibold text-white">
            {currentRank.icon} {currentRank.name}
          </Text>
        </View>

        {/* Character switcher inline dialog */}
        {showCharSwitcher && (
          <View className="p-char-sheet">
            <Text className="block text-sm font-semibold text-gray-700 mb-3">选择你的角色</Text>
            <View className="flex flex-wrap gap-3 justify-center">
              {characters.map((ch) => (
                <View
                  key={ch.id}
                  className={`p-char-card ${ch.id === character ? 'p-char-card-active' : ''}`}
                  onClick={() => handleCharSwitch(ch.id)}
                >
                  <Text className="block text-2xl mb-1">{ch.emoji}</Text>
                  <Text className="block text-xs font-medium text-gray-800">{ch.name}</Text>
                  <Text className="block text-xxs text-gray-400 mt-1 text-center leading-tight px-2">
                    {ch.desc}
                  </Text>
                  {ch.id === character && (
                    <View className="p-char-check">
                      <Text className="block text-xs text-white font-bold">当前</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View className="p-char-close mt-4" onClick={() => setShowCharSwitcher(false)}>
              <Text className="block text-sm text-gray-400">收起</Text>
            </View>
          </View>
        )}
      </View>

      {/* ===== XP & Rank Progress ===== */}
      <View className="p-progress-section">
        <View className="p-xp-label">
          <Text className="block text-xxs text-gray-400 tracking-wider">社交经验值</Text>
        </View>
        <View className="flex items-center justify-between mt-1 mb-2">
          <Text className="block text-base font-bold" style="color:#6C5CE7">
            {totalXP} XP
          </Text>
          <Text className="block text-xs font-semibold" style="color:#A29BFE">
            {currentRank.icon} {currentRank.name}
          </Text>
        </View>
        <View className="p-progress-bar">
          <View className="p-progress-labels">
            <Text className="block text-xxs text-gray-400">💀 i人</Text>
            <Text className="block text-xxs text-gray-400">🦸 社牛</Text>
          </View>
          <View className="p-progress-track">
            <View
              className="p-progress-fill"
              style={{ width: `${rankProgress}%`, background: currentRank.color }}
            />
          </View>
          <View className="p-progress-pct">
            <Text className="block text-xxs text-gray-400">{rankProgress}%</Text>
          </View>
        </View>
      </View>

      {/* ===== Stats Cards ===== */}
      <View className="p-stats-grid">
        <View className="p-stat-card">
          <View className="p-stat-icon-box p-stat-icon-practice">
            <Text className="block text-lg">📖</Text>
          </View>
          <Text className="block text-lg font-bold text-gray-900 mt-2">{practiced}</Text>
          <Text className="block text-xs text-gray-400 mt-1">已练习</Text>
        </View>
        <View className="p-stat-card">
          <View className="p-stat-icon-box p-stat-icon-fav">
            <Text className="block text-lg">⭐</Text>
          </View>
          <Text className="block text-lg font-bold text-gray-900 mt-2">{favCount}</Text>
          <Text className="block text-xs text-gray-400 mt-1">收藏数</Text>
        </View>
        <View className="p-stat-card">
          <View className="p-stat-icon-box p-stat-icon-acc">
            <Text className="block text-lg">🎯</Text>
          </View>
          <Text className="block text-lg font-bold text-gray-900 mt-2">{accuracy}%</Text>
          <Text className="block text-xs text-gray-400 mt-1">正确率</Text>
        </View>
        <View className="p-stat-card">
          <View className="p-stat-icon-box p-stat-icon-streak">
            <Text className="block text-lg">🔥</Text>
          </View>
          <Text className="block text-lg font-bold text-gray-900 mt-2">{streakDays}天</Text>
          <Text className="block text-xs text-gray-400 mt-1">连续打卡</Text>
        </View>
      </View>

      {/* ===== Menu List ===== */}
      <View className="p-menu-section">
        <Text className="block text-xs font-semibold text-gray-400 mb-3 px-1 tracking-wider">更多功能</Text>
        <View className="p-menu-card">
          {menuItems.map((item, index) => (
            <View
              key={item.text}
              className={`p-menu-item ${index === menuItems.length - 1 ? 'p-menu-item-last' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <View className="flex items-center gap-3">
                <View className="p-menu-icon">
                  <Text className="block text-lg">{item.icon}</Text>
                </View>
                <Text className="block text-sm font-medium text-gray-800">{item.text}</Text>
              </View>
              <View className="flex items-center gap-2">
                {item.badge && (
                  <View className={`p-menu-badge ${item.isQuizBadge && !quizResult ? 'p-menu-badge-dim' : ''}`}>
                    <Text className="block text-xxs font-semibold text-white">
                      {item.badge}
                    </Text>
                  </View>
                )}
                {item.url && (
                  <Text className="block text-base text-gray-300">›</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ===== Bottom Spacing for TabBar ===== */}
      <View className="p-bottom-space" />
    </View>
  )
}
