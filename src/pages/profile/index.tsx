import { View, Text } from "@tarojs/components"
import { useQuizStore } from "@/store/quiz-store"
import { Badge } from "@/components/ui/badge"
import PaymentModal from "@/components/payment-modal"
import "./index.css"

export default function Profile() {
  const { userStats, favorites, showPaymentModal, setShowPaymentModal } = useQuizStore()

  const menuItems = [
    { icon: "🏆", text: "我的成就", extra: null },
    { icon: "⭐", text: "收藏题目", extra: favorites.length > 0 ? String(favorites.length) : null },
    { icon: "📊", text: "学习报告", extra: null },
    { icon: "👑", text: "升级完整版", extra: "¥19.9", isHighlight: true },
    { icon: "📝", text: "社恐测评", extra: "NEW", isNew: true },
    { icon: "💬", text: "意见反馈", extra: null }
  ]

  return (
    <View className="page-container">
      {/* Profile Header */}
      <View className="profile-header">
        <View className="profile-avatar">
          <Text className="block text-3xl">🧑</Text>
        </View>
        <Text className="block text-lg font-bold text-white">i人练习生</Text>
        <View className="profile-tag">
          <Text className="block text-xs text-white">🏅 连续打卡{userStats.streak}天</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="profile-stats">
        <View className="profile-stat">
          <Text className="block text-xl font-bold text-primary">{userStats.practiced}</Text>
          <Text className="block text-xs text-gray-500 mt-1">已练习</Text>
        </View>
        <View className="profile-stat">
          <Text className="block text-xl font-bold text-primary">{userStats.favorites}</Text>
          <Text className="block text-xs text-gray-500 mt-1">收藏</Text>
        </View>
        <View className="profile-stat">
          <Text className="block text-xl font-bold text-primary">{userStats.accuracy}%</Text>
          <Text className="block text-xs text-gray-500 mt-1">正确率</Text>
        </View>
      </View>

      {/* Menu */}
      <View className="profile-menu">
        {menuItems.map((item) => (
          <View
            key={item.text}
            className="menu-item"
            onClick={item.isHighlight ? () => setShowPaymentModal(true) : undefined}
          >
            <Text className="block text-xl w-8 text-center">{item.icon}</Text>
            <Text className="block flex-1 text-sm text-gray-900">{item.text}</Text>
            {item.isNew && (
              <Badge className="bg-red-50 text-primary text-xs mr-1">NEW</Badge>
            )}
            {item.extra && !item.isNew && (
              <Text className={`block text-xs font-semibold ${item.isHighlight ? "text-primary" : ""}`}>
                {item.extra}
              </Text>
            )}
            <Text className="block text-base text-gray-400 ml-1">›</Text>
          </View>
        ))}
      </View>

      {/* Bottom spacing for TabBar */}
      <View className="h-24" />

      {/* Payment Modal */}
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
