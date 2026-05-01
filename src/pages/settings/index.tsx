import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore } from "@/store/quiz-store"
import { Switch } from "@/components/ui/switch"
import "./index.css"

export default function Settings() {
  const { settings, updateSettings } = useQuizStore()

  const handleTimerChange = (checked: boolean) => {
    updateSettings({ enableTimer: checked })
  }

  const handleSoundChange = (checked: boolean) => {
    updateSettings({ enableSound: checked })
  }

  const handleAnimationChange = (checked: boolean) => {
    updateSettings({ enableAnimation: checked })
  }

  const handleClearCache = () => {
    Taro.showModal({
      title: "确认清除",
      content: "确定要清除所有缓存数据吗？清除后将重新加载小程序。",
      success: (res) => {
        if (res.confirm) {
          Taro.clearStorage()
          Taro.showToast({ title: "缓存已清除", icon: "success", duration: 1500 })
          setTimeout(() => {
            Taro.reLaunch({ url: "/pages/index/index" })
          }, 1800)
        }
      }
    })
  }

  const handleGoBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className="st-page">
      {/* Back header */}
      <View className="st-header">
        <View className="st-back-btn" onClick={handleGoBack}>
          <Text className="block st-back-icon">←</Text>
        </View>
        <Text className="block st-header-title">设置</Text>
        <View className="st-header-spacer" />
      </View>

      {/* Settings list */}
      <View className="st-section">
        <View className="st-section-title">
          <Text className="block st-section-title-text">答题设置</Text>
        </View>

        <View className="st-list">
          {/* Enable Timer */}
          <View className="st-item">
            <View className="st-item-left">
              <Text className="block st-item-icon">⏱️</Text>
              <View className="st-item-info">
                <Text className="block st-item-label">限时答题模式</Text>
                <Text className="block st-item-sub">每题5秒倒计时，超时自动判错</Text>
              </View>
            </View>
            <Switch
              checked={settings.enableTimer}
              onCheckedChange={handleTimerChange}
            />
          </View>

          {/* Enable Sound */}
          <View className="st-item">
            <View className="st-item-left">
              <Text className="block st-item-icon">🔊</Text>
              <View className="st-item-info">
                <Text className="block st-item-label">音效</Text>
                <Text className="block st-item-sub">答对/答错播放提示音</Text>
              </View>
            </View>
            <Switch
              checked={settings.enableSound}
              onCheckedChange={handleSoundChange}
            />
          </View>

          {/* Enable Animation */}
          <View className="st-item">
            <View className="st-item-left">
              <Text className="block st-item-icon">✨</Text>
              <View className="st-item-info">
                <Text className="block st-item-label">答题动效</Text>
                <Text className="block st-item-sub">答题反馈动画效果</Text>
              </View>
            </View>
            <Switch
              checked={settings.enableAnimation}
              onCheckedChange={handleAnimationChange}
            />
          </View>
        </View>
      </View>

      {/* Divider + Danger Zone */}
      <View className="st-section">
        <View className="st-divider" />

        <View className="st-danger-zone">
          <View className="st-item st-item-danger" onClick={handleClearCache}>
            <View className="st-item-left">
              <Text className="block st-item-icon">🗑️</Text>
              <View className="st-item-info">
                <Text className="block st-item-label st-label-danger">清除缓存</Text>
                <Text className="block st-item-sub">清空所有本地数据并重新加载</Text>
              </View>
            </View>
            <Text className="block st-arrow">›</Text>
          </View>
        </View>
      </View>

      {/* Timer tip */}
      <View className="st-tip">
        <Text className="block st-tip-text">
          限时模式会在每题给你5秒思考时间，超时自动判断为社死～
        </Text>
      </View>

      <View className="st-bottom-space" />
    </View>
  )
}
