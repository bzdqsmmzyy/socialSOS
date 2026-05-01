import { create } from 'zustand'
import Taro from '@tarojs/taro'

// ==================== TYPES ====================

export interface Character {
  id: string
  name: string
  emoji: string
  desc: string
}

export interface Rank {
  id: string
  name: string
  icon: string
  color: string
  minScore: number
}

export interface BestAnswer {
  answer: string
  style: string
  styleEmoji: string
  score: number
}

export interface RelayRound {
  dialog: string
  options: { text: string; nextRoundIndex: number; score: number }[]
}

export interface DialogLine {
  role: string
  text: string
}

export interface Cheatsheet {
  oneLineRule: string
  rememberThis: string
}

export interface QuizOption {
  letter: string
  text: string
}

export type QuestionType = 'choice' | 'fillBlank' | 'relay' | 'dilemma' | 'spotMistake' | 'puzzle'

export interface QuizQuestion {
  id: number
  questionType: QuestionType
  categoryId: number
  categoryName: string
  categoryTag: string
  difficulty: number
  scene: string
  sceneFull: string
  innerVoice?: string
  technique: string
  tips: string
  isHot?: boolean
  isNew?: boolean
  isDailyChallenge?: boolean
  seriesId?: string | null
  episodeIndex?: number | null

  // choice
  options?: QuizOption[]
  correctIndex?: number
  response?: string
  bestAnswer?: string
  bestAnswers?: BestAnswer[]
  cheatsheet?: Cheatsheet

  // fillBlank
  blankAnswer?: string

  // relay
  rounds?: RelayRound[]

  // dilemma
  dilemmaExplanation?: string
  optionScores?: { text: string; deadLevel: string }[]

  // spotMistake
  dialog?: DialogLine[]
  mistakeIndex?: number
  explanation?: string

  // puzzle
  correctOrder?: string[]
  fullSentence?: string
}

export interface Category {
  id: number
  name: string
  emoji: string
  tag: string
  count: number
  description: string
}

export interface UserStats {
  practiced: number
  streak: number
  accuracy: number
  favorites: number
}

export interface SeriesInfo {
  id: string
  name: string
  desc: string
  episodes: string[]
}

export interface QuizResult {
  type: string
  desc: string
  score: number
}

export interface SeriesProgress {
  [seriesId: string]: number
}

export interface UserSettings {
  enableTimer: boolean
  enableSound: boolean
  enableAnimation: boolean
}

export interface QuizState {
  // Character
  character: string | null
  characters: Character[]

  // Rank
  rank: string
  totalXP: number
  rankProgress: number

  // Questions & Categories
  categories: Category[]
  questions: QuizQuestion[]

  // Quiz flow
  currentQuestionIndex: number
  currentCategoryFilter: number | null
  quizPhase: 'scene' | 'selecting' | 'revealed'
  selectedOption: number | null
  selectedDialogs: number[]

  // Relay state
  currentRound: number
  roundResults: number[]

  // Puzzle state
  puzzleOrder: string[]

  // User stats
  userStats: UserStats
  answeredQuestions: Record<number, boolean>
  correctCount: number

  // Favorites
  favorites: number[]

  // Series
  seriesList: SeriesInfo[]
  seriesProgress: SeriesProgress

  // Daily
  dailyFreeCount: number
  dailyFreeDate: string
  lastPracticeDate: string
  streakDays: number

  // Payment
  showPaymentModal: boolean
  isPaid: boolean

  // Social Quiz
  quizResult: QuizResult | null
  preferredStyle: string

  // Settings
  settings: UserSettings

  // Timer
  timeLeft: number
  timerActive: boolean

  // ===== Actions =====
  setCharacter: (id: string) => void
  setCurrentQuestionIndex: (index: number) => void
  setCurrentCategoryFilter: (categoryId: number | null) => void
  setQuizPhase: (phase: 'scene' | 'selecting' | 'revealed') => void
  setSelectedOption: (option: number | null) => void
  selectOption: (optionIndex: number) => void
  nextQuestion: () => void
  startQuiz: () => void
  getFilteredQuestions: () => QuizQuestion[]
  getDailyChallenge: () => QuizQuestion | null
  getCategoryQuestions: (categoryId: number) => QuizQuestion[]
  canAnswer: () => boolean
  getRemainingFreeCount: () => number

  // Favorites
  toggleFavorite: (questionId: number) => void
  getFavoritesList: () => QuizQuestion[]

  // Series
  getSeriesQuestions: (seriesId: string) => QuizQuestion[]
  updateSeriesProgress: (seriesId: string, episodeIndex: number) => void

  // Social Quiz
  setQuizResult: (result: QuizResult) => void
  setPreferredStyle: (style: string) => void

  // Settings
  updateSettings: (s: Partial<UserSettings>) => void

  // Payment
  setShowPaymentModal: (show: boolean) => void
  setIsPaid: (paid: boolean) => void

  // Timer
  setTimeLeft: (t: number) => void
  setTimerActive: (a: boolean) => void

  // Puzzle
  setPuzzleOrder: (order: string[]) => void

  // Relay
  setCurrentRound: (r: number) => void
  setRoundResults: (r: number[]) => void
  selectRelayOption: (optionIndex: number) => void

  // Cheatsheet
  getCheatsheets: () => { categoryTag: string; question: QuizQuestion; cheatsheet: Cheatsheet }[]
}

// ==================== CONSTANTS ====================

export const CHARACTERS: Character[] = [
  { id: 'work-ghost', name: '职场小透明', emoji: '🫥', desc: '开会永远坐在角落，巴不得领导忘记自己的名字' },
  { id: 'party-ninja', name: '聚会隐形人', emoji: '🥷', desc: '聚会存活技巧：靠墙+玩手机+等朋友来救' },
  { id: 'love-mute', name: '恋爱哑巴', emoji: '💬', desc: '暗恋三年没开口，内心演完了整部韩剧' },
  { id: 'campus-wallflower', name: '校园壁花', emoji: '🏫', desc: '自我介绍能卡3分钟，小组讨论永远说"我都行"' }
]

export const RANKS: Rank[] = [
  { id: 'bronze', name: '青铜i人', icon: '🥉', color: '#CD7F32', minScore: 0 },
  { id: 'silver', name: '白银i人', icon: '🥈', color: '#C0C0C0', minScore: 20 },
  { id: 'gold', name: '黄金社交者', icon: '🥇', color: '#FFD700', minScore: 40 },
  { id: 'diamond', name: '钻石社牛', icon: '💎', color: '#B9F2FF', minScore: 65 },
  { id: 'king', name: '王者社牛', icon: '👑', color: '#FF6B6B', minScore: 85 }
]

export const CATEGORIES: Category[] = [
  { id: 0, name: '推荐', emoji: '🔥', tag: '🔥 推荐', count: 0, description: '精选推荐' },
  { id: 1, name: '职场生存', emoji: '🏢', tag: '🏢 职场生存', count: 50, description: '被领导批评、开会发言、同事甩锅…' },
  { id: 2, name: '社交聚会', emoji: '🎉', tag: '🎉 社交聚会', count: 40, description: '聚会插不上话、敬酒、被问隐私…' },
  { id: 3, name: '恋爱沟通', emoji: '💕', tag: '💕 恋爱沟通', count: 30, description: '暗恋开口、表白、吵架处理…' },
  { id: 4, name: '校园生活', emoji: '🎓', tag: '🎓 校园生活', count: 30, description: '自我介绍、小组作业、被点名…' },
  { id: 5, name: '日常人际', emoji: '🛒', tag: '🛒 日常人际', count: 30, description: '被夸、拒绝、沟通技巧…' },
  { id: 6, name: '亲戚应酬', emoji: '🧧', tag: '🧧 亲戚应酬', count: 20, description: '过年被问、催婚、长辈劝酒…' },
  { id: 7, name: '随机挑战', emoji: '🎲', tag: '🎲 随机挑战', count: 0, description: '随机挑战' }
]

export const SERIES_LIST: SeriesInfo[] = [
  { id: 'work-life', name: '《职场生存记》', desc: '从小透明到能在年会讲脱口秀', episodes: ['wp-e01', 'wp-e02', 'wp-e03', 'wp-e04', 'wp-e05'] },
  { id: 'new-year', name: '《过年回乡历险记》', desc: '活着从亲戚包围圈逃出来', episodes: ['ny-e01', 'ny-e02', 'ny-e03', 'ny-e04', 'ny-e05'] },
  { id: 'party-king', name: '《聚会社交突围战》', desc: '从靠墙玩手机到C位聊全场', episodes: ['pt-e01', 'pt-e02', 'pt-e03', 'pt-e04', 'pt-e05'] },
  { id: 'love-class', name: '《恋爱沟通补习班》', desc: '从暗恋吃醋到好好说话', episodes: ['lv-e01', 'lv-e02', 'lv-e03', 'lv-e04', 'lv-e05'] },
  { id: 'campus-hero', name: '《校园逆袭计划》', desc: '从社恐新生到社团骨干', episodes: ['cp-e01', 'cp-e02', 'cp-e03', 'cp-e04', 'cp-e05'] },
  { id: 'daily-life', name: '《日常社交生存指南》', desc: '从不知道怎么说话到游刃有余', episodes: ['dl-e01', 'dl-e02', 'dl-e03', 'dl-e04', 'dl-e05'] }
]

// ==================== QUESTION BANK (V1.2 expanded) ====================
// Legacy choice questions + new question types

export const QUESTIONS: QuizQuestion[] = [
  // ===== CHOICE TYPE (三选一) - 40 questions =====
  {
    id: 1, questionType: 'choice', categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '聚会上有人问你"你怎么这么安静啊？"',
    sceneFull: '聚会上，有人当着大家的面问你：\n"你怎么这么安静啊？都不怎么说话。"\n所有人都在看你，空气突然安静了……',
    innerVoice: '（救命啊为什么要点我...）',
    options: [
      { letter: 'A', text: '嗯……我就是比较内向，不太会说话……（低头沉默）' },
      { letter: 'B', text: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～' },
      { letter: 'C', text: '是吗？可能是我们不熟吧，熟了你就知道我话多了（翻白眼）' }
    ],
    correctIndex: 1, difficulty: 2, isHot: true,
    response: '选B用"哈哈"化解尴尬，不否定自己还夸了大家。',
    bestAnswer: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～',
    bestAnswers: [
      { answer: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～', style: '稳妥型', styleEmoji: '🛡️', score: 90 },
      { answer: '我话少但句句精品，你们继续聊，我有想法会说的！', style: '主动型', styleEmoji: '🚀', score: 80 },
      { answer: '其实我在心里已经写了800字评论了，只是没打字而已', style: '高能型', styleEmoji: '⚡', score: 85 }
    ],
    technique: '用自嘲化解 + 先夸对方',
    tips: '把"我不够好"转化为"你们很好"，气氛瞬间就轻松了。',
    cheatsheet: { oneLineRule: '被cue安静时：自嘲+夸对方', rememberThis: '万能回答：\n1.「我在认真听你们聊呢」\n2.「你们太精彩了我插不上嘴」\n3.「我话少但句句精品」' }
  },
  {
    id: 2, questionType: 'choice', categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '同事当众开你的玩笑，大家都笑了',
    sceneFull: '同事当众开你的玩笑，大家都笑了，但你并不觉得好笑……',
    options: [
      { letter: 'A', text: '（强颜欢笑）哈哈是挺搞笑的……' },
      { letter: 'B', text: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）' },
      { letter: 'C', text: '你来一个试试？你自己被开玩笑开心吗？（生气）' }
    ],
    correctIndex: 1, difficulty: 2,
    response: '选B温柔但坚定地划清边界，既不委屈也不翻脸。',
    bestAnswer: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）',
    bestAnswers: [
      { answer: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）', style: '稳妥型', styleEmoji: '🛡️', score: 85 },
      { answer: '哈哈好笑吗？那我给你讲个更好笑的～（反客为主）', style: '主动型', styleEmoji: '🚀', score: 75 }
    ],
    technique: '温柔地划清边界', tips: '拒绝不必带有敌意，温柔也是一种力量。',
    cheatsheet: { oneLineRule: '被开玩笑时：温柔划界，不委屈不翻脸', rememberThis: '三步走：\n1.先肯定「× 跳过虚伪的笑」\n2.表达感受「你这个玩笑我不觉得好笑」\n3.保持微笑「态度温和但坚定」' }
  },
  {
    id: 3, questionType: 'choice', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '开部门会时领导突然点你名字让你发言',
    sceneFull: '开部门会时，领导突然点你名字让你发表意见，你完全没准备……',
    innerVoice: '（不是吧我什么都不知道啊）',
    options: [
      { letter: 'A', text: '嗯……我……没什么想法……（语无伦次）' },
      { letter: 'B', text: '不好意思打断一下，我刚才梳理了几点，想补充一下关于XX的想法' },
      { letter: 'C', text: '我还没想好，等我想好了再说。（沉默）' }
    ],
    correctIndex: 1, difficulty: 3, isHot: true,
    response: '选B用"不好意思打断"争取了思考时间，又展现了积极性。',
    bestAnswer: '不好意思打断一下，我刚才在梳理几个关键点，有几点想补充：第一……',
    bestAnswers: [
      { answer: '不好意思打断一下，我刚才在梳理几个关键点，有几点想补充：第一……', style: '主动型', styleEmoji: '🚀', score: 95 },
      { answer: '我想先听听大家的想法，然后我做一个总结', style: '稳妥型', styleEmoji: '🛡️', score: 85 }
    ],
    technique: '争取缓冲时间 + 先认同再补充',
    tips: '如果真没想法，可以说"我想先听听大家的意见，稍后做一个总结"。',
    cheatsheet: { oneLineRule: '突然被点名时：先争取时间，再给框架', rememberThis: '三个万能开头：\n1.「不好意思打断一下」\n2.「我补充一个角度」\n3.「我想先确认一下这个点」' }
  },
  {
    id: 4, questionType: 'choice', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '领导让你周末加班，你已经有安排了',
    sceneFull: '领导让你周末加班，你已经有安排了，怎么拒绝？',
    options: [
      { letter: 'A', text: '好的领导，没问题……（默默取消计划）' },
      { letter: 'B', text: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？' },
      { letter: 'C', text: '我不管，周末就是不上班！（直接拒绝）' }
    ],
    correctIndex: 1, difficulty: 2,
    response: '选B说明原因+提供替代方案，让领导有台阶下。',
    bestAnswer: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？',
    bestAnswers: [
      { answer: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？', style: '稳妥型', styleEmoji: '🛡️', score: 90 },
      { answer: '这周末我确实不方便，但周日晚我可以先做一部分，保证不耽误进度', style: '主动型', styleEmoji: '🚀', score: 85 }
    ],
    technique: '说明原因 + 提供替代方案',
    tips: '拒绝的同时给出解决方案，对方会更愿意接受。',
    cheatsheet: { oneLineRule: '拒绝加班：原因+替代方案', rememberThis: '三步：\n1.说明不可抗力「这周末有重要安排」\n2.提供替代「下周一优先处理」\n3.用语气词缓冲「可以吗？」' }
  },
  {
    id: 5, questionType: 'choice', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '领导当着全办公室批评你的方案',
    sceneFull: '领导当着全办公室的人批评你的方案，你觉得很丢脸……',
    innerVoice: '（我好想原地消失...）',
    options: [
      { letter: 'A', text: '（低头不说话，心里很难受）' },
      { letter: 'B', text: '好的领导，您说得对，我马上修改，XX时间前给您新版本。' },
      { letter: 'C', text: '我觉得我的方案没问题啊，是你们理解错了！（反驳）' }
    ],
    correctIndex: 1, difficulty: 3,
    response: '选B先接受+给出行动承诺，面子可以后面找回来。',
    bestAnswer: '好的领导，您说得对，我马上修改，XX时间前给您新版本。',
    bestAnswers: [
      { answer: '好的领导，您说得对，我马上修改，XX时间前给您新版本。', style: '稳妥型', styleEmoji: '🛡️', score: 90 },
      { answer: '谢谢领导指正，如果觉得有不妥，我回头单独跟您沟通', style: '高能型', styleEmoji: '⚡', score: 80 }
    ],
    technique: '先接受 + 行动承诺',
    tips: '公开接受、私下讨论，如果觉得批评不公，事后单独沟通。',
    cheatsheet: { oneLineRule: '当众被批：先接受+给时间表', rememberThis: '不要在公开场合争论对错\n事后单独沟通效果翻倍' }
  },
  {
    id: 6, questionType: 'choice', categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '暗恋的人问"你为什么对我这么好"',
    sceneFull: '暗恋的人问"你为什么对我这么好？"，你的心跳加速了……',
    innerVoice: '（要不要趁机表白？还是装傻？）',
    options: [
      { letter: 'A', text: '没有啊，我对谁都这样……（否认）' },
      { letter: 'B', text: '因为你值得啊～（微笑直视对方）' },
      { letter: 'C', text: '因为我喜欢你！一直都喜欢！（突然表白）' }
    ],
    correctIndex: 1, difficulty: 2, isHot: true,
    response: '选B真诚不越界，暧昧中留有余地。',
    bestAnswer: '因为你值得啊～（微笑直视对方）',
    bestAnswers: [
      { answer: '因为你值得啊～（微笑直视对方）', style: '稳妥型', styleEmoji: '🛡️', score: 90 },
      { answer: '对你好还需要理由吗？就是忍不住想对你好啊', style: '高能型', styleEmoji: '⚡', score: 85 }
    ],
    technique: '真诚不越界 + 留有余地', tips: '暧昧期的最佳状态是"双方都心照不宣"。',
    cheatsheet: { oneLineRule: '被问"为什么对我好"时说"因为你值得"', rememberThis: '不要急着表白\n暧昧期的暧昧就是最好的状态' }
  },
  // ===== FILL BLANK TYPE (填空) - 4 questions =====
  {
    id: 100, questionType: 'fillBlank', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '同事说"这个项目你帮帮我呗"',
    sceneFull: '同事说"这个项目你帮帮我呗"，但你手头已经有3个deadline了……',
    innerVoice: '（拒绝吧怕伤关系，不拒绝吧自己得加班到凌晨）',
    difficulty: 2,
    technique: '说明处境 + 有限帮助',
    tips: '不是不帮，是在自己有能力的范围内帮。',
    blankAnswer: '我手头有三个deadline，如果只是看一下我可以用午休时间帮你，但完整做恐怕来不及',
    bestAnswers: [
      { answer: '我手头有三个deadline，如果只是看一下我可以用午休时间帮你，但完整做恐怕来不及', style: '稳妥型', styleEmoji: '🛡️', score: 90 },
      { answer: '我现在确实很忙，要不我帮你找找谁有空？', style: '主动型', styleEmoji: '🚀', score: 80 }
    ],
    cheatsheet: { oneLineRule: '拒绝请托：说现实+办力所能及', rememberThis: '不要说"不行"\n说"我现在能帮你做的是___"' }
  },
  {
    id: 101, questionType: 'fillBlank', categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '对方说"你是不是生气了"',
    sceneFull: '其实在生闷气，但对方察觉到了，问你"你是不是生气了？"',
    innerVoice: '（说生气了显得小心眼，说不生气又憋得慌...）',
    difficulty: 2,
    technique: '诚实 + 非攻击性表达',
    tips: '生闷气不可怕，可怕的是一直不理人。',
    blankAnswer: '我确实有点不开心，但不是你的问题，让我自己缓一缓就好，一会儿再跟你聊',
    bestAnswers: [
      { answer: '我确实有点不开心，但不是你的问题，让我自己缓一缓就好，一会儿再跟你聊', style: '稳妥型', styleEmoji: '🛡️', score: 90 }
    ],
    cheatsheet: { oneLineRule: '生闷气时：诚实但不攻击', rememberThis: '公式：「我感觉到___，因为___，我希望___」' }
  },
  {
    id: 102, questionType: 'fillBlank', categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '朋友说"借我点钱呗"',
    sceneFull: '朋友突然开口借钱，你不太想借但也不想伤感情……',
    difficulty: 2,
    technique: '共情 + 拒绝 + 替代方案',
    tips: '拒绝借的是"钱"，不是"人"。',
    blankAnswer: '我理解你最近手头紧，不过我也在攒钱还房贷，要不我帮你问问其他人？',
    bestAnswers: [
      { answer: '我理解你最近手头紧，不过我也在攒钱还房贷，要不我帮你问问其他人？', style: '稳妥型', styleEmoji: '🛡️', score: 85 }
    ],
    cheatsheet: { oneLineRule: '拒绝借钱：理解+困难+替代', rememberThis: '拒绝的是借钱这件事\n不是拒绝你这个人' }
  },
  {
    id: 103, questionType: 'fillBlank', categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '亲戚问"什么时候结婚啊？"',
    sceneFull: '过年聚会，亲戚又问"什么时候结婚啊？都这么大了别挑了！"',
    difficulty: 1,
    technique: '模糊 + 转移 + 感谢',
    tips: '对长辈，态度到位比回答到位置重要。',
    blankAnswer: '哈哈这个得看缘分～您放心，有好消息第一个告诉您！来，吃菜吃菜！',
    bestAnswers: [
      { answer: '哈哈这个得看缘分～您放心，有好消息第一个告诉您！来，吃菜吃菜！', style: '稳妥型', styleEmoji: '🛡️', score: 90 }
    ],
    cheatsheet: { oneLineRule: '被催婚/催生：缘分挡箭牌+转移', rememberThis: '万能句子：\n「这个得看缘分～」+ 转移话题' }
  },

  // ===== RELAY TYPE (接力对话) - 3 questions =====
  {
    id: 200, questionType: 'relay', categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '同事找你周末团建',
    sceneFull: '同事约你周末去团建，但你周末已经有安排了……这个对话怎么进行？',
    difficulty: 2, technique: '拒绝邀请 + 保持关系',
    tips: '拒绝活动不是拒绝人。关键是要让对方知道"想去但去不了"。',
    rounds: [
      {
        dialog: '小王，周末团建去爬山，一起去啊！',
        options: [
          { text: '啊……周末我有事了，去不了（冷漠）', nextRoundIndex: 0, score: 20 },
          { text: '周末我已经有安排了，真遗憾！下次一定参加，你们玩得开心！', nextRoundIndex: 1, score: 90 },
          { text: '我不喜欢爬山，太累了。（直接拒绝）', nextRoundIndex: 2, score: 30 }
        ]
      },
      {
        dialog: '啊这样啊……那行吧，下次咯？',
        options: [
          { text: '嗯。（沉默）', nextRoundIndex: 0, score: 30 },
          { text: '一定一定！你们多拍照片发群里，我云爬山！', nextRoundIndex: 0, score: 95 },
          { text: '看情况吧，不一定有空', nextRoundIndex: 0, score: 40 }
        ]
      },
      {
        dialog: '真遗憾，那下次一定啊！',
        options: [
          { text: '好的好的，下次见', nextRoundIndex: 0, score: 70 },
          { text: '必须的！下周我请吃饭弥补～', nextRoundIndex: 0, score: 95 },
          { text: '嗯拜拜（转身就走）', nextRoundIndex: 0, score: 20 }
        ]
      }
    ],
    cheatsheet: { oneLineRule: '拒绝团建：感谢+理由+弥补', rememberThis: '拒绝邀请的核心原则：\n让对方觉得"你想去但去不了"\n而不是"你不想去"' }
  },
  {
    id: 201, questionType: 'relay', categoryId: 4, categoryName: '校园生活', categoryTag: '🎓 校园生活',
    scene: '同学要抄你的作业',
    sceneFull: '同学找你要作业抄，你不想给但又不知怎么拒绝……',
    difficulty: 1, technique: '拒绝请求 + 提供帮助',
    tips: '拒绝给答案，但可以帮对方理解。',
    rounds: [
      {
        dialog: '那个作业你写了吗？借我抄抄呗，我完全没思路！',
        options: [
          { text: '啊……好吧给你……（不情愿）', nextRoundIndex: 0, score: 20 },
          { text: '作业还是自己写比较好哦～你哪题不会？我可以给你讲讲思路', nextRoundIndex: 1, score: 95 },
          { text: '不行，抄作业不对！（说教）', nextRoundIndex: 2, score: 40 }
        ]
      },
      {
        dialog: '害，我就是第三题不懂，你跟我说说思路？',
        options: [
          { text: '第三题就是套公式，你看这里……（详细讲解）', nextRoundIndex: 0, score: 95 },
          { text: '你自己看课本不行吗？', nextRoundIndex: 0, score: 20 },
          { text: '我也不知道，我也是瞎写的', nextRoundIndex: 0, score: 40 }
        ]
      },
      {
        dialog: '明白了！谢谢啊，我自己试试。',
        options: [
          { text: '不客气，有不懂的再问我～', nextRoundIndex: 0, score: 95 },
          { text: '嗯，下次别找我抄了啊', nextRoundIndex: 0, score: 30 },
          { text: '哦。', nextRoundIndex: 0, score: 20 }
        ]
      }
    ],
    cheatsheet: { oneLineRule: '拒绝抄作业：不给鱼但教钓鱼', rememberThis: '公式：不直接给答案\n但提供学习帮助\n既帮了对方又守住了底线' }
  },
  {
    id: 202, questionType: 'relay', categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '约会迟到被对方等了很久',
    sceneFull: '你约会迟到了半小时，对方已经在寒风中等了很久……',
    difficulty: 2, technique: '真诚道歉 + 补偿行动',
    tips: '别找借口，道歉+行动永远比解释有效。',
    rounds: [
      {
        dialog: '（对方脸色不太好）你终于来了……我等了半小时了。',
        options: [
          { text: '路上堵车我也没办法啊！（辩解）', nextRoundIndex: 0, score: 10 },
          { text: '对不起对不起，是我出发晚了！今天全听你的，我请客！', nextRoundIndex: 1, score: 95 },
          { text: '你不是也经常迟到吗？（反击）', nextRoundIndex: 2, score: 5 }
        ]
      },
      {
        dialog: '（脸色缓和）算你还知道认错……那去哪？',
        options: [
          { text: '就随便吧，你说了算', nextRoundIndex: 0, score: 30 },
          { text: '去你上次说很想吃的那家！我提前研究过菜单了，帮你点好了', nextRoundIndex: 0, score: 95 },
          { text: '随便你，我都可以', nextRoundIndex: 0, score: 25 }
        ]
      }
    ],
    cheatsheet: { oneLineRule: '迟到道歉：认错+补偿+主动', rememberThis: '不要辩解！不要辩解！\n直接认错 + 今天全听你的\n提前准备好补偿方案' }
  },

  // ===== DILEMMA TYPE (二选一) - 3 questions =====
  {
    id: 300, questionType: 'dilemma', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '两个选择都尴尬，选"更不尴尬"的',
    sceneFull: '电梯里遇到大领导，只有你们两个，空气凝固了3秒钟……',
    difficulty: 1,
    options: [
      { letter: 'A', text: '低头看手机，假装很忙' },
      { letter: 'B', text: '主动打招呼"X总好！最近XX项目进展不错"' }
    ],
    correctIndex: 1,
    optionScores: [
      { text: '低头看手机，假装很忙', deadLevel: '社死度：⭐⭐⭐' },
      { text: '主动打招呼"X总好！"', deadLevel: '社死度：⭐' }
    ],
    dilemmaExplanation: '选A领导可能觉得你在摸鱼，而且白白浪费了展示存在感的机会。选B虽然有点紧张，但10秒就过去了。主动打招呼才是"更不尴尬"的选择！',
    technique: '主动展示存在感', tips: '电梯聊天不是汇报，30秒展示"我在认真做事"就够了。',
    cheatsheet: { oneLineRule: '电梯遇到领导：主动打招呼+提工作', rememberThis: '领导也是人，见了打个招呼\n比假装看不见体面得多' }
  },
  {
    id: 301, questionType: 'dilemma', categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '两个回应都不太妙，你选哪个？',
    sceneFull: '过年亲戚说："你看人家XX，年纪轻轻已经是经理了/买房了/结婚了……"',
    innerVoice: '（又来了...每年固定节目）',
    difficulty: 2,
    options: [
      { letter: 'A', text: '是啊他确实很优秀，我还在努力中' },
      { letter: 'B', text: '那你去认他当侄子吧！' }
    ],
    correctIndex: 0,
    optionScores: [
      { text: '是啊他确实很优秀，我还在努力中', deadLevel: '社死度：⭐⭐' },
      { text: '那你去认他当侄子吧！', deadLevel: '社死度：⭐⭐⭐⭐⭐' }
    ],
    dilemmaExplanation: '选A虽然有点委屈，但保持了体面且不伤和气。选B虽然出了一时之气，但之后每年过年都会特别尴尬。在亲戚社交中，体面比痛快更重要！',
    technique: '承认差距 + 保持体面', tips: '亲戚比较你，不是恶意，是没别的话题聊了。认真你就输了。',
    cheatsheet: { oneLineRule: '被拿来比较：承认但不内耗', rememberThis: '比较是永远存在的\n你的价值不需要通过比较证明\n笑笑了之最轻松' }
  },
  {
    id: 302, questionType: 'dilemma', categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '两个回应都可能社死，选"更活"的那个',
    sceneFull: '有人夸你"你做的真好！太厉害了！"',
    difficulty: 1,
    options: [
      { letter: 'A', text: '没有没有，我真的不行……（疯狂否定）' },
      { letter: 'B', text: '谢谢！被你这么一说好开心～你也很厉害啊！' }
    ],
    correctIndex: 1,
    optionScores: [
      { text: '没有没有，我真的不行……', deadLevel: '社死度：⭐⭐⭐⭐（让对方尴尬）' },
      { text: '谢谢！被你这么一说好开心～', deadLevel: '社死度：⭐（大方得体）' }
    ],
    dilemmaExplanation: '选A不仅让自己看起没自信，还让夸你的人很尴尬（仿佛在说"你不识货"）。选B大方接受+回夸对方，接受赞美不是自大，是对夸奖者的尊重！',
    technique: '大方接受 + 回夸对方', tips: '被夸时，说"谢谢"就够了。接受赞美是对夸奖者的尊重。',
    cheatsheet: { oneLineRule: '被夸时说"谢谢！你也很棒"', rememberThis: '说"谢谢"就够\n说"没有没有"反而让对方尴尬\n接受赞美≠自大' }
  },

  // ===== SPOT MISTAKE TYPE (找茬) - 3 questions =====
  {
    id: 400, questionType: 'spotMistake', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '找出这段对话中最不该说的话',
    sceneFull: '以下是你和关心你的同事的一段对话，请找出最不该说的那句话：',
    difficulty: 2, technique: '接受关心 + 礼貌回应',
    tips: '关心你的人被怼了，下次就不会再关心你了。',
    dialog: [
      { role: 'colleague', text: '王哥，你最近是不是忙项目啊？看你天天加班' },
      { role: 'me', text: '还好吧，正常加班' },
      { role: 'colleague', text: '注意身体啊，别太拼了' },
      { role: 'me', text: '也没天天加，你别瞎操心' },
      { role: 'colleague', text: '...好吧' }
    ],
    mistakeIndex: 3,
    explanation: '"也没天天加，你别瞎操心"——对方好心关心你，你把好意怼回去了。"瞎操心"这个词会让对方觉得自己的关心是多余的，以后可能就不会再关心你了。',
    cheatsheet: { oneLineRule: '别人关心你时不要说"别瞎操心"', rememberThis: '回应关心的正确方式：\n「谢谢你关心！我自己会注意的」' }
  },
  {
    id: 401, questionType: 'spotMistake', categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '找出这段对话中让关系恶化的话',
    sceneFull: '你和对象因为去哪吃饭产生了分歧：',
    difficulty: 2, technique: '避免绝对化指责',
    tips: '永远不要说"你从来都/你总是"。',
    dialog: [
      { role: 'partner', text: '今天吃什么？我想吃火锅' },
      { role: 'me', text: '又吃火锅？上周不是刚吃过' },
      { role: 'partner', text: '那你说吃什么？' },
      { role: 'me', text: '随便，但别吃火锅就行' },
      { role: 'partner', text: '你从来都不说想吃啥，我说了你又说不行！' },
      { role: 'me', text: '我哪有从来都不说？你老是这样' }
    ],
    mistakeIndex: 5,
    explanation: '"我哪有从来都不说？你老是这样"——对方用了"从来都"这种绝对化指责已经不好，你用"老是这样"回击只会让关系更加恶化。应该先缓和情绪："你说得对，我确实经常不说想吃啥，这次我选一个——我们去吃日料吧～"',
    cheatsheet: { oneLineRule: '吵架不要说"你从来都/你总是"', rememberThis: '绝对化指责只会升级矛盾\n改为：「我感觉到___，我希望___」' }
  },
  {
    id: 402, questionType: 'spotMistake', categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '找出让好心变尴尬的那句话',
    sceneFull: '你生病请假了，同事来问候：',
    difficulty: 1, technique: '接受好意 + 表达感激',
    tips: '别人关心你的时候，即使不舒服也要先感谢。',
    dialog: [
      { role: 'colleague', text: '听说你生病了，现在好点了没？' },
      { role: 'me', text: '还行，就是有点发烧' },
      { role: 'colleague', text: '我上次也这样，多喝热水，要不要帮你带点药？' },
      { role: 'me', text: '不用了，多喝热水有用的话要医生干嘛' },
      { role: 'colleague', text: '...哦好，那你好好休息' }
    ],
    mistakeIndex: 3,
    explanation: '"不用了，多喝热水有用的话要医生干嘛"——同事是好心想帮忙，你说这话不仅怼了对方，还把"多喝热水"这个关心的象征给否定了。换个说法："谢谢！药我已经买了，你太暖了～"',
    cheatsheet: { oneLineRule: '被关心时先说"谢谢/你太暖了"', rememberThis: '别人关心你的时候\n你可以不需要帮助\n但请务必先说"谢谢"' }
  },

  // ===== PUZZLE TYPE (拼图) - 3 questions =====
  {
    id: 500, questionType: 'puzzle', categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '把打乱的话术拼成正确的拒绝方式',
    sceneFull: '你想拒绝同事甩给你的工作，以下话术被打乱了，请拼出正确顺序：',
    difficulty: 2, technique: '拒绝请托的公式',
    tips: '拒绝要：铺垫→说明→替代→缓冲。',
    correctOrder: ['我手头也有几个紧急任务', '恐怕没办法帮你了', '要不我们一起找领导协调下', '看看怎么分配更合理'],
    fullSentence: '我手头也有几个紧急任务，恐怕没办法帮你了。要不我们一起找领导协调下，看看怎么分配更合理。',
    cheatsheet: { oneLineRule: '拒绝甩活：铺垫+说明+替代+缓冲', rememberThis: '拒绝公式：\n1. 说明自己的处境\n2. 明确说"帮不了"\n3. 提供替代方案\n4. 用"我们"来缓冲' }
  },
  {
    id: 501, questionType: 'puzzle', categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '拼出正确的道歉话术',
    sceneFull: '吵架后你想道歉，话术顺序被打乱了：',
    difficulty: 2, technique: '道歉的正确姿势',
    tips: '道歉需要：感受→道歉→理解→行动。',
    correctOrder: ['我认真想了一下', '我知道我那么说让你难过了', '对不起', '以后我会注意我的表达方式'],
    fullSentence: '我认真想了一下，我知道我那么说让你难过了，对不起。以后我会注意我的表达方式。',
    cheatsheet: { oneLineRule: '道歉公式：思考→共情→道歉→改进', rememberThis: '道歉不要说"对不起但...（辩解）"\n就说「对不起，我理解你为什么难过，我会改」' }
  },
  {
    id: 502, questionType: 'puzzle', categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '拼出正确夸奖别人的话术',
    sceneFull: '你想真心夸奖朋友的穿搭，话术被打乱了：',
    difficulty: 1, technique: '赞美公式',
    tips: '赞美要具体，不要笼统。',
    correctOrder: ['哇你今天的穿搭好好看', '这个颜色特别适合你', '显得气色很好', '是在哪里买的啊'],
    fullSentence: '哇你今天的穿搭好好看！这个颜色特别适合你，显得气色很好～是在哪里买的啊？',
    cheatsheet: { oneLineRule: '赞美公式：感叹+具体+延伸', rememberThis: '不要说「你好好看」（笼统）\n要说「这个颜色特别适合你」（具体）' }
  }
]

// ==================== SOCIAL QUIZ QUESTIONS ====================

export const SOCIAL_QUIZ_QUESTIONS = [
  {
    id: 'sq1',
    scene: '聚会中有人走过来跟你搭话，你第一反应是？',
    options: [
      { text: '微笑回应，试着聊几句', scores: { avoid: 1, explode: 0, hidden: 0 } },
      { text: '假装看手机，希望对方知难而退', scores: { avoid: 3, explode: 0, hidden: 1 } },
      { text: '僵住，脑子一片空白', scores: { avoid: 2, explode: 1, hidden: 2 } }
    ]
  },
  {
    id: 'sq2',
    scene: '需要在众人面前发表简短讲话，你的状态是？',
    options: [
      { text: '提前准备了三四天，还是紧张得冒汗', scores: { avoid: 2, explode: 1, hidden: 2 } },
      { text: '上台前想说很多，上去就全忘了', scores: { explode: 2, avoid: 2, hidden: 1 } },
      { text: '懒得准备，上去随便说两句', scores: { hidden: 3, avoid: 1, explode: 1 } }
    ]
  },
  {
    id: 'sq3',
    scene: '被邀请参加陌生人为主的聚会，你会？',
    options: [
      { text: '找借口不去，在家呆着更舒服', scores: { avoid: 3, explode: 0, hidden: 2 } },
      { text: '硬着头皮去，然后全程靠墙玩手机', scores: { avoid: 2, explode: 1, hidden: 1 } },
      { text: '去就去呗，到了再说', scores: { hidden: 3, avoid: 1, explode: 0 } }
    ]
  },
  {
    id: 'sq4',
    scene: '工作中有人批评你的方案，你的反应是？',
    options: [
      { text: '表面冷静但内心崩溃，一整天都在想这件事', scores: { avoid: 2, explode: 1, hidden: 2 } },
      { text: '当场反驳："你不懂我的思路"', scores: { explode: 3, avoid: 0, hidden: 1 } },
      { text: '认真听完，问"那你觉得怎么改更好"', scores: { hidden: 3, avoid: 0, explode: 0 } }
    ]
  },
  {
    id: 'sq5',
    scene: '你愿意在朋友圈分享自己的日常生活吗？',
    options: [
      { text: '几乎不发，发了也很快就删了', scores: { avoid: 3, explode: 1, hidden: 1 } },
      { text: '偶尔想发，但编辑半小时后又放弃了', scores: { avoid: 2, explode: 1, hidden: 2 } },
      { text: '无所谓，想发就发', scores: { hidden: 3, avoid: 0, explode: 0 } }
    ]
  },
  {
    id: 'sq6',
    scene: '遇到别人向你借钱，你不想借，你会？',
    options: [
      { text: '虽然不想但还是勉强借了', scores: { avoid: 2, explode: 0, hidden: 0 } },
      { text: '直接说"不借，我的钱凭什么借给你"', scores: { explode: 3, avoid: 0, hidden: 1 } },
      { text: '好好解释自己也有困难，帮对方想其他办法', scores: { hidden: 3, avoid: 1, explode: 0 } }
    ]
  },
  {
    id: 'sq7',
    scene: '周末有个完全没安排的空白，你倾向于？',
    options: [
      { text: '太好了！在家躺平看剧刷手机', scores: { avoid: 2, hidden: 2, explode: 1 } },
      { text: '有点焦虑，觉得浪费了时间但也不知道做什么', scores: { avoid: 1, explode: 2, hidden: 1 } },
      { text: '主动约朋友出去或者安排点有意思的事', scores: { hidden: 3, avoid: 0, explode: 0 } }
    ]
  },
  {
    id: 'sq8',
    scene: '和别人聊天冷场了，你会？',
    options: [
      { text: '紧张到大脑空白，疯狂想话题', scores: { avoid: 2, explode: 1, hidden: 1 } },
      { text: '拿起手机假装看消息，逃避尴尬', scores: { avoid: 3, explode: 0, hidden: 0 } },
      { text: '自然地换个话题，或者自嘲一句"哈哈好像聊干了"', scores: { hidden: 3, avoid: 0, explode: 0 } }
    ]
  },
  {
    id: 'sq9',
    scene: '别人夸你"你今天穿得好好看"，你会？',
    options: [
      { text: '连忙说"没有没有，就是随便穿的"', scores: { avoid: 2, explode: 0, hidden: 1 } },
      { text: '心里开心，但不知道怎么回应，尬笑', scores: { avoid: 2, explode: 0, hidden: 1 } },
      { text: '大方说"谢谢！你今天也很帅/美"', scores: { hidden: 3, avoid: 0, explode: 0 } }
    ]
  },
  {
    id: 'sq10',
    scene: '如果你可以重新选择一次人生性格，你更想？',
    options: [
      { text: '保持现在的自己，也挺好的', scores: { hidden: 2, avoid: 2, explode: 1 } },
      { text: '变成一个社交达人，走到哪都能聊', scores: { avoid: 2, explode: 2, hidden: 2 } },
      { text: '不用变，但希望在某些场合不那么紧张就好了', scores: { avoid: 1, explode: 1, hidden: 1 } }
    ]
  }
]

// ==================== HELPERS ====================

const getTodayDateString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const getDayOfYear = () => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  return Math.floor((now.getTime() - start.getTime()) / 86400000)
}

export function getRank(totalXP: number): { rank: Rank; progress: number } {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].minScore) {
      const nextMin = i < RANKS.length - 1 ? RANKS[i + 1].minScore : 100
      const currentMin = RANKS[i].minScore
      const progress = Math.min(100, Math.round(((totalXP - currentMin) / (nextMin - currentMin)) * 100))
      return { rank: RANKS[i], progress }
    }
  }
  return { rank: RANKS[0], progress: 0 }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = Taro.getStorageSync(key)
    return raw !== '' ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    Taro.setStorageSync(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

// ==================== STORE ====================

const initCharacter = loadFromStorage<string | null>('sos-character', null)
const initFavorites = loadFromStorage<number[]>('sos-favorites', [])
const initSettings = loadFromStorage<UserSettings>('sos-settings', {
  enableTimer: true, enableSound: true, enableAnimation: true
})
const initSeriesProgress = loadFromStorage<SeriesProgress>('sos-series', {})
const initXP = loadFromStorage<number>('sos-xp', 0)
const initStreak = loadFromStorage<number>('sos-streak', 0)
const initLastDate = loadFromStorage<string>('sos-last-date', getTodayDateString())
const initQuizResult = loadFromStorage<QuizResult | null>('sos-quiz-result', null)
const initPreferred = loadFromStorage<string>('sos-preferred', '')
const initAnswered = loadFromStorage<Record<number, boolean>>('sos-answered', {})

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  character: initCharacter,
  characters: CHARACTERS,
  rank: getRank(initXP).rank.id,
  totalXP: initXP,
  rankProgress: getRank(initXP).progress,
  categories: CATEGORIES,
  questions: QUESTIONS,
  currentQuestionIndex: 0,
  currentCategoryFilter: 0,
  quizPhase: 'scene',
  selectedOption: null,
  selectedDialogs: [],
  currentRound: 0,
  roundResults: [],
  puzzleOrder: [],
  userStats: { practiced: Object.keys(initAnswered).length, streak: initStreak, accuracy: 0, favorites: initFavorites.length },
  answeredQuestions: initAnswered,
  correctCount: Object.values(initAnswered).filter(Boolean).length,
  favorites: initFavorites,
  seriesList: SERIES_LIST,
  seriesProgress: initSeriesProgress,
  dailyFreeCount: 3,
  dailyFreeDate: getTodayDateString(),
  lastPracticeDate: initLastDate,
  streakDays: initStreak,
  showPaymentModal: false,
  isPaid: true,
  quizResult: initQuizResult,
  preferredStyle: initPreferred,
  settings: initSettings,
  timeLeft: 5,
  timerActive: false,

  // Character
  setCharacter: (id) => {
    set({ character: id })
    saveToStorage('sos-character', id)
  },

  // Quiz navigation
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setCurrentCategoryFilter: (categoryId) => set({ currentCategoryFilter: categoryId }),
  setQuizPhase: (phase) => set({ quizPhase: phase }),
  setSelectedOption: (option) => set({ selectedOption: option }),

  selectOption: (optionIndex) => {
    const state = get()
    const question = state.getFilteredQuestions()[state.currentQuestionIndex]
    if (!question) return
    const isCorrect = optionIndex === question.correctIndex

    set({ selectedOption: optionIndex, quizPhase: 'revealed' })

    const newAnswered = { ...state.answeredQuestions, [question.id]: isCorrect }
    const correctCount = Object.values(newAnswered).filter(Boolean).length

    // XP gain
    let xpGain = isCorrect ? 1 : 0
    if (isCorrect) {
      const keys = Object.keys(newAnswered)
      if (keys.length >= 2) {
        const lastTwo = keys.slice(-2).map(k => newAnswered[Number(k)])
        if (lastTwo.length === 2 && lastTwo[0] && lastTwo[1]) xpGain += 1
      }
    }

    const newXP = state.totalXP + xpGain
    const { rank, progress } = getRank(newXP)

    // Streak
    const today = getTodayDateString()
    let newStreak = state.streakDays
    if (state.lastPracticeDate === getYesterdayDate()) {
      newStreak += 1
    } else if (state.lastPracticeDate !== today) {
      newStreak = 1
    }

    set({
      answeredQuestions: newAnswered,
      correctCount,
      totalXP: newXP,
      rank: rank.id,
      rankProgress: progress,
      lastPracticeDate: today,
      streakDays: newStreak
    })

    saveToStorage('sos-answered', newAnswered)
    saveToStorage('sos-xp', newXP)
    saveToStorage('sos-streak', newStreak)
    saveToStorage('sos-last-date', today)
  },

  nextQuestion: () => {
    const state = get()
    const filtered = state.getFilteredQuestions()
    const nextIndex = state.currentQuestionIndex + 1
    if (nextIndex < filtered.length) {
      set({
        currentQuestionIndex: nextIndex,
        quizPhase: 'scene',
        selectedOption: null,
        selectedDialogs: [],
        currentRound: 0,
        roundResults: [],
        puzzleOrder: [],
        timeLeft: 5,
        timerActive: false
      })
    } else {
      set({
        currentQuestionIndex: 0,
        quizPhase: 'scene',
        selectedOption: null,
        selectedDialogs: [],
        currentRound: 0,
        roundResults: [],
        puzzleOrder: [],
        timeLeft: 5,
        timerActive: false
      })
    }
  },

  startQuiz: () => {
    set({ quizPhase: 'selecting', selectedOption: null, selectedDialogs: [], currentRound: 0, roundResults: [], puzzleOrder: [], timeLeft: 5 })
  },

  getFilteredQuestions: () => {
    const state = get()
    if (state.currentCategoryFilter === null || state.currentCategoryFilter === 0) return state.questions
    if (state.currentCategoryFilter === 7) {
      // Random shuffle
      const shuffled = [...state.questions].sort(() => Math.random() - 0.5)
      return shuffled
    }
    return state.questions.filter(q => q.categoryId === state.currentCategoryFilter)
  },

  getDailyChallenge: () => {
    const state = get()
    const day = getDayOfYear()
    const hardQuestions = state.questions.filter(q => q.difficulty === 3)
    if (hardQuestions.length === 0) return null
    return hardQuestions[day % hardQuestions.length]
  },

  getCategoryQuestions: (categoryId) => get().questions.filter(q => q.categoryId === categoryId),

  canAnswer: () => {
    const state = get()
    if (state.isPaid) return true
    const today = getTodayDateString()
    if (state.dailyFreeDate !== today) return true
    return state.dailyFreeCount > 0
  },

  getRemainingFreeCount: () => {
    const state = get()
    const today = getTodayDateString()
    if (state.dailyFreeDate !== today) return 3
    return state.dailyFreeCount
  },

  // Favorites
  toggleFavorite: (questionId) => {
    const state = get()
    const newFavorites = state.favorites.includes(questionId)
      ? state.favorites.filter(id => id !== questionId)
      : [...state.favorites, questionId]
    set({ favorites: newFavorites })
    saveToStorage('sos-favorites', newFavorites)
  },

  getFavoritesList: () => {
    const state = get()
    return state.questions.filter(q => state.favorites.includes(q.id))
  },

  // Series
  getSeriesQuestions: (seriesId) => {
    return get().questions.filter(q => q.seriesId === seriesId)
  },

  updateSeriesProgress: (seriesId, episodeIndex) => {
    const state = get()
    const newProgress = { ...state.seriesProgress, [seriesId]: Math.max(state.seriesProgress[seriesId] || 0, episodeIndex + 1) }
    set({ seriesProgress: newProgress })
    saveToStorage('sos-series', newProgress)
  },

  // Social Quiz
  setQuizResult: (result) => {
    set({ quizResult: result })
    saveToStorage('sos-quiz-result', result)
  },

  setPreferredStyle: (style) => {
    set({ preferredStyle: style })
    saveToStorage('sos-preferred', style)
  },

  // Settings
  updateSettings: (s) => {
    const state = get()
    const newSettings = { ...state.settings, ...s }
    set({ settings: newSettings })
    saveToStorage('sos-settings', newSettings)
  },

  // Payment
  setShowPaymentModal: (show) => set({ showPaymentModal: show }),
  setIsPaid: (paid) => set({ isPaid: paid }),

  // Timer
  setTimeLeft: (t) => set({ timeLeft: t }),
  setTimerActive: (a) => set({ timerActive: a }),

  // Puzzle
  setPuzzleOrder: (order) => set({ puzzleOrder: order }),

  // Relay
  setCurrentRound: (r) => set({ currentRound: r }),
  setRoundResults: (r) => set({ roundResults: r }),

  selectRelayOption: (optionIndex) => {
    const state = get()
    const question = state.getFilteredQuestions()[state.currentQuestionIndex]
    if (!question || !question.rounds) return

    const round = question.rounds[state.currentRound]
    if (!round || !round.options[optionIndex]) return

    const option = round.options[optionIndex]
    const newResults = [...state.roundResults, option.score]
    const newDialogs = [...state.selectedDialogs, optionIndex]
    const nextRound = state.currentRound + 1

    if (nextRound >= question.rounds.length || question.rounds[nextRound].options.length <= option.nextRoundIndex) {
      // Last round
      const avgScore = newResults.length > 0
        ? Math.round(newResults.reduce((a, b) => a + b, 0) / newResults.length)
        : 0
      const isCorrect = avgScore >= 70
      set({
        selectedOption: avgScore,
        selectedDialogs: newDialogs,
        currentRound: nextRound,
        roundResults: newResults,
        quizPhase: 'revealed'
      })

      // Update stats
      const newAnswered = { ...state.answeredQuestions, [question.id]: isCorrect }
      const correctCount = Object.values(newAnswered).filter(Boolean).length
      const xpGain = isCorrect ? 1 : 0
      const newXP = state.totalXP + xpGain
      const { rank, progress } = getRank(newXP)

      set({
        answeredQuestions: newAnswered,
        correctCount,
        totalXP: newXP,
        rank: rank.id,
        rankProgress: progress
      })
      saveToStorage('sos-answered', newAnswered)
      saveToStorage('sos-xp', newXP)
    } else {
      set({
        selectedDialogs: newDialogs,
        currentRound: nextRound,
        roundResults: newResults
      })
    }
  },

  // Cheatsheet
  getCheatsheets: () => {
    const state = get()
    return state.questions
      .filter(q => q.cheatsheet)
      .map(q => ({ categoryTag: q.categoryTag, question: q, cheatsheet: q.cheatsheet! }))
  }
}))

function getYesterdayDate() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
