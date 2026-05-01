import { View, Text, ScrollView } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore, CATEGORIES, CHARACTERS } from "@/store/quiz-store"
import PaymentModal from "@/components/payment-modal"
import QuizEngine from "@/components/quiz-engine"
import { getHeaderPaddingTop } from "@/utils/safe-area"
import "./index.css"

export default function Index() {
  const {
    character,
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

  const currentChar = CHARACTERS.find(c => c.id === character) || CHARACTERS[0]
  const totalAnswered = Object.keys(answeredQuestions).length
  const displayStats = {
    practiced: totalAnswered || userStats.practiced || 0,
    streak: streakDays || 0,
    accuracy: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0
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

  const getSeriesUnlocked = (seriesId: string) => seriesProgress[seriesId] || 0
  const getSeriesTotal = (seriesId: string) => {
    const s = seriesList.find(item => item.id === seriesId)
    return s ? s.episodes.length : 5
  }

  return (
    <View className="page-container">
      {/* ==================== HEADER ==================== */}
      <View className="h-header" style={{ paddingTop: `${getHeaderPaddingTop(20)}px` }}>
        {/* Top row */}
        <View className="h-header-top">
          <View className="h-header-left">
            <View className="h-sos-badge">
              <Text className="block text-white font-bold" style={{ fontSize: '10px' }}>SOS</Text>
            </View>
            <Text className="h-header-title block">社交急救包</Text>
          </View>
          <View className="h-avatar-wrap">
            <View className="h-avatar-circle">
              <Text className="block" style={{ fontSize: '16px' }}>{currentChar.emoji}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View className="h-header-stats">
          <View className="h-header-stat">
            <Text className="h-stat-num block">{displayStats.practiced}</Text>
            <Text className="h-stat-label block">已练习</Text>
          </View>
          <View className="h-header-stat">
            <Text className="h-stat-num block">{displayStats.streak}天</Text>
            <Text className="h-stat-label block">连续打卡</Text>
          </View>
          <View className="h-header-stat">
            <Text className="h-stat-num block">{displayStats.accuracy}%</Text>
            <Text className="h-stat-label block">正确率</Text>
          </View>
        </View>
      </View>

      {/* ==================== CATEGORY TAGS ==================== */}
      <View className="h-tags-section">
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
                  <Text className={`block ${isActive ? 'text-white' : ''}`} style={{ fontSize: '15px', fontWeight: isActive ? 500 : 400, color: isActive ? '#FFFFFF' : '#333333' }}>
                    {cat.tag}
                  </Text>
                </View>
              )
            })}
            {/* trailing spacer */}
            <View style={{ width: '20px', flexShrink: 0 }} />
          </View>
        </ScrollView>
      </View>

      {/* ==================== QUIZ CARD ==================== */}
      {currentQuestion && (
        <View className="h-quiz-section">
          {/* Badge row */}
          <View className="h-card-badge-row">
            <View className="h-hot-tag">
              <Text className="block font-semibold" style={{ fontSize: '14px', color: '#FF6B6B' }}>
                {currentQuestion.id === dailyChallenge?.id ? '🔥 今日社死挑战' : '🔥 今日推荐'}
              </Text>
            </View>
            <Text style={{ fontSize: '14px', color: '#888888' }}>{currentQuestion.categoryTag}</Text>
          </View>

          <QuizEngine question={currentQuestion} onNext={handleQuizNext} />
        </View>
      )}

      {/* ==================== SERIES SECTION ==================== */}
      <View className="h-series-section">
        <View className="h-section-header">
          <Text className="block font-semibold" style={{ fontSize: '17px', color: '#212121' }}>🎬 追剧专区</Text>
          <Text style={{ fontSize: '14px', color: '#888888' }}>从社恐小白到社交达人</Text>
        </View>
        <ScrollView scrollX enhanced showScrollbar={false} className="h-series-scroll">
          <View className="h-series-inner">
            {seriesList.map((series) => {
              const unlocked = getSeriesUnlocked(series.id)
              const total = getSeriesTotal(series.id)
              return (
                <View key={series.id} className="h-series-card">
                  <View className="h-series-card-header">
                    <Text className="block font-medium" style={{ fontSize: '15px', color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{series.name}</Text>
                    <Text className="block" style={{ fontSize: '14px' }}>
                      {unlocked >= total ? '✅' : unlocked > 0 ? '▶️' : '🔒'}
                    </Text>
                  </View>
                  <Text className="block" style={{ fontSize: '13px', color: '#888888', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{series.desc}</Text>
                  <View className="h-series-progress">
                    <View className="h-series-track">
                      <View className="h-series-fill" style={{ width: `${(unlocked / total) * 100}%` }} />
                    </View>
                    <Text style={{ fontSize: '12px', color: '#888888', marginLeft: '8px' }}>{unlocked}/{total}</Text>
                  </View>
                </View>
              )
            })}
            {/* trailing spacer */}
            <View style={{ width: '20px', flexShrink: 0 }} />
          </View>
        </ScrollView>
      </View>

      {/* ==================== UNLOCK BANNER ==================== */}
      {!isPaid && (
        <View className="h-unlock" onClick={() => setShowPaymentModal(true)}>
          <View className="h-unlock-content">
            <Text className="block font-semibold" style={{ fontSize: '17px', color: '#FFFFFF' }}>🔓 解锁全部200+题库</Text>
            <Text className="block" style={{ fontSize: '14px', color: '#E0E7FF', marginTop: '4px' }}>无限练习 · 分类浏览 · 收藏功能</Text>
          </View>
          <View className="h-unlock-price">
            <Text className="block font-bold" style={{ fontSize: '16px', color: '#7C54C5' }}>¥19.9</Text>
          </View>
        </View>
      )}

      {/* Bottom spacing for tabbar */}
      <View style={{ height: '80px' }} />

      {/* ==================== PAYMENT MODAL ==================== */}
      <PaymentModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </View>
  )
}
