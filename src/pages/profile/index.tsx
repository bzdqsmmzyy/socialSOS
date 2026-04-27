import { View, Text } from "@tarojs/components"
import { useQuizStore } from "@/store/quiz-store"
import PaymentModal from "@/components/payment-modal"
import "./index.css"

export default function Profile() {
  const { userStats, favorites, showPaymentModal, setShowPaymentModal, isPaid } = useQuizStore()

  const menuItems = [
    { icon: "⭐", text: "收藏题目", extra: favorites.length > 0 ? String(favorites.length) : null, isBadge: true, needPay: true },
    { icon: "📊", text: "学习报告", extra: null, needPay: true },
    { icon: "👑", text: "升级完整版", extra: "¥19.9", isPrice: true, needPay: false },
    { icon: "📝", text: "社恐测评", extra: "NEW", isNew: true, needPay: true },
    { icon: "💬", text: "意见反馈", extra: null, needPay: false }
  ]

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.isPrice) {
      setShowPaymentModal(true)
      return
    }
    if (item.needPay && !isPaid) {
      setShowPaymentModal(true)
      return
    }
  }

  return (
    <View className="p-page">
      {/* Profile Header */}
      <View className="p-header">
        <View className="p-avatar">
          <Text className="block text-2xl">🧑</Text>
        </View>
        <Text className="block text-lg font-bold text-white mt-2">i人练习生</Text>
        <View className="p-badge">
          <Text className="block text-xs text-white">🏅 连续打卡{userStats.streak}天</Text>
        </View>
      </View>

      {/* Stats */}
      <View className="p-stats">
        <View className="p-stat">
          <Text className="block text-lg font-bold text-primary">{userStats.practiced}</Text>
          <Text className="block text-xs text-gray-500 mt-1">已练习</Text>
        </View>
        <View className="p-stat">
          <Text className="block text-lg font-bold text-primary">{favorites.length}</Text>
          <Text className="block text-xs text-gray-500 mt-1">收藏</Text>
        </View>
        <View className="p-stat">
          <Text className="block text-lg font-bold text-primary">{userStats.accuracy}%</Text>
          <Text className="block text-xs text-gray-500 mt-1">正确率</Text>
        </View>
      </View>

      {/* Menu */}
      <View className="p-menu">
        {menuItems.map((item) => (
          <View
            key={item.text}
            className="p-item"
            onClick={() => handleMenuClick(item)}
          >
            <Text className="block text-xl w-7 text-center">{item.icon}</Text>
            <Text className="block flex-1 text-sm text-gray-900">{item.text}</Text>
            {item.isNew && (
              <View className="p-item-new">
                <Text className="block text-xs text-primary font-semibold">NEW</Text>
              </View>
            )}
            {item.isBadge && item.extra && (
              <View className="p-item-badge-count">
                <Text className="block text-xs text-white font-semibold">{item.extra}</Text>
              </View>
            )}
            {item.isPrice && (
              <Text className="block text-xs text-primary font-semibold">{item.extra}</Text>
            )}
            <Text className="block text-base text-gray-400 ml-1">›</Text>
          </View>
        ))}
      </View>

      {/* Bottom spacing for TabBar */}
      <View className="h-20" />

      {/* Payment Modal */}
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
