import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore, CATEGORIES } from "@/store/quiz-store"
import PaymentModal from "@/components/payment-modal"
import { useEffect, useRef } from "react"
import "./index.css"

export default function Index() {
  const {
    userStats, showPaymentModal, setShowPaymentModal,
    currentCategoryFilter, setCurrentCategoryFilter,
    currentQuestionIndex, quizPhase, selectedOption,
    startQuiz, selectOption, nextQuestion,
    getFilteredQuestions, canAnswer, getRemainingFreeCount,
    isPaid
  } = useQuizStore()

  const resultRef = useRef<any>(null)

  const filteredQuestions = getFilteredQuestions()
  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0]
  const remainingFree = getRemainingFreeCount()

  useEffect(() => {
    if (quizPhase === 'revealed' && resultRef.current) {
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 400)
    }
  }, [quizPhase])

  const handleStartQuiz = () => {
    startQuiz()
  }

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
    setTimeout(() => {
      Taro.pageScrollTo({ selector: '.h-card', duration: 300 })
    }, 100)
  }

  const handleCopyAnswer = () => {
    if (!currentQuestion) return
    Taro.setClipboardData({ data: currentQuestion.bestAnswer })
  }

  const getOptionClass = (idx: number) => {
    if (quizPhase !== 'revealed' || selectedOption === null) return 'h-opt'
    const isCorrect = idx === currentQuestion.correctIndex
    const isSelected = idx === selectedOption
    let cls = 'h-opt'
    if (isCorrect) cls += ' h-opt-correct'
    if (isSelected && !isCorrect) cls += ' h-opt-wrong'
    if (quizPhase === 'revealed') cls += ' h-opt-locked'
    return cls
  }

  const getLetterClass = (idx: number) => {
    if (quizPhase !== 'revealed' || selectedOption === null) return 'h-letter'
    const isCorrect = idx === currentQuestion.correctIndex
    const isSelected = idx === selectedOption
    let cls = 'h-letter'
    if (isCorrect) cls += ' h-letter-correct'
    if (isSelected && !isCorrect) cls += ' h-letter-wrong'
    return cls
  }

  const displayStats = {
    practiced: userStats.practiced || 28,
    streak: userStats.streak || 7,
    accuracy: userStats.accuracy || 85,
    favorites: userStats.favorites || 5
  }

  return (
    <View className="page-container">
      {/* ===== Header ===== */}
      <View className="h-header">
        <View className="h-row">
          <Text className="h-title">🆘 社交急救包</Text>
          <View className="h-avatar">
            <Text className="block text-base">🧑</Text>
          </View>
        </View>
        <View className="h-stats">
          <View className="h-stat">
            <Text className="stat-num block">{displayStats.practiced}</Text>
            <Text className="stat-label block">已练习</Text>
          </View>
          <View className="h-stat">
            <Text className="stat-num block">🔥{displayStats.streak}天</Text>
            <Text className="stat-label block">连续打卡</Text>
          </View>
          <View className="h-stat">
            <Text className="stat-num block">{displayStats.accuracy}%</Text>
            <Text className="stat-label block">正确率</Text>
          </View>
        </View>
      </View>

      {/* ===== Category Tags ===== */}
      <View className="h-tags">
        {CATEGORIES.map((cat) => (
          <View
            key={cat.id}
            className={`h-tag ${currentCategoryFilter === cat.id ? 'h-tag-active' : ''}`}
            onClick={() => setCurrentCategoryFilter(cat.id)}
          >
            <Text className={`block text-sm font-medium ${currentCategoryFilter === cat.id ? 'text-white' : 'text-gray-500'}`}>
              {cat.tag}
            </Text>
          </View>
        ))}
      </View>

      {/* ===== Quiz Card ===== */}
      {currentQuestion && (
        <View className="h-card">
          <View className="h-card-badge">
            <View className="h-hot-tag">
              <Text className="block text-xs font-semibold">🔥 今日推荐</Text>
            </View>
            <Text className="block text-xs text-gray-400">{currentQuestion.categoryTag}</Text>
            <Text className="block text-xs text-gray-300">·</Text>
            <Text className="block text-xs text-gray-400">{'⭐'.repeat(currentQuestion.difficulty)}</Text>
          </View>

          <View className="h-card-scene">
            {currentQuestion.sceneFull.split('\n').map((line, i) => (
              <Text key={i} className="block text-base text-gray-900 leading-relaxed">
                {line === '' ? '\n' : line}
              </Text>
            ))}
          </View>

          {quizPhase === 'scene' && (
            <View>
              <View className="h-card-hint">
                <Text className="block text-xs text-center" style="color:#ccc">👇 选一个你的应对方式</Text>
              </View>
              <View className="h-start" onClick={handleStartQuiz}>
                <Text className="block text-base font-bold text-white text-center">🎯 开始答题</Text>
              </View>
            </View>
          )}

          {quizPhase !== 'scene' && (
            <View className="h-options">
              {currentQuestion.options.map((option, idx) => (
                <View
                  key={idx}
                  className={getOptionClass(idx)}
                  onClick={() => handleSelectOption(idx)}
                >
                  <View className={getLetterClass(idx)}>
                    <Text className="block text-xs font-bold">{option.letter}</Text>
                  </View>
                  <Text className="block flex-1 text-sm text-gray-800 leading-relaxed">{option.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ===== Result Area ===== */}
      {quizPhase === 'revealed' && selectedOption !== null && currentQuestion && (
        <View className="h-result" ref={resultRef}>
          <View className="h-result-card">
            <Text className="block text-xs font-semibold mb-2" style="color:#34C759">✅ 最佳回答</Text>
            <Text className="h-result-answer block">{currentQuestion.bestAnswer}</Text>
            <View className="h-result-tag">
              <Text className="block text-xs font-medium" style="color:#2E7D32">💡 {currentQuestion.technique}</Text>
            </View>
          </View>

          <View className="h-tips">
            <Text className="block text-xs font-semibold mb-2" style="color:#F57C00">📝 解析</Text>
            <Text className="block text-xs text-gray-600 leading-relaxed">{currentQuestion.tips}</Text>
          </View>

          <View className="h-actions">
            <View className="h-btn-copy" onClick={handleCopyAnswer}>
              <Text className="block text-sm font-semibold text-center">📋 复制话术</Text>
            </View>
            <View className="h-btn-next" onClick={handleNext}>
              <Text className="block text-sm font-semibold text-center">下一题 →</Text>
            </View>
          </View>
        </View>
      )}

      {/* ===== Unlock Banner ===== */}
      {!isPaid && (
        <View className="h-unlock" onClick={() => setShowPaymentModal(true)}>
          <View className="flex-1">
            <Text className="block text-sm font-semibold text-white">🔓 解锁全部200+题库</Text>
            <Text className="block text-xs text-white mt-1" style="opacity:0.85">无限练习 · 分类浏览 · 收藏功能</Text>
          </View>
          <View className="h-unlock-price">
            <Text className="font-bold">¥19.9</Text>
          </View>
        </View>
      )}

      <View className="h-bottom-space" />

      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
