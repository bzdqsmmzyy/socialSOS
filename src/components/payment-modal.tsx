import { View, Text } from "@tarojs/components"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
}

export default function PaymentModal({ open, onClose }: PaymentModalProps) {
  const features = [
    "🔓 200+ 全场景题库",
    "⭐ 收藏重点题目",
    "📊 个人学习报告",
    "🎯 专项训练模式"
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="payment-modal-content">
        <DialogHeader>
          <DialogTitle>
            <Text className="block text-lg font-bold text-center text-purple-700">👑 解锁完整版</Text>
          </DialogTitle>
        </DialogHeader>

        <View className="mt-4">
          {features.map((feature) => (
            <View key={feature} className="flex flex-row items-center py-2">
              <Text className="block text-sm text-gray-700">{feature}</Text>
            </View>
          ))}
        </View>

        <View className="mt-4 flex flex-col items-center">
          <Text className="block text-3xl font-bold text-purple-700">¥19.9</Text>
          <Text className="block text-xs text-gray-400 mt-1">一次购买，永久使用</Text>
        </View>

        <View className="mt-4 gap-2">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full py-3">
            <Text className="text-white font-semibold">立即解锁</Text>
          </Button>
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={onClose}
          >
            <Text className="text-gray-400">下次再说</Text>
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  )
}
