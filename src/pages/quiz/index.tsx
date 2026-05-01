import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useQuizStore, SOCIAL_QUIZ_QUESTIONS } from "@/store/quiz-store"
import { useState } from "react"
import "./index.css"

type QuizPhase = "start" | "question" | "result"

interface Scores {
  avoid: number
  explode: number
  hidden: number
}

const RESULT_TYPES: Record<string, { type: string; desc: string }> = {
  avoid: {
    type: "回避型社恐",
    desc: "逃避一切社交场合，能不见人就不见人。你的内心其实很丰富，只是还没找到舒服的社交方式。"
  },
  explode: {
    type: "爆发型社恐",
    desc: "平时沉默寡言，偶尔突然爆发说了一堆话，说完又开始后悔。你需要的是自然的表达节奏。"
  },
  hidden: {
    type: "隐形社牛",
    desc: "其实你社交能力不差，只是觉得不必要的社交太累了。你是选择性社交的高手！"
  },
  balanced: {
    type: "佛系型",
    desc: "你对社交不焦虑也不热衷，随缘社交，来者不拒，去者不留。这是最健康的状态～"
  }
}

function determineResult(scores: Scores) {
  const entries = [
    { key: "avoid", val: scores.avoid, ...RESULT_TYPES.avoid },
    { key: "explode", val: scores.explode, ...RESULT_TYPES.explode },
    { key: "hidden", val: scores.hidden, ...RESULT_TYPES.hidden }
  ]

  const sorted = [...entries].sort((a, b) => b.val - a.val)

  // If top two are equal, it's balanced
  if (sorted[0].val === sorted[1].val) {
    return { ...RESULT_TYPES.balanced, score: Math.max(scores.avoid, scores.explode, scores.hidden) * 10 }
  }

  return { type: sorted[0].type, desc: sorted[0].desc, score: sorted[0].val * 10 }
}

export default function Quiz() {
  const { quizResult, setQuizResult, preferredStyle, setPreferredStyle } = useQuizStore()

  const [phase, setPhase] = useState<QuizPhase>(quizResult ? "result" : "start")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<Scores>({ avoid: 0, explode: 0, hidden: 0 })
  const [result, setResult] = useState<{ type: string; desc: string; score: number } | null>(quizResult ? { type: quizResult.type, desc: quizResult.desc, score: quizResult.score } : null)

  const handleStartQuiz = () => {
    if (quizResult) {
      // Reset and restart
      setResult(null)
      setScores({ avoid: 0, explode: 0, hidden: 0 })
      setCurrentIndex(0)
      setPhase("question")
      return
    }
    setPhase("question")
    setCurrentIndex(0)
    setScores({ avoid: 0, explode: 0, hidden: 0 })
  }

  const handleSelectOption = (optionIdx: number) => {
    const question = SOCIAL_QUIZ_QUESTIONS[currentIndex]
    if (!question) return

    const option = question.options[optionIdx]
    const newScores = {
      avoid: scores.avoid + (option.scores.avoid || 0),
      explode: scores.explode + (option.scores.explode || 0),
      hidden: scores.hidden + (option.scores.hidden || 0)
    }

    if (currentIndex < SOCIAL_QUIZ_QUESTIONS.length - 1) {
      setScores(newScores)
      setCurrentIndex(currentIndex + 1)
    } else {
      // Finished all questions
      const finalResult = determineResult(newScores)
      setResult(finalResult)
      setScores(newScores)
      setPhase("result")

      // Save to store
      setQuizResult({ type: finalResult.type, desc: finalResult.desc, score: finalResult.score })
    }
  }

  const handleSaveStyle = (style: string) => {
    setPreferredStyle(style)
    Taro.showToast({ title: "已保存", icon: "success", duration: 1500 })
  }

  const handleGoBack = () => {
    Taro.navigateBack()
  }

  const handleRestart = () => {
    setResult(null)
    setScores({ avoid: 0, explode: 0, hidden: 0 })
    setCurrentIndex(0)
    setPhase("question")
  }

  const progressPercent = phase === "question"
    ? Math.round(((currentIndex + 1) / SOCIAL_QUIZ_QUESTIONS.length) * 100)
    : 0

  const currentQuestion = phase === "question" ? SOCIAL_QUIZ_QUESTIONS[currentIndex] : null

  // ====== START SCREEN ======
  if (phase === "start") {
    return (
      <View className="sq-page">
        <View className="sq-start-container">
          <View className="sq-start-icon-wrap">
            <Text className="block sq-start-icon">🫣</Text>
          </View>
          <Text className="block sq-start-title">社恐测评</Text>
          <Text className="block sq-start-desc">10道题，测测你是哪类i人～</Text>
          <View className="sq-start-features">
            <View className="sq-feature-item">
              <Text className="block sq-feature-icon">📝</Text>
              <Text className="block sq-feature-text">10道精心设计场景题</Text>
            </View>
            <View className="sq-feature-item">
              <Text className="block sq-feature-icon">🎯</Text>
              <Text className="block sq-feature-text">2分钟找到你的社交人格</Text>
            </View>
            <View className="sq-feature-item">
              <Text className="block sq-feature-icon">💡</Text>
              <Text className="block sq-feature-text">获得专属社交建议</Text>
            </View>
          </View>
          <View className="sq-start-btn" onClick={handleStartQuiz}>
            <Text className="block sq-start-btn-text">开始测评</Text>
          </View>
        </View>
      </View>
    )
  }

  // ====== RESULT SCREEN ======
  if (phase === "result" && result) {
    return (
      <View className="sq-page">
        <View className="sq-result-container">
          <View className="sq-result-badge">
            <Text className="block sq-result-emoji">🎉</Text>
          </View>
          <Text className="block sq-result-type">{result.type}</Text>
          <View className="sq-result-score-wrap">
            <Text className="block sq-result-score-label">社恐指数</Text>
            <Text className="block sq-result-score">{result.score}</Text>
          </View>
          <View className="sq-result-desc-card">
            <Text className="block sq-result-desc">{result.desc}</Text>
          </View>

          {/* Style selector */}
          <View className="sq-style-section">
            <Text className="block sq-style-title">选择你的应对风格</Text>
            <View className="sq-style-options">
              <View
                className={`sq-style-opt ${preferredStyle === "稳妥型" ? "sq-style-opt-active" : ""}`}
                onClick={() => handleSaveStyle("稳妥型")}
              >
                <Text className="block sq-style-opt-emoji">🛡️</Text>
                <Text className="block sq-style-opt-name">稳妥型</Text>
                <Text className="block sq-style-opt-desc">温和含蓄，不正面冲突</Text>
              </View>
              <View
                className={`sq-style-opt ${preferredStyle === "主动型" ? "sq-style-opt-active" : ""}`}
                onClick={() => handleSaveStyle("主动型")}
              >
                <Text className="block sq-style-opt-emoji">🚀</Text>
                <Text className="block sq-style-opt-name">主动型</Text>
                <Text className="block sq-style-opt-desc">直球出击，掌握主动权</Text>
              </View>
              <View
                className={`sq-style-opt ${preferredStyle === "高能型" ? "sq-style-opt-active" : ""}`}
                onClick={() => handleSaveStyle("高能型")}
              >
                <Text className="block sq-style-opt-emoji">⚡</Text>
                <Text className="block sq-style-opt-name">高能型</Text>
                <Text className="block sq-style-opt-desc">幽默自嘲，出其不意</Text>
              </View>
            </View>
          </View>

          <View className="sq-result-actions">
            <View className="sq-btn-restart" onClick={handleRestart}>
              <Text className="block sq-btn-text">重新测评</Text>
            </View>
            <View className="sq-btn-back" onClick={handleGoBack}>
              <Text className="block sq-btn-text">返回</Text>
            </View>
          </View>
        </View>
        <View className="sq-bottom-space" />
      </View>
    )
  }

  // ====== QUESTION SCREEN ======
  return (
    <View className="sq-page">
      <View className="sq-question-container">
        {/* Progress bar */}
        <View className="sq-progress-wrap">
          <View className="sq-progress-header">
            <Text className="block sq-progress-label">第 {currentIndex + 1}/{SOCIAL_QUIZ_QUESTIONS.length} 题</Text>
            <Text className="block sq-progress-pct">{progressPercent}%</Text>
          </View>
          <View className="sq-progress-bar">
            <View className="sq-progress-fill" style={{ width: `${progressPercent}%` }} />
          </View>
        </View>

        {/* Question scene */}
        {currentQuestion && (
          <View className="sq-question-card">
            <View className="sq-question-number">
              <Text className="block sq-question-num-text">Q{currentIndex + 1}</Text>
            </View>
            <Text className="block sq-question-scene">{currentQuestion.scene}</Text>
          </View>
        )}

        {/* Options */}
        {currentQuestion && (
          <View className="sq-options">
            {currentQuestion.options.map((option, idx) => (
              <View
                key={idx}
                className="sq-option-item"
                onClick={() => handleSelectOption(idx)}
              >
                <View className="sq-option-letter">
                  <Text className="block sq-option-letter-text">
                    {["A", "B", "C"][idx]}
                  </Text>
                </View>
                <Text className="block sq-option-text">{option.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View className="sq-bottom-space" />
    </View>
  )
}
