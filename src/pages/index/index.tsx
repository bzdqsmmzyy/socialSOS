import { View, Text, ScrollView } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore, CATEGORIES, CHARACTERS, getRank } from "@/store/quiz-store"
import PaymentModal from "@/components/payment-modal"
import QuizEngine from "@/components/quiz-engine"
import "./index.css"

export default function Index() {
  const {
    character, totalXP, rankProgress,
    userStats, streakDays, answeredQuestions, correctCount,
    currentCategoryFilter, setCurrentCategoryFilter,
    currentQuestionIndex,
    getFilteredQuestions,
    getDailyChallenge, seriesList, seriesProgress,
    isPaid, showPaymentModal, setShowPaymentModal,
    getRemainingFreeCount
  } = useQuizStore()

  const filteredQuestions = getFilteredQuestions()
  const currentQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0]
  const dailyChallenge = getDailyChallenge()
  const remainingFree = getRemainingFreeCount()

  // ---- Derived gamification data ----
  const currentChar = CHARACTERS.find(c => c.id === character) || CHARACTERS[0]
  const rankInfo = getRank(totalXP)
  const currentRank = rankInfo.rank
  const totalAnswered = Object.keys(answeredQuestions).length
  const displayStats = {
    practiced: totalAnswered || userStats.practiced || 0,
    streak: streakDays || 0,
    accuracy: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0
  }

  // ---- Handlers ----
  const handleDailyChallenge = () => {
    const challenge = getDailyChallenge()
    if (!challenge) return
    const allQuestions = useQuizStore.getState().questions
    const idx = allQuestions.findIndex(q => q.id === challenge.id)
    if (idx >= 0) {
      setCurrentCategoryFilter(0)
      useQuizStore.setState({ currentQuestionIndex: idx })
      setTimeout(() => {
        Taro.pageScrollTo({ selector: '.h-quiz-section', duration: 300 })
      }, 100)
    }
  }

  const handleQuizNext = () => {
    if (!isPaid && remainingFree <= 0) {
      setShowPaymentModal(true)
      return
    }
    useQuizStore.getState().nextQuestion()
    setTimeout(() => {
      Taro.pageScrollTo({ selector: '.h-quiz-section', duration: 300 })
    }, 100)
  }

  // ---- Series card helpers ----
  const getSeriesUnlocked = (seriesId: string) => seriesProgress[seriesId] || 0
  const getSeriesTotal = (seriesId: string) => {
    const s = seriesList.find(item => item.id === seriesId)
    return s ? s.episodes.length : 5
  }

  return (
    <View className="page-container">
      {/* ==================== HEADER ==================== */}
      <View className="h-header-v2">
        {/* Top row: Title + Character Avatar */}
        <View className="h-header-top">
          <Text className="h-header-title block">社交急救包</Text>
          <View className="h-avatar-chip">
            <View className="h-avatar-circle">
              <Text className="block text-sm">{currentChar.emoji}</Text>
            </View>
            <Text className="block text-xs text-white font-medium">{currentChar.name}</Text>
          </View>
        </View>

        {/* XP Bar */}
        <View className="h-xp-section">
          <View className="h-xp-label-row">
            <Text className="block text-xs text-white" style={{ opacity: 0.9 }}>社交能量值</Text>
            <Text className="block text-xs text-white font-bold">{totalXP}</Text>
          </View>
          <View className="h-xp-track">
            <View
              className="h-xp-fill"
              style={{ width: `${rankProgress}%`, backgroundColor: currentRank.color }}
            />
          </View>
        </View>

        {/* Rank Badge */}
        <View className="h-rank-badge-wrap">
          <View className="h-rank-chip" style={{ backgroundColor: currentRank.color + '20', borderColor: currentRank.color + '40' }}>
            <Text className="block text-base">{currentRank.icon}</Text>
            <Text className="block text-xs font-semibold" style={{ color: currentRank.color }}>{currentRank.name}</Text>
          </View>
        </View>

        {/* Bottom Stats Row */}
        <View className="h-header-stats">
          <View className="h-header-stat">
            <Text className="h-stat-num block">{displayStats.practiced}</Text>
            <Text className="h-stat-label block">已练习</Text>
          </View>
          <View className="h-header-stat">
            <Text className="h-stat-num block">🔥{displayStats.streak}天</Text>
            <Text className="h-stat-label block">连续打卡</Text>
          </View>
          <View className="h-header-stat">
            <Text className="h-stat-num block">{displayStats.accuracy}%</Text>
            <Text className="h-stat-label block">正确率</Text>
          </View>
        </View>
      </View>

      {/* ==================== CATEGORY TAGS ==================== */}
      <View className="h-tags-v2">
        <ScrollView scrollX enhanced showScrollbar={false} className="h-tags-scroll">
          <View className="h-tags-inner">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategoryFilter === cat.id
              return (
                <View
                  key={cat.id}
                  className={`h-tag-chip ${isActive ? 'h-tag-chip-active' : ''}`}
                  onClick={() => setCurrentCategoryFilter(cat.id)}
                >
                  <Text className={`block text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {cat.tag}
                  </Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {/* ==================== DAILY CHALLENGE CARD ==================== */}
      {dailyChallenge && (
        <View className="h-daily-card" onClick={handleDailyChallenge}>
          <View className="h-daily-badge">
            <Text className="block text-xs font-bold" style={{ color: '#E11D48' }}>🔥 今日社死挑战</Text>
            <View className="flex flex-row items-center gap-1">
              <Text className="block text-xs text-orange-400">{'⭐'.repeat(dailyChallenge.difficulty)}</Text>
              <Text className="block text-xs text-gray-400">{dailyChallenge.categoryTag}</Text>
            </View>
          </View>
          <View className="h-daily-body">
            <Text className="block text-sm text-gray-800 leading-relaxed">
              {dailyChallenge.sceneFull ? dailyChallenge.sceneFull.split('\n')[0] : dailyChallenge.scene}
            </Text>
          </View>
          <View className="h-daily-action">
            <Text className="block text-sm font-semibold text-white">点击挑战 →</Text>
          </View>
        </View>
      )}

      {/* ==================== QUIZ SECTION ==================== */}
      {currentQuestion && (
        <View className="h-quiz-section">
          {/* Category + difficulty badge */}
          <View className="h-card-badge-row">
            <View className="h-hot-tag">
              <Text className="block text-xs font-semibold">
                {currentQuestion.id === dailyChallenge?.id ? '🔥 今日社死挑战' : '🔥 今日推荐'}
              </Text>
            </View>
            <Text className="block text-xs text-gray-400">{currentQuestion.categoryTag}</Text>
            <Text className="block text-xs text-gray-300">·</Text>
            <Text className="block text-xs text-gray-400">{'⭐'.repeat(currentQuestion.difficulty)}</Text>
          </View>
          <QuizEngine question={currentQuestion} onNext={handleQuizNext} />
        </View>
      )}

      {/* ==================== SERIES / MICRO-DRAMA SECTION ==================== */}
      <View className="h-series-section">
        <View className="h-section-title">
          <Text className="block text-base font-bold text-gray-900">🎬 追剧专区</Text>
          <Text className="block text-xs text-gray-400">从社恐小白到社交达人</Text>
        </View>
        <ScrollView scrollX enhanced showScrollbar={false} className="h-series-scroll">
          {seriesList.map((series) => {
            const unlocked = getSeriesUnlocked(series.id)
            const total = getSeriesTotal(series.id)
            const isAllUnlocked = unlocked >= total
            return (
              <View key={series.id} className="h-series-card">
                <View className="h-series-card-header">
                  <Text className="block text-sm font-semibold text-gray-900">{series.name}</Text>
                  {isAllUnlocked ? (
                    <Text className="block text-sm">✅</Text>
                  ) : unlocked > 0 ? (
                    <Text className="block text-sm">▶️</Text>
                  ) : (
                    <Text className="block text-sm">🔒</Text>
                  )}
                </View>
                <Text className="block text-xs text-gray-400 mb-2">{series.desc}</Text>
                <View className="h-series-progress">
                  <View className="h-series-track">
                    <View
                      className="h-series-fill"
                      style={{ width: `${(unlocked / total) * 100}%` }}
                    />
                  </View>
                  <Text className="block text-xs text-gray-400 ml-2">{unlocked}/{total}</Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>

      {/* ==================== BOTTOM STATS ==================== */}
      <View className="h-bottom-stats">
        <View className="h-bottom-stats-row">
          <View className="h-bs-item">
            <Text className="block text-lg font-bold" style={{ color: '#E11D48' }}>{displayStats.practiced}</Text>
            <Text className="block text-xs text-gray-400">今日练习</Text>
          </View>
          <View className="h-bs-divider" />
          <View className="h-bs-item">
            <Text className="block text-lg font-bold" style={{ color: '#E11D48' }}>{displayStats.streak}天</Text>
            <Text className="block text-xs text-gray-400">连续打卡</Text>
          </View>
          <View className="h-bs-divider" />
          <View className="h-bs-item">
            <Text className="block text-lg font-bold" style={{ color: '#34C759' }}>{displayStats.accuracy}%</Text>
            <Text className="block text-xs text-gray-400">正确率</Text>
          </View>
        </View>
      </View>

      {/* ==================== UNLOCK BANNER ==================== */}
      {!isPaid && (
        <View className="h-unlock" onClick={() => setShowPaymentModal(true)}>
          <View className="flex-1">
            <Text className="block text-sm font-semibold text-white">🔓 解锁全部200+题库</Text>
            <Text className="block text-xs text-white mt-1" style={{ opacity: 0.85 }}>无限练习 · 分类浏览 · 收藏功能</Text>
          </View>
          <View className="h-unlock-price">
            <Text className="block font-bold">¥19.9</Text>
          </View>
        </View>
      )}

      <View className="h-bottom-space" />

      {/* ==================== PAYMENT MODAL ==================== */}
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
