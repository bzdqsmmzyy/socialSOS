import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore, CATEGORIES } from "@/store/quiz-store"
import PaymentModal from "@/components/payment-modal"
import "./index.css"

export default function Index() {
  const {
    userStats, showPaymentModal, setShowPaymentModal,
    currentCategoryFilter, setCurrentCategoryFilter,
    currentQuestionIndex, quizPhase, selectedOption,
    startQuiz, selectOption, nextQuestion,
    getFilteredQuestions, canAnswer, getRemainingFreeCount,
    isPaid, toggleFavorite, favorites
  } = useQuizStore()

  const filteredQuestions = getFilteredQuestions()
  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0]
  const remainingFree = getRemainingFreeCount()
  const isFavorited = currentQuestion ? favorites.includes(currentQuestion.id) : false

  const handleSelectOption = (optionIndex: number) => {
    if (!canAnswer()) {
      setShowPaymentModal(true)
      return
    }
    selectOption(optionIndex)
  }

  const handleNext = () => {
    if (!isPaid && remainingFree <= 0) {
      setShowPaymentModal(true)
      return
    }
    nextQuestion()
  }

  const handleCopyAnswer = () => {
    if (!currentQuestion) return
    const answerText = currentQuestion.bestAnswer
    Taro.setClipboardData({
      data: answerText
    })
  }

  const handleFavorite = () => {
    if (!currentQuestion) return
    if (!isPaid) {
      setShowPaymentModal(true)
      return
    }
    toggleFavorite(currentQuestion.id)
  }

  return (
    <View className="page-container">
      {/* Gradient Header with Stats */}
      <View className="home-header">
        <Text className="block text-2xl font-bold text-white">🆘 社交急救包</Text>
        <Text className="block text-sm text-white text-opacity-90 mt-1">每天3分钟，告别社交尴尬</Text>
        <View className="home-stats">
          <View className="stat-card">
            <Text className="block text-xl font-bold text-white">🔥 {userStats.practiced}题</Text>
            <Text className="block text-xs text-white text-opacity-80">已练习</Text>
          </View>
          <View className="stat-card">
            <Text className="block text-xl font-bold text-white">⚡ {userStats.streak}天</Text>
            <Text className="block text-xs text-white text-opacity-80">连续打卡</Text>
          </View>
          {!isPaid && (
            <View className="stat-card-free">
              <Text className="block text-xl font-bold text-white">🎁 {remainingFree}</Text>
              <Text className="block text-xs text-white text-opacity-80">今日免费</Text>
            </View>
          )}
        </View>
      </View>

      {/* Scene Tags - Horizontal Scroll */}
      <View className="tags-container">
        {CATEGORIES.map((cat) => (
          <View
            key={cat.id}
            className={`tag-item ${currentCategoryFilter === cat.id ? 'tag-active' : ''}`}
            onClick={() => setCurrentCategoryFilter(cat.id)}
          >
            <Text className={`block text-sm ${currentCategoryFilter === cat.id ? 'text-white font-semibold' : 'text-gray-600'}`}>
              {cat.tag}
            </Text>
          </View>
        ))}
      </View>

      {/* Quiz Area - Embedded */}
      {currentQuestion && (
        <View className="quiz-area">
          {/* Phase: Scene Display */}
          {quizPhase === 'scene' && (
            <View className="scene-card">
              <View className="scene-header">
                <View className="scene-tag">
                  <Text className="block text-xs text-primary font-medium">{currentQuestion.categoryTag}</Text>
                </View>
                {currentQuestion.isHot && (
                  <View className="hot-tag">
                    <Text className="block text-xs text-white font-medium">🔥 热门</Text>
                  </View>
                )}
              </View>
              <Text className="block text-lg font-bold text-gray-900 leading-relaxed mt-4">
                {currentQuestion.sceneFull}
              </Text>
              <View className="scene-action">
                <View className="start-btn" onClick={startQuiz}>
                  <Text className="block text-base font-bold text-white">🎯 开始答题</Text>
                </View>
              </View>
            </View>
          )}

          {/* Phase: Selecting */}
          {quizPhase === 'selecting' && (
            <View className="selecting-card">
              <View className="scene-mini">
                <View className="scene-tag">
                  <Text className="block text-xs text-primary font-medium">{currentQuestion.categoryTag}</Text>
                </View>
                <Text className="block text-base font-semibold text-gray-900 leading-relaxed mt-2">
                  {currentQuestion.scene}
                </Text>
              </View>
              <Text className="block text-sm text-gray-500 mt-4 mb-3">选一个你会说的答案👇</Text>
              {currentQuestion.options.map((option, idx) => (
                <View
                  key={idx}
                  className="option-item"
                  onClick={() => handleSelectOption(idx)}
                >
                  <View className="option-letter">
                    <Text className="block text-sm font-bold text-primary">{option.letter}</Text>
                  </View>
                  <Text className="block flex-1 text-sm text-gray-800 leading-relaxed">{option.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Phase: Revealed */}
          {quizPhase === 'revealed' && selectedOption !== null && (
            <View className="revealed-card">
              {/* Your Selection */}
              <View className={`your-answer ${selectedOption === currentQuestion.correctIndex ? 'answer-correct' : 'answer-wrong'}`}>
                <Text className="block text-sm font-semibold text-white">
                  {selectedOption === currentQuestion.correctIndex ? '✅ 选对了！高情商！' : '❌ 选错了，正确答案是 ' + currentQuestion.options[currentQuestion.correctIndex].letter}
                </Text>
              </View>

              {/* Best Answer */}
              <View className="best-answer-section">
                <Text className="block text-sm font-bold text-gray-900 mb-2">💬 最佳话术</Text>
                <View className="best-answer-box">
                  <Text className="block text-sm text-gray-800 leading-relaxed">
                    &ldquo;{currentQuestion.bestAnswer}&rdquo;
                  </Text>
                </View>
                <View className="copy-btn" onClick={handleCopyAnswer}>
                  <Text className="block text-xs font-semibold text-primary">📋 复制话术</Text>
                </View>
              </View>

              {/* Technique Tag */}
              <View className="technique-section">
                <View className="technique-tag">
                  <Text className="block text-xs font-semibold text-primary">💡 {currentQuestion.technique}</Text>
                </View>
              </View>

              {/* Tips */}
              <View className="tips-section">
                <Text className="block text-xs font-bold text-gray-500 mb-1">💡 社交小贴士</Text>
                <Text className="block text-xs text-gray-600 leading-relaxed">{currentQuestion.tips}</Text>
              </View>

              {/* Actions */}
              <View className="revealed-actions">
                <View className="fav-btn" onClick={handleFavorite}>
                  <Text className="block text-sm">{isFavorited ? '❤️' : '🤍'}</Text>
                  <Text className="block text-xs text-gray-500 ml-1">收藏</Text>
                </View>
                <View className="next-btn" onClick={handleNext}>
                  <Text className="block text-sm font-bold text-white">
                    下一题 →
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Unlock Banner */}
      {!isPaid && (
        <View className="unlock-banner" onClick={() => setShowPaymentModal(true)}>
          <View className="flex-1">
            <Text className="block text-sm font-semibold text-white">🔒 解锁全部200+题库</Text>
            <Text className="block text-xs text-white text-opacity-80 mt-1">无限练习 · 分类浏览 · 收藏功能 · 仅¥19.9</Text>
          </View>
          <View className="unlock-price-tag">
            <Text className="text-sm font-bold text-purple-700">¥19.9</Text>
          </View>
        </View>
      )}

      {/* Bottom spacing for TabBar */}
      <View className="h-20" />

      {/* Payment Modal */}
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
