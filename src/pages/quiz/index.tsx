import { View, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useState, useEffect } from "react"
import { useQuizStore } from "@/store/quiz-store"
import "./index.css"

export default function Quiz() {
  const [questionId, setQuestionId] = useState(0)
  const [selectedOption, setSelectedOption] = useState(-1)
  const [showResult, setShowResult] = useState(false)

  const { questions, toggleFavorite, answerQuestion, favorites } = useQuizStore()

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    if (params?.id) {
      setQuestionId(Number(params.id))
    }
  }, [])

  const question = questions.find((q) => q.id === questionId) || questions[0]
  const isCorrect = selectedOption === question?.correctIndex

  const handleSelect = (index: number) => {
    if (showResult) return
    setSelectedOption(index)
    setShowResult(true)
    if (question) {
      answerQuestion(question.id, isCorrect)
    }
  }

  const handleNext = () => {
    const nextQuestion = questions.find((q) => q.id > questionId)
    if (nextQuestion) {
      setQuestionId(nextQuestion.id)
      setSelectedOption(-1)
      setShowResult(false)
    } else {
      Taro.navigateTo({ url: "/pages/result/index" })
    }
  }

  const handleFinish = () => {
    Taro.navigateTo({ url: "/pages/result/index" })
  }

  if (!question) return <View />

  return (
    <View className="page-container">
      {/* Quiz Header */}
      <View className="quiz-header">
        <View className="back-btn" onClick={() => Taro.navigateBack()}>
          <Text className="text-lg text-white">←</Text>
        </View>
        <Text className="block text-sm font-medium text-white">
          第{questions.indexOf(question) + 1}/{questions.length}题
        </Text>
        <View
          className="fav-btn"
          onClick={() => toggleFavorite(question.id)}
        >
          <Text className="block text-lg">
            {favorites.includes(question.id) ? "❤️" : "🤍"}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="progress-bar-bg">
        <View
          className="progress-bar-fill"
          style={{ width: `${((questions.indexOf(question) + 1) / questions.length) * 100}%` }}
        />
      </View>

      {/* Scenario */}
      <View className="scenario-card">
        <Text className="block text-xs text-primary font-semibold mb-2">💡 场景</Text>
        <Text className="block text-base text-gray-900 leading-relaxed">
          {question.scene}
        </Text>
      </View>

      {/* Options */}
      <View className="options-list">
        {question.options.map((option, index) => {
          let optionClass = "option-item"
          if (showResult) {
            if (index === question.correctIndex) {
              optionClass += " correct"
            } else if (index === selectedOption && !isCorrect) {
              optionClass += " wrong"
            }
          } else if (index === selectedOption) {
            optionClass += " selected"
          }

          return (
            <View
              key={index}
              className={optionClass}
              onClick={() => handleSelect(index)}
            >
              <View className="option-label">
                <Text className="block text-xs font-bold text-white">{option.letter}</Text>
              </View>
              <Text className="block flex-1 text-sm text-gray-900 leading-relaxed">{option.text}</Text>
              {showResult && index === question.correctIndex && (
                <Text className="block text-sm">✅</Text>
              )}
              {showResult && index === selectedOption && !isCorrect && index !== question.correctIndex && (
                <Text className="block text-sm">❌</Text>
              )}
            </View>
          )
        })}
      </View>

      {/* Explanation */}
      {showResult && (
        <View className="explanation-card">
          <Text className="block text-xs font-semibold text-primary mb-2">💡 解析</Text>
          <Text className="block text-sm text-gray-700 leading-relaxed">
            {question.analysis}
          </Text>
        </View>
      )}

      {/* Bottom Buttons */}
      {showResult && (
        <View className="quiz-bottom">
          <View className="quiz-btn-secondary" onClick={handleFinish}>
            <Text className="block text-sm font-semibold text-gray-700">完成</Text>
          </View>
          <View className="quiz-btn-primary" onClick={handleNext}>
            <Text className="block text-sm font-semibold text-white">下一题 →</Text>
          </View>
        </View>
      )}
    </View>
  )
}
