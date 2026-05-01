import { View, Text, Textarea } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useQuizStore, QuizQuestion } from "@/store/quiz-store"
import "./quiz-engine.css"

// ==================== PROPS ====================

export interface QuizEngineProps {
  question: QuizQuestion
  onNext?: () => void
}

// ==================== DICE EMOJI HELPER ====================

function getDeadDice(str: string): string {
  const count = (str.match(/⭐/g) || []).length
  if (count >= 5) return "☠️"
  if (count >= 4) return "💀"
  if (count >= 3) return "😰"
  if (count >= 2) return "😬"
  return "🙂"
}

// ==================== TYPE BADGE HELPER ====================

function getTypeBadge(type: string): { label: string; cls: string } {
  switch (type) {
    case "choice": return { label: "三选一", cls: "qe-type-badge-choice" }
    case "fillBlank": return { label: "填空", cls: "qe-type-badge-fill" }
    case "relay": return { label: "接力对话", cls: "qe-type-badge-relay" }
    case "dilemma": return { label: "两难选择", cls: "qe-type-badge-dilemma" }
    case "spotMistake": return { label: "找茬", cls: "qe-type-badge-spot" }
    case "puzzle": return { label: "拼图", cls: "qe-type-badge-puzzle" }
    default: return { label: "", cls: "" }
  }
}

// ==================== MAIN COMPONENT ====================

export default function QuizEngine({ question, onNext }: QuizEngineProps) {
  // ---- Store ----
  const {
    quizPhase, selectedOption, setQuizPhase, setSelectedOption,
    selectOption, nextQuestion, settings, timeLeft, setTimeLeft,
    timerActive, setTimerActive, toggleFavorite, favorites,
    selectRelayOption, currentRound, roundResults, selectedDialogs,
    puzzleOrder, setPuzzleOrder, startQuiz
  } = useQuizStore()

  // ---- Local State ----
  const [fillInput, setFillInput] = useState("")
  const [fillSubmitted, setFillSubmitted] = useState(false)
  const [spotClicked, setSpotClicked] = useState<number | null>(null)
  const [spotDone, setSpotDone] = useState(false)
  const [shakeIdx, setShakeIdx] = useState<number | null>(null)
  const [puzzleHandled, setPuzzleHandled] = useState(false)

  // ---- Feedback Animation State ----
  const [showCorrectFlash, setShowCorrectFlash] = useState(false)
  const [showWrongFlash, setShowWrongFlash] = useState(false)
  const [prevPhase, setPrevPhase] = useState(quizPhase)

  // ---- Puzzle local correctness (since puzzle doesn't use selectOption) ----
  const [puzzleIsCorrect, setPuzzleIsCorrect] = useState(false)

  // ---- Derived Data ----
  const isCorrect = useMemo(() => {
    if (!question) return false
    if (question.questionType === "relay") {
      return (selectedOption ?? 0) >= 70
    }
    if (question.questionType === "puzzle") {
      return puzzleIsCorrect
    }
    if (question.questionType === "spotMistake") {
      return spotDone && spotClicked === question.mistakeIndex
    }
    if (question.questionType === "fillBlank") {
      // Fill blank is always "correct" for feedback purposes (it's a learning exercise)
      return true
    }
    return selectedOption === question.correctIndex
  }, [question, selectedOption, puzzleIsCorrect, spotDone, spotClicked])

  const isFavorite = useMemo(() => {
    return favorites.includes(question?.id ?? -1)
  }, [favorites, question])

  const typeBadge = useMemo(() => getTypeBadge(question?.questionType ?? ""), [question])

  // ---- Shuffle puzzle fragments on mount ----
  const puzzleFragments = useMemo(() => {
    if (!question || question.questionType !== "puzzle" || !question.correctOrder) return []
    const shuffled = [...question.correctOrder].sort(() => Math.random() - 0.5)
    return shuffled
  }, [question])

  // ---- Reset local state on question change ----
  useEffect(() => {
    setFillInput("")
    setFillSubmitted(false)
    setSpotClicked(null)
    setSpotDone(false)
    setShakeIdx(null)
    setPuzzleHandled(false)
    setPuzzleIsCorrect(false)
    setPrevPhase(quizPhase)
  }, [question?.id])

  // ---- Feedback flash detection ----
  useEffect(() => {
    if (quizPhase === "revealed" && prevPhase !== "revealed") {
      const correct = isCorrect
      if (correct) {
        setShowCorrectFlash(true)
        setTimeout(() => setShowCorrectFlash(false), 1200)
      } else {
        setShowWrongFlash(true)
        setTimeout(() => setShowWrongFlash(false), 600)
      }
    }
    setPrevPhase(quizPhase)
  }, [quizPhase, isCorrect, prevPhase])

  // ---- Timeout Handler ----
  const handleTimeout = useCallback(() => {
    if (!question) return
    switch (question.questionType) {
      case "choice":
      case "dilemma": {
        const idx = question.correctIndex ?? 0
        setSelectedOption(idx)
        selectOption(idx)
        break
      }
      case "fillBlank": {
        setFillSubmitted(true)
        setQuizPhase("revealed")
        break
      }
      case "spotMistake": {
        setSpotDone(true)
        setQuizPhase("revealed")
        break
      }
      case "puzzle": {
        setPuzzleHandled(true)
        setPuzzleIsCorrect(false)
        setQuizPhase("revealed")
        break
      }
      case "relay": {
        const r = question.rounds?.[currentRound]
        if (r) {
          const bestIdx = r.options.reduce((best, opt, i) =>
            opt.score > r.options[best].score ? i : best, 0)
          selectRelayOption(bestIdx)
        }
        break
      }
    }
  }, [question, currentRound, setSelectedOption, selectOption, setQuizPhase, selectRelayOption])

  // ---- Timer Effect ----
  useEffect(() => {
    if (!question || !settings.enableTimer) return
    if (quizPhase !== "selecting") {
      setTimerActive(false)
      setTimeLeft(5)
      return
    }

    setTimeLeft(5)
    setTimerActive(true)
    const interval = setInterval(() => {
      const st = useQuizStore.getState()
      if (st.quizPhase !== "selecting") {
        clearInterval(interval)
        return
      }
      const t = st.timeLeft
      if (t <= 1) {
        clearInterval(interval)
        st.setTimeLeft(0)
        st.setTimerActive(false)
        handleTimeout()
        return
      }
      st.setTimeLeft(t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [quizPhase, question?.id, settings.enableTimer, handleTimeout])

  // ---- Handlers ----

  const handleStart = useCallback(() => {
    startQuiz()
  }, [startQuiz])

  const handleChoiceSelect = useCallback((idx: number) => {
    if (quizPhase === "revealed") return
    setSelectedOption(idx)
    selectOption(idx)
  }, [quizPhase, setSelectedOption, selectOption])

  const handleFillSubmit = useCallback(() => {
    if (fillSubmitted) return
    setFillSubmitted(true)
    setQuizPhase("revealed")
  }, [fillSubmitted, setQuizPhase])

  const handleRelaySelect = useCallback((idx: number) => {
    if (quizPhase === "revealed") return
    selectRelayOption(idx)
  }, [quizPhase, selectRelayOption])

  const handleDilemmaSelect = useCallback((idx: number) => {
    if (quizPhase === "revealed") return
    setSelectedOption(idx)
    selectOption(idx)
  }, [quizPhase, setSelectedOption, selectOption])

  const handleSpotClick = useCallback((lineIdx: number) => {
    if (spotDone || quizPhase === "revealed") return
    if (lineIdx === question?.mistakeIndex) {
      setSpotClicked(lineIdx)
      setSpotDone(true)
      setQuizPhase("revealed")
      setSelectedOption(lineIdx)
    } else {
      setShakeIdx(lineIdx)
      setTimeout(() => setShakeIdx(null), 500)
    }
  }, [spotDone, quizPhase, question, setQuizPhase, setSelectedOption])

  const handlePuzzleTap = useCallback((fragment: string) => {
    if (puzzleHandled) return
    setPuzzleOrder([...puzzleOrder, fragment])
  }, [puzzleHandled, puzzleOrder, setPuzzleOrder])

  const handlePuzzleRemove = useCallback((idx: number) => {
    if (puzzleHandled) return
    const next = puzzleOrder.filter((_, i) => i !== idx)
    setPuzzleOrder(next)
  }, [puzzleHandled, puzzleOrder, setPuzzleOrder])

  const handlePuzzleConfirm = useCallback(() => {
    if (puzzleHandled || puzzleOrder.length === 0) return
    setPuzzleHandled(true)

    const correctOrder = question?.correctOrder ?? []
    const isPuzzleCorrect = puzzleOrder.length === correctOrder.length &&
      puzzleOrder.every((f, i) => f === correctOrder[i])
    setPuzzleIsCorrect(isPuzzleCorrect)
    setSelectedOption(isPuzzleCorrect ? 0 : -1)
    setQuizPhase("revealed")
  }, [puzzleHandled, puzzleOrder, question, setQuizPhase, setSelectedOption])

  const handleCopy = useCallback(() => {
    if (!question) return
    let text = ""
    if (question.bestAnswer) {
      text = question.bestAnswer
    } else if (question.fullSentence) {
      text = question.fullSentence
    } else if (question.bestAnswers && question.bestAnswers.length > 0) {
      text = question.bestAnswers[0].answer
    } else if (question.blankAnswer) {
      text = question.blankAnswer
    }
    if (text) {
      Taro.setClipboardData({ data: text }).then(() => {
        Taro.showToast({ title: "已复制到剪贴板", icon: "success", duration: 1500 })
      })
    }
  }, [question])

  const handleFavorite = useCallback(() => {
    if (!question) return
    toggleFavorite(question.id)
  }, [question, toggleFavorite])

  const handleNext = useCallback(() => {
    if (onNext) {
      onNext()
    } else {
      nextQuestion()
    }
  }, [onNext, nextQuestion])

  // ---- Puzzle available fragments ----
  const availableFragments = useMemo(() => {
    if (!puzzleFragments.length) return []
    return puzzleFragments.filter(f => !puzzleOrder.includes(f))
  }, [puzzleFragments, puzzleOrder])

  // ---- Render helpers ----

  const renderScene = () => {
    if (!question) return null
    return (
      <View className="qe-scene">
        {question.sceneFull.split("\n").map((line, i) => (
          <Text key={i} className="block text-base text-gray-900 leading-relaxed">
            {line === "" ? "\n" : line}
          </Text>
        ))}
      </View>
    )
  }

  const renderInnerVoice = () => {
    if (!question?.innerVoice) return null
    return (
      <View className="qe-inner-voice">
        <Text className="qe-inner-voice-text">{question.innerVoice}</Text>
      </View>
    )
  }

  const renderTimerBar = () => {
    if (!settings.enableTimer || quizPhase !== "selecting" || !timerActive) return null
    const pct = Math.max(0, (timeLeft / 5) * 100)
    const isUrgent = timeLeft <= 2
    return (
      <View className="qe-timer-wrap">
        <View className="qe-timer-bar">
          <View
            className={`qe-timer-fill ${isUrgent ? "qe-timer-urgent" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </View>
        <Text className={`qe-timer-text ${isUrgent ? "qe-timer-urgent" : ""}`}>
          {timeLeft}s
        </Text>
      </View>
    )
  }

  const renderFeedback = () => {
    if (quizPhase !== "revealed") return null

    const correct = isCorrect

    return (
      <View className="qe-reveal-area qe-fade-in">
        {/* Feedback Banner */}
        <View className={`qe-feedback ${correct ? "qe-feedback-correct" : "qe-feedback-wrong"}`}>
          <Text className="block">
            {correct ? "🎉 答对了！+1能量" : "💀 社死！"}
          </Text>
        </View>

        {/* Response Text (for wrong answers in choice/dilemma) */}
        {!correct && question?.response && (
          <View className="qe-response-text">
            <Text className="block text-sm text-gray-500">{question.response}</Text>
          </View>
        )}

        {/* Technique Badge */}
        {question?.technique && (
          <View className="qe-tech-badge">
            <Text className="block text-xs font-medium" style={{ color: "#2E7D32" }}>
              💡 {question.technique}
            </Text>
          </View>
        )}

        {/* Tips */}
        {question?.tips && (
          <View className="qe-tips-box">
            <Text className="block text-xs font-semibold mb-2" style={{ color: "#F57C00" }}>📝 解析</Text>
            <Text className="block text-xs text-gray-600 leading-relaxed">{question.tips}</Text>
          </View>
        )}

        {/* Cheatsheet */}
        {question?.cheatsheet && (
          <View className="qe-cheatsheet-box">
            <Text className="block text-xs font-semibold mb-2" style={{ color: "#6366F1" }}>📖 小抄</Text>
            <View className="qe-cheatsheet-rule">
              <Text className="block">{question.cheatsheet.oneLineRule}</Text>
            </View>
            <View className="qe-cheatsheet-remember">
              <Text className="block">{question.cheatsheet.rememberThis}</Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="qe-actions">
          <View className="qe-btn-copy" onClick={handleCopy}>
            <Text className="block text-sm font-semibold text-center">📋 复制话术</Text>
          </View>
          <View
            className={`qe-btn-fav ${isFavorite ? "qe-btn-fav-active" : ""}`}
            onClick={handleFavorite}
          >
            <Text className="block text-sm font-semibold">
              {isFavorite ? "❤️ 已收藏" : "🤍 收藏"}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const renderNextButton = () => {
    if (quizPhase !== "revealed") return null
    return (
      <View className="qe-btn-next" onClick={handleNext}>
        <Text className="block text-base font-semibold text-center">下一题 →</Text>
      </View>
    )
  }

  // ===== TYPE 1: Choice =====
  const renderChoice = () => {
    if (!question || !question.options) return null
    return (
      <View className="qe-choice-opts">
        {question.options.map((opt, idx) => {
          let cls = "qe-opt"
          let letterCls = "qe-letter"

          if (quizPhase === "revealed") {
            cls += " qe-opt-locked"
            const correct = idx === question.correctIndex
            const wrong = idx === selectedOption && idx !== question.correctIndex
            if (correct) {
              cls += " qe-opt-correct"
              letterCls += " qe-letter-correct"
            }
            if (wrong) {
              cls += " qe-opt-wrong"
              letterCls += " qe-letter-wrong"
            }
          }

          return (
            <View
              key={idx}
              className={cls}
              onClick={() => handleChoiceSelect(idx)}
            >
              <View className={letterCls}>
                <Text className="block text-xs font-bold">{opt.letter}</Text>
              </View>
              <Text className="block flex-1 text-sm text-gray-800 leading-relaxed">{opt.text}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  const renderBestAnswers = () => {
    if (quizPhase !== "revealed" || !question) return null

    // If has bestAnswers array, show as style tabs
    if (question.bestAnswers && question.bestAnswers.length > 0) {
      return (
        <View className="qe-best-answers qe-fade-in">
          {question.bestAnswers.map((ba, idx) => (
            <View key={idx} className="qe-best-answer-tab">
              <View className="qe-best-answer-tab-header">
                <Text className="qe-best-answer-style">{ba.styleEmoji} {ba.style}</Text>
                <Text className="qe-best-answer-score">得分 {ba.score}</Text>
              </View>
              <Text className="qe-best-answer-text">{ba.answer}</Text>
            </View>
          ))}
        </View>
      )
    }

    // Fallback: single bestAnswer
    if (question.bestAnswer) {
      return (
        <View className="qe-best-answer-single qe-fade-in">
          <Text className="block text-xs font-semibold mb-2" style={{ color: "#34C759" }}>✅ 最佳回答</Text>
          <Text className="block text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>
            {question.bestAnswer}
          </Text>
        </View>
      )
    }

    return null
  }

  // ===== TYPE 2: Fill Blank =====
  const renderFillBlank = () => {
    if (!question) return null

    return (
      <View>
        {/* Blank line indicator */}
        <View className="qe-fill-blank-line">
          <Text className="block text-sm text-gray-700">
            请填入你的回应：
            <Text className="qe-fill-blank-marker">___________</Text>
          </Text>
        </View>

        {/* Input area (before submit) */}
        {!fillSubmitted && quizPhase !== "revealed" && (
          <View className="qe-fill-input-area">
            <Textarea
              className="qe-textarea"
              placeholder="在这里输入你的回答..."
              value={fillInput}
              onInput={(e: any) => setFillInput(e.detail.value)}
              maxlength={200}
              autoHeight
            />
            <View className="qe-fill-submit" onClick={handleFillSubmit}>
              <Text className="block text-base font-semibold text-white text-center">提交答案</Text>
            </View>
          </View>
        )}

        {/* Result (after submit) */}
        {(fillSubmitted || quizPhase === "revealed") && (
          <View className="qe-fill-result qe-fade-in">
            {/* Reference answer */}
            {question.blankAnswer && (
              <View className="qe-fill-ref">
                <Text className="qe-fill-ref-label">📝 参考回答</Text>
                <Text className="qe-fill-ref-text">{question.blankAnswer}</Text>
              </View>
            )}

            {/* User's answer */}
            {fillInput && (
              <View className="qe-fill-ref" style={{ background: "#F8F9FF", borderColor: "rgba(99, 102, 241, 0.2)" }}>
                <Text className="qe-fill-ref-label" style={{ color: "#6366F1" }}>💬 你的回答</Text>
                <Text className="block text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{fillInput}</Text>
              </View>
            )}

            {/* Match bar (just for fun, comparing lengths) */}
            <View className="qe-fill-match-wrap">
              <Text className="block text-xs font-semibold" style={{ color: "#F57C00" }}>
                📊 匹配度（娱乐向）
              </Text>
              {fillInput && question.blankAnswer ? (
                <View>
                  <View className="qe-fill-match-bar">
                    <View
                      className="qe-fill-match-fill"
                      style={{
                        width: `${Math.min(100, Math.max(10, Math.round(
                          (1 - Math.abs(fillInput.length - question.blankAnswer.length) /
                            Math.max(fillInput.length, question.blankAnswer.length, 1)) * 100
                        )))}%`,
                        background: "linear-gradient(90deg, #FF6B6B, #FFD700, #34C759)",
                      }}
                    />
                  </View>
                  <Text className="block text-xs text-gray-500 text-center mt-2">
                    你的回复 {fillInput.length} 字 vs 参考 {question.blankAnswer.length} 字
                  </Text>
                </View>
              ) : (
                <Text className="block text-xs text-gray-400 mt-2">
                  {fillInput ? "参考回答加载中..." : "请输入你的回答"}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    )
  }

  // ===== TYPE 3: Relay =====
  const renderRelay = () => {
    if (!question || !question.rounds) return null

    const totalRounds = question.rounds.length
    const currentR = Math.min(currentRound, totalRounds - 1)
    const round = question.rounds[currentR]
    const isFinished = quizPhase === "revealed"

    return (
      <View className="qe-relay-rounds">
        {/* Round Indicators */}
        <View className="qe-relay-indicator">
          <Text className="block text-xs text-gray-500 mr-2">
            第 {isFinished ? totalRounds : currentR + 1}/{totalRounds} 轮
          </Text>
          {question.rounds.map((_, i) => {
            let dotCls = "qe-relay-dot"
            if (i < currentRound || isFinished) dotCls += " qe-relay-dot-done"
            else if (i === currentRound && !isFinished) dotCls += " qe-relay-dot-active"
            return <View key={i} className={dotCls} />
          })}
        </View>

        {/* Show all completed rounds + current round */}
        {!isFinished && round && (
          <View>
            {/* Current Dialog */}
            <View className="qe-relay-dialog">
              <Text className="qe-relay-dialog-label">对方说：</Text>
              <Text className="qe-relay-dialog-text">{round.dialog}</Text>
            </View>

            {/* Options */}
            <View className="qe-relay-opts">
              {round.options.map((opt, idx) => (
                <View
                  key={idx}
                  className={`qe-relay-opt ${selectedDialogs.includes(idx) && currentRound === currentR + 1 ? "qe-relay-opt-selected" : ""}`}
                  onClick={() => handleRelaySelect(idx)}
                >
                  <Text className="block text-sm text-gray-800 leading-relaxed">{opt.text}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Finished: show score summary */}
        {isFinished && (
          <View className="qe-fade-in">
            {/* Per-round scores */}
            <View className="qe-relay-round-scores">
              {roundResults.map((score, i) => {
                let scoreCls = "qe-relay-round-score"
                if (score >= 80) scoreCls += " qe-relay-round-score-high"
                else if (score >= 50) scoreCls += " qe-relay-round-score-mid"
                else scoreCls += " qe-relay-round-score-low"
                return (
                  <View key={i} className={scoreCls}>
                    <Text className="block text-xs font-bold">{score}</Text>
                  </View>
                )
              })}
            </View>

            {/* Total Score */}
            <View className="qe-relay-score">
              <Text className="block text-sm text-gray-500">综合得分：</Text>
              <Text
                className="qe-relay-score-badge"
                style={{
                  color: (selectedOption ?? 0) >= 80 ? "#34C759" :
                         (selectedOption ?? 0) >= 50 ? "#FFC107" : "#FF3B30"
                }}
              >
                {selectedOption ?? 0}分
              </Text>
            </View>

            {/* Feedback text */}
            <View className="qe-relay-score">
              <Text className="qe-relay-score-detail">
                {(selectedOption ?? 0) >= 80
                  ? "🌟 表现优秀！你的社交力很强"
                  : (selectedOption ?? 0) >= 50
                  ? "👍 还算过得去，还有提升空间"
                  : "😅 需要多多练习哦"}
              </Text>
            </View>
          </View>
        )}
      </View>
    )
  }

  // ===== TYPE 4: Dilemma =====
  const renderDilemma = () => {
    if (!question || !question.options) return null

    return (
      <View>
        <View className="qe-dilemma-opts">
          {question.options.map((opt, idx) => {
            let cls = "qe-dilemma-opt"
            if (quizPhase === "revealed") cls += " qe-opt-locked"
            if (quizPhase === "revealed" && idx === question.correctIndex) cls += " qe-opt-correct"
            if (quizPhase === "revealed" && idx === selectedOption && idx !== question.correctIndex) cls += " qe-opt-wrong"

            const deadInfo = question.optionScores?.[idx]
            const deadLevel = deadInfo?.deadLevel ?? ""
            const dice = getDeadDice(deadLevel)

            return (
              <View
                key={idx}
                className={cls}
                onClick={() => handleDilemmaSelect(idx)}
              >
                <View className={quizPhase === "revealed" && idx === question.correctIndex ? "qe-letter qe-letter-correct" : quizPhase === "revealed" && idx === selectedOption && idx !== question.correctIndex ? "qe-letter qe-letter-wrong" : "qe-letter"}>
                  <Text className="block text-xs font-bold">{opt.letter}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="block text-sm text-gray-800 leading-relaxed mb-2">{opt.text}</Text>
                  {deadLevel && (
                    <View className="qe-dilemma-dead-badge">
                      <Text className="block text-xs">{dice} {deadLevel}</Text>
                    </View>
                  )}
                </View>
              </View>
            )
          })}
        </View>

        {/* Dilemma Explanation */}
        {quizPhase === "revealed" && question.dilemmaExplanation && (
          <View className="qe-dilemma-explain qe-fade-in">
            <Text className="qe-dilemma-result-label" style={{ color: "#FF6B6B" }}>
              {selectedOption === question.correctIndex ? "✅ 选对了！" : "😅 不太妙..."}
            </Text>
            <Text className="block text-sm leading-relaxed" style={{ color: "#333" }}>
              {question.dilemmaExplanation}
            </Text>
          </View>
        )}
      </View>
    )
  }

  // ===== TYPE 5: Spot Mistake =====
  const renderSpotMistake = () => {
    if (!question || !question.dialog) return null

    return (
      <View>
        <View className="qe-spot-dialogs">
          {question.dialog.map((line, idx) => {
            const isOther = line.role === "colleague" || line.role === "partner" || line.role === "other"
            const isMe = line.role === "me"
            const isMistake = spotDone && idx === question.mistakeIndex
            const isCorrectClick = spotClicked === idx && idx === question.mistakeIndex
            const isShaking = shakeIdx === idx

            let lineCls = "qe-spot-line"
            if (isOther) lineCls += " qe-spot-line-other"
            if (isMe) lineCls += " qe-spot-line-me"
            if (isMistake || isCorrectClick) lineCls += " qe-spot-line-mistake"
            if (isShaking) lineCls += " qe-spot-line-shake"

            return (
              <View
                key={idx}
                className={lineCls}
                onClick={() => handleSpotClick(idx)}
              >
                {/* Role tag */}
                <View>
                  <Text className={`qe-spot-role-tag ${isOther ? "qe-spot-role-other" : "qe-spot-role-me"}`}>
                    {isOther ? "💬 对方" : "🗣️ 我"}
                  </Text>
                </View>
                <Text className="block text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>{line.text}</Text>
                {(isMistake || isCorrectClick) && (
                  <Text className="block text-xs mt-2" style={{ color: "#FF3B30", fontWeight: 600 }}>
                    ❌ 就是这句！
                  </Text>
                )}
              </View>
            )
          })}
        </View>

        {/* Explanation */}
        {quizPhase === "revealed" && question.explanation && (
          <View className="qe-spot-explain qe-fade-in">
            <Text className="block text-xs font-semibold mb-2" style={{ color: "#FF3B30" }}>
              🔍 问题解析
            </Text>
            <Text className="block text-sm leading-relaxed" style={{ color: "#1a1a1a" }}>
              {question.explanation}
            </Text>
          </View>
        )}
      </View>
    )
  }

  // ===== TYPE 6: Puzzle =====
  const renderPuzzle = () => {
    if (!question || !question.correctOrder) return null

    return (
      <View className="qe-puzzle-area">
        {/* Sentence building area */}
        <View className="qe-puzzle-sentence">
          {puzzleOrder.length === 0 ? (
            <View className="qe-puzzle-sentence-empty">
              <Text className="block text-sm">👆 点击下方碎片按正确顺序排列</Text>
            </View>
          ) : (
            puzzleOrder.map((fragment, idx) => (
              <View
                key={`placed-${idx}`}
                className="qe-puzzle-chip-placed"
                onClick={() => handlePuzzleRemove(idx)}
              >
                <Text className="block text-sm">{fragment}</Text>
              </View>
            ))
          )}
        </View>

        {/* Available fragments pool */}
        {!puzzleHandled && (
          <View className="qe-puzzle-pool">
            {availableFragments.length === 0 && puzzleOrder.length < (question.correctOrder?.length ?? 0) ? null : (
              availableFragments.map((fragment, idx) => (
                <View
                  key={`avail-${idx}`}
                  className="qe-puzzle-chip"
                  onClick={() => handlePuzzleTap(fragment)}
                >
                  <Text className="block text-sm">{fragment}</Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* Confirm button */}
        {!puzzleHandled && puzzleOrder.length > 0 && (
          <View className="qe-puzzle-confirm" onClick={handlePuzzleConfirm}>
            <Text className="block text-base font-semibold text-white text-center">
              ✅ 确认提交 ({puzzleOrder.length}/{question.correctOrder?.length ?? 0})
            </Text>
          </View>
        )}

        {/* Result */}
        {puzzleHandled && quizPhase === "revealed" && (
          <View className="qe-puzzle-result qe-fade-in">
            <View className={`qe-puzzle-correct-order ${selectedOption !== 0 ? "qe-puzzle-wrong" : ""}`}>
              <Text className="block text-xs font-semibold mb-2" style={{ color: selectedOption === 0 ? "#34C759" : "#FF3B30" }}>
                {selectedOption === 0 ? "✅ 拼对了！" : "❌ 正确的顺序是："}
              </Text>
              <View style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                {question.correctOrder?.map((fragment, idx) => {
                  const userMatch = puzzleOrder[idx]
                  const isMatch = userMatch === fragment
                  return (
                    <Text
                      key={idx}
                      className="block text-sm"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "16px",
                        background: isMatch ? "rgba(52, 199, 89, 0.15)" : "rgba(255, 59, 48, 0.1)",
                        color: isMatch ? "#34C759" : "#FF3B30",
                        fontWeight: 500,
                        border: `1.5px solid ${isMatch ? "rgba(52, 199, 89, 0.3)" : "rgba(255, 59, 48, 0.2)"}`
                      }}
                    >
                      {idx + 1}. {fragment}
                    </Text>
                  )
                })}
              </View>
            </View>
            {question.fullSentence && (
              <View className="qe-puzzle-correct-order">
                <Text className="block text-xs font-semibold mb-1" style={{ color: "#6366F1" }}>📖 完整话术</Text>
                <Text className="qe-puzzle-full-sentence">{question.fullSentence}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    )
  }

  // ===== Guard: No question =====
  if (!question) {
    return (
      <View className="qe-container">
        <View className="qe-placeholder">
          <Text className="block text-sm">暂无题目</Text>
        </View>
      </View>
    )
  }

  // ===== MAIN RENDER =====

  const showSceneOnly = quizPhase === "scene"

  return (
    <View className="qe-container">
      {/* Feedback overlay animations */}
      {showCorrectFlash && (
        <View>
          <View className="qe-overlay-flash" style={{ boxShadow: "0 0 60px 20px rgba(255, 215, 0, 0.08)" }} />
          <View className="qe-confetti-container">
            {Array.from({ length: 10 }).map((_, i) => (
              <View key={i} className="qe-confetti-dot" />
            ))}
          </View>
        </View>
      )}
      {showWrongFlash && (
        <View className="qe-overlay-flash-wrong" />
      )}

      {/* Type Badge */}
      {!showSceneOnly && typeBadge.label && (
        <View className={`qe-type-badge ${typeBadge.cls}`}>
          <Text className="block text-xs font-semibold">{typeBadge.label}</Text>
        </View>
      )}

      {/* Scene Description */}
      {renderScene()}

      {/* Inner Voice */}
      {renderInnerVoice()}

      {/* Timer Bar */}
      {renderTimerBar()}

      {/* ---- PHASE: SCENE (Start button) ---- */}
      {showSceneOnly && (
        <View>
          <View className="qe-start-hint">
            <Text className="block text-xs text-center" style={{ color: "#ccc" }}>👇 准备好了就开始答题吧</Text>
          </View>
          <View className="qe-start-btn" onClick={handleStart}>
            <Text className="block text-base font-bold text-white text-center">🎯 开始答题</Text>
          </View>
        </View>
      )}

      {/* ---- PHASE: SELECTING / REVEALED - Type-specific content ---- */}
      {!showSceneOnly && (
        <View>
          {question.questionType === "choice" && renderChoice()}
          {question.questionType === "fillBlank" && renderFillBlank()}
          {question.questionType === "relay" && renderRelay()}
          {question.questionType === "dilemma" && renderDilemma()}
          {question.questionType === "spotMistake" && renderSpotMistake()}
          {question.questionType === "puzzle" && renderPuzzle()}
        </View>
      )}

      {/* Best Answers (only for choice type since other types have their own result displays) */}
      {quizPhase === "revealed" && question.questionType === "choice" && renderBestAnswers()}

      {/* Feedback + Tips + Cheatsheet + Actions */}
      {renderFeedback()}

      {/* Next Button */}
      {renderNextButton()}
    </View>
  )
}
