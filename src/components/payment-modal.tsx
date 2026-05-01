import { View, Text } from "@tarojs/components"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useQuizStore } from "@/store/quiz-store"
import { Check, Infinity, FolderOpen, Star, Sparkles } from "lucide-react-taro"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
}

export default function PaymentModal({ open, onClose }: PaymentModalProps) {
  const { isPaid, setShowPaymentModal } = useQuizStore()

  const features = [
    { icon: Check, text: "全部 200+ 社交场景题库", color: "#4CD964" },
    { icon: Infinity, text: "无限次练习，不限次数", color: "#6C5CE7" },
    { icon: FolderOpen, text: "6大场景分类浏览", color: "#FF9F43" },
    { icon: Star, text: "收藏功能，随时复习", color: "#6C5CE7" },
    { icon: Sparkles, text: "永久免费更新新题目", color: "#A29BFE" }
  ]

  const handleUnlock = () => {
    useQuizStore.setState({ isPaid: true, dailyFreeCount: 999 })
    setShowPaymentModal(false)
  }

  if (isPaid) return null

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="pt-2">
          <DrawerTitle>
            <Text className="block text-lg font-bold text-center">解锁完整版</Text>
          </DrawerTitle>
        </DrawerHeader>

        <View className="px-6 pb-2">
          {features.map((feature) => (
            <View key={feature.text} className="flex flex-row items-center gap-3 py-2">
              <feature.icon size={18} color={feature.color} />
              <Text className="block text-sm text-gray-700">{feature.text}</Text>
            </View>
          ))}
        </View>

        <View className="px-6 pb-2 flex flex-col items-center">
          <Text className="block text-3xl font-bold" style={{ color: '#6C5CE7' }}>¥19.9</Text>
          <Text className="block text-xs text-gray-400 mt-1">一杯奶茶钱，告别社交焦虑</Text>
        </View>

        <View className="px-6 pb-4 pt-2">
          <View className="pay-btn" onClick={handleUnlock}>
            <Text className="block text-base font-bold text-white text-center">微信支付</Text>
          </View>
          <View className="pay-close" onClick={onClose}>
            <Text className="block text-sm text-gray-400 text-center">暂不需要</Text>
          </View>
        </View>
      </DrawerContent>
    </Drawer>
  )
}
