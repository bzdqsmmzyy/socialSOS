import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore } from "@/store/quiz-store"
import "./index.css"

export default function Series() {
  const { seriesList, seriesProgress } = useQuizStore()

  const TOTAL_EPISODES = 5

  const handleSeriesClick = (series: { id: string; name: string }) => {
    const progress = seriesProgress[series.id] || 0

    if (progress === 0) {
      Taro.showToast({ title: `${series.name} 暂未解锁`, icon: "none", duration: 2000 })
    } else if (progress >= TOTAL_EPISODES) {
      Taro.showToast({ title: `${series.name} 已通关`, icon: "none", duration: 2000 })
    } else {
      Taro.showToast({ title: `${series.name} 继续挑战`, icon: "none", duration: 2000 })
    }
  }

  const handleGoBack = () => {
    Taro.navigateBack()
  }

  const getProgressPercent = (seriesId: string) => {
    const progress = seriesProgress[seriesId] || 0
    return Math.round((progress / TOTAL_EPISODES) * 100)
  }

  return (
    <View className="sr-page">
      {/* Header */}
      <View className="sr-header">
        <View className="sr-back-btn" onClick={handleGoBack}>
          <Text className="block sr-back-icon">←</Text>
        </View>
        <View className="sr-header-content">
          <Text className="block sr-header-title">追剧专区</Text>
          <Text className="block sr-header-sub">每部5集，通关获得专属称号</Text>
        </View>
        <View className="sr-header-decor">
          <Text className="block sr-decor-film">🎬</Text>
        </View>
      </View>

      {/* Series cards */}
      <View className="sr-cards">
        {seriesList.map((series) => {
          const progress = seriesProgress[series.id] || 0
          const percent = getProgressPercent(series.id)
          const isCompleted = progress >= TOTAL_EPISODES
          const isLocked = progress === 0
          const isInProgress = progress > 0 && progress < TOTAL_EPISODES

          return (
            <View
              key={series.id}
              className={`sr-card ${isLocked ? "sr-card-locked" : ""}`}
              onClick={() => handleSeriesClick(series)}
            >
              <View className="sr-card-inner">
                {/* Card header */}
                <View className="sr-card-header">
                  <View className="sr-card-name-wrap">
                    <Text className="block sr-card-name">{series.name}</Text>
                    {isCompleted && (
                      <View className="sr-badge-done">
                        <Text className="block sr-badge-done-text">已通关</Text>
                      </View>
                    )}
                    {isLocked && (
                      <View className="sr-badge-locked">
                        <Text className="block sr-badge-locked-icon">🔒</Text>
                      </View>
                    )}
                  </View>
                  <Text className="block sr-card-desc">{series.desc}</Text>
                </View>

                {/* Progress bar */}
                <View className="sr-card-progress-wrap">
                  <View className="sr-card-progress-header">
                    <Text className="block sr-progress-label">
                      {isCompleted ? "全部通关" : isLocked ? "未解锁" : `已解锁 ${progress}/${TOTAL_EPISODES}`}
                    </Text>
                    <Text className="block sr-progress-pct">{percent}%</Text>
                  </View>
                  <View className="sr-progress-bar">
                    <View
                      className={`sr-progress-fill ${isCompleted ? "sr-progress-fill-complete" : ""}`}
                      style={{ width: `${percent}%` }}
                    />
                  </View>
                </View>

                {/* Action button */}
                {isInProgress && (
                  <View className="sr-card-action">
                    <Text className="block sr-action-text">继续</Text>
                  </View>
                )}
                {isCompleted && (
                  <View className="sr-card-action sr-card-action-done">
                    <Text className="block sr-action-text sr-action-text-done">回顾</Text>
                  </View>
                )}
                {isLocked && (
                  <View className="sr-card-action sr-card-action-locked">
                    <Text className="block sr-action-text sr-action-text-locked">待解锁</Text>
                  </View>
                )}
              </View>
            </View>
          )
        })}
      </View>

      <View className="sr-bottom-space" />
    </View>
  )
}
