import { create } from 'zustand'

// Types
export interface QuizOption {
  letter: string
  text: string
}

export interface QuizQuestion {
  id: number
  categoryId: number
  categoryName: string
  categoryTag: string
  scene: string
  sceneFull: string
  options: QuizOption[]
  correctIndex: number
  response: string
  bestAnswer: string
  technique: string
  tips: string
  difficulty: number
  isHot?: boolean
  isNew?: boolean
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

export interface QuizState {
  categories: Category[]
  questions: QuizQuestion[]
  currentQuestionIndex: number
  currentCategoryFilter: number | null
  userStats: UserStats
  favorites: number[]
  answeredQuestions: Record<number, boolean>
  showPaymentModal: boolean
  isPaid: boolean
  dailyFreeCount: number
  dailyFreeDate: string
  quizPhase: 'scene' | 'selecting' | 'revealed'
  selectedOption: number | null

  // Actions
  setCurrentQuestionIndex: (index: number) => void
  setCurrentCategoryFilter: (categoryId: number | null) => void
  answerQuestion: (questionId: number, isCorrect: boolean) => void
  toggleFavorite: (questionId: number) => void
  setShowPaymentModal: (show: boolean) => void
  setQuizPhase: (phase: 'scene' | 'selecting' | 'revealed') => void
  setSelectedOption: (option: number | null) => void
  selectOption: (optionIndex: number) => void
  nextQuestion: () => void
  startQuiz: () => void
  getFilteredQuestions: () => QuizQuestion[]
  getTodayQuestion: () => QuizQuestion
  getCategoryQuestions: (categoryId: number) => QuizQuestion[]
  canAnswer: () => boolean
  getRemainingFreeCount: () => number
}

export const CATEGORIES: Category[] = [
  { id: 0, name: '推荐', emoji: '🔥', tag: '🔥 推荐', count: 0, description: '精选推荐' },
  { id: 1, name: '职场生存', emoji: '🏢', tag: '🏢 职场生存', count: 50, description: '被领导批评、开会发言、同事甩锅…' },
  { id: 2, name: '社交聚会', emoji: '🎉', tag: '🎉 社交聚会', count: 40, description: '聚会插不上话、敬酒、被问隐私…' },
  { id: 3, name: '恋爱沟通', emoji: '💕', tag: '💕 恋爱沟通', count: 30, description: '暗恋开口、表白、吵架处理…' },
  { id: 4, name: '校园生活', emoji: '🎓', tag: '🎓 校园生活', count: 30, description: '自我介绍、小组作业、被点名…' },
  { id: 5, name: '日常人际', emoji: '🛒', tag: '🛒 日常人际', count: 30, description: '被夸、拒绝、沟通技巧…' },
  { id: 6, name: '亲戚应酬', emoji: '🧧', tag: '🧧 亲戚应酬', count: 20, description: '过年被问、催婚、长辈劝酒…' }
]

export const QUESTIONS: QuizQuestion[] = [
  // ===== 社交聚会 =====
  {
    id: 1, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '聚会上有人问你"你怎么这么安静啊？"',
    sceneFull: '聚会上，有人当着大家的面问你：\n"你怎么这么安静啊？都不怎么说话。"\n所有人都在看你，空气突然安静了……',
    options: [
      { letter: 'A', text: '嗯……我就是比较内向，不太会说话……（低头沉默）' },
      { letter: 'B', text: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～' },
      { letter: 'C', text: '是吗？可能是我们不熟吧，熟了你就知道我话多了（翻白眼）' }
    ],
    correctIndex: 1,
    response: '选A或B，领导会觉得你不上心。选B用"哈哈"化解尴尬，不否定自己还夸了大家。',
    bestAnswer: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～',
    technique: '用自嘲化解 + 先夸对方',
    tips: '把"我不够好"转化为"你们很好"，气氛瞬间就轻松了。',
    difficulty: 2, isHot: true
  },
  {
    id: 2, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '同事当众开你的玩笑，大家都笑了',
    sceneFull: '同事当众开你的玩笑，大家都笑了，但你并不觉得好笑……',
    options: [
      { letter: 'A', text: '（强颜欢笑）哈哈是挺搞笑的……' },
      { letter: 'B', text: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）' },
      { letter: 'C', text: '你来一个试试？你自己被开玩笑开心吗？（生气）' }
    ],
    correctIndex: 1,
    response: '选A委屈自己，选C太攻击。选B温柔但坚定地划清边界，既不委屈也不翻脸。',
    bestAnswer: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）',
    technique: '温柔地划清边界',
    tips: '拒绝不必带有敌意，温柔也是一种力量。',
    difficulty: 2
  },
  {
    id: 3, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '聚会上完全不认识人，怎么破冰',
    sceneFull: '朋友带你参加聚会，结果朋友去跟别人聊了，你一个人站在角落……',
    options: [
      { letter: 'A', text: '（低头玩手机，等朋友回来）' },
      { letter: 'B', text: '嗨，我也是第一次来，你是XX的朋友吗？' },
      { letter: 'C', text: '（强行加入旁边的聊天）你们在聊什么啊？' }
    ],
    correctIndex: 1,
    response: '选A太被动，选C太突兀。选B自然地找共同点破冰，对方也大概率是新来的。',
    bestAnswer: '嗨，我也是第一次来，你是XX的朋友吗？',
    technique: '找共同点 + 自然破冰',
    tips: '聚会上很多人其实也在找话题，主动开口反而给对方解围。',
    difficulty: 1, isNew: true
  },
  {
    id: 4, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '饭局上被问隐私问题',
    sceneFull: '饭局上有人一直追问你的私人问题："有对象没？""工资多少？""在哪住？"',
    options: [
      { letter: 'A', text: '（尴尬地回答了所有问题）' },
      { letter: 'B', text: '哈哈，这些是秘密～咱们聊点开心的，你最近在忙什么？' },
      { letter: 'C', text: '这是我的隐私，不太方便说。（严肃）' }
    ],
    correctIndex: 1,
    response: '选A暴露隐私，选C太冷场。选B用幽默挡回去，同时主动转移话题。',
    bestAnswer: '哈哈，这些是秘密～咱们聊点开心的，你最近在忙什么？',
    technique: '幽默挡回 + 主动转移',
    tips: '不想回答的问题，最好的方式是"幽默推挡+转移焦点"。',
    difficulty: 2
  },
  {
    id: 5, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '敬酒时不知道说什么',
    sceneFull: '饭局上轮到你敬酒，你站起来脑子一片空白，不知道说什么……',
    options: [
      { letter: 'A', text: '（端着杯子不知道说什么，尴尬地站着）' },
      { letter: 'B', text: '感谢大家今天的陪伴，祝大家身体健康、事事顺心！' },
      { letter: 'C', text: '来来来，干杯！（直接灌酒）' }
    ],
    correctIndex: 1,
    response: '选A尴尬，选C太粗暴。选B简单得体，有感谢有祝福，不会出错。',
    bestAnswer: '感谢大家今天的陪伴，祝大家身体健康、事事顺心！',
    technique: '感谢 + 祝福万能公式',
    tips: '敬酒不需要说得多精彩，"感谢+祝福"永远不会错。',
    difficulty: 1
  },

  // ===== 职场生存 =====
  {
    id: 6, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '领导让你周末加班，你已经有安排了',
    sceneFull: '领导让你周末加班，你已经有安排了，怎么拒绝？',
    options: [
      { letter: 'A', text: '好的领导，没问题……（默默取消计划）' },
      { letter: 'B', text: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？' },
      { letter: 'C', text: '我不管，周末就是不上班！（直接拒绝）' }
    ],
    correctIndex: 1,
    response: '选A委屈自己，选C太硬。选B说明原因+提供替代方案，让领导有台阶下。',
    bestAnswer: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？',
    technique: '说明原因 + 提供替代方案',
    tips: '拒绝的同时给出解决方案，对方会更愿意接受。',
    difficulty: 2, isHot: true
  },
  {
    id: 7, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '开部门会时领导突然点你名字让你发言',
    sceneFull: '开部门会时，领导突然点你名字让你发表意见，你完全没准备……',
    options: [
      { letter: 'A', text: '嗯……我……没什么想法……（语无伦次）' },
      { letter: 'B', text: '不好意思打断一下，我刚才在整理思路，我有几点想补充……' },
      { letter: 'C', text: '我还没想好，等我想好了再说。（沉默）' }
    ],
    correctIndex: 1,
    response: '选A和C都显得不上心。选B用"不好意思打断"争取了思考时间，又展现了积极性。',
    bestAnswer: '不好意思打断一下，我刚才在梳理几个关键点，有几点想补充：第一……',
    technique: '争取缓冲时间 + 先认同再补充',
    tips: '如果真没想法，可以说"我想先听听大家的意见，稍后做一个总结"。',
    difficulty: 3
  },
  {
    id: 8, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '领导当着全办公室批评你的方案',
    sceneFull: '领导当着全办公室的人批评你的方案，你觉得很丢脸……',
    options: [
      { letter: 'A', text: '（低头不说话，心里很难受）' },
      { letter: 'B', text: '好的领导，您说得对，我马上修改，XX时间前给您新版本。' },
      { letter: 'C', text: '我觉得我的方案没问题啊，是你们理解错了！（反驳）' }
    ],
    correctIndex: 1,
    response: '选A太懦弱，选C只会更糟。选B先接受+给出行动承诺，面子可以后面找回来。',
    bestAnswer: '好的领导，您说得对，我马上修改，XX时间前给您新版本。',
    technique: '先接受 + 行动承诺',
    tips: '公开接受、私下讨论，如果觉得批评不公，事后单独沟通。',
    difficulty: 3
  },
  {
    id: 9, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '同事把本该他做的工作甩给你',
    sceneFull: '同事把本该他做的工作甩给你，你怎么拒绝又不伤和气？',
    options: [
      { letter: 'A', text: '好吧……我帮你做……（默默接手）' },
      { letter: 'B', text: '我手头也有事在赶，要不咱们一起找领导协调下分工？' },
      { letter: 'C', text: '这是你的工作，凭什么给我做？（直接拒绝）' }
    ],
    correctIndex: 1,
    response: '选A以后更频繁，选C伤和气。选B陈述困难+提供协商途径，把矛盾转移到流程层面。',
    bestAnswer: '我手头也有事在赶，要不咱们一起找领导协调下分工？',
    technique: '陈述客观困难 + 提供协商途径',
    tips: '把矛盾从"你我之间"转移到"流程层面"，找领导协调最合理。',
    difficulty: 2
  },
  {
    id: 10, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '年终述职轮到你脑子一片空白',
    sceneFull: '年终述职，其他人都说了很多，轮到你脑子一片空白……',
    options: [
      { letter: 'A', text: '嗯……我……今年就是做了些日常工作……（草草结束）' },
      { letter: 'B', text: '我主要从三个方面来总结：一是完成的项目，二是学到的东西，三是明年的计划。' },
      { letter: 'C', text: '前面都说完了，我也没什么好补充的了。（放弃）' }
    ],
    correctIndex: 1,
    response: '选A和C都浪费了展示机会。选B用框架式表达，有条理永远胜过长篇大论。',
    bestAnswer: '我主要从三个方面来总结：一是完成的项目，二是学到的东西，三是明年的计划。',
    technique: '框架式表达',
    tips: '有框架的表达永远胜过没结构的长篇大论。先给框架，再逐项展开。',
    difficulty: 3
  },
  {
    id: 11, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '新入职第一天不知道怎么融入',
    sceneFull: '新入职第一天，同事都已经在聊天了，你不知道怎么融入……',
    options: [
      { letter: 'A', text: '（坐在工位上玩手机，等别人来搭话）' },
      { letter: 'B', text: '大家好，我是新来的XX，以后多多关照！中午一起吃饭吗？' },
      { letter: 'C', text: '（强行加入别人的聊天）你们在聊什么啊？' }
    ],
    correctIndex: 1,
    response: '选A太被动，选C太突兀。选B主动介绍+自然邀约，找到一个切入点就够了。',
    bestAnswer: '大家好，我是新来的XX，以后多多关照！中午一起吃饭吗？',
    technique: '主动介绍 + 自然邀约',
    tips: '不需要强行融入所有话题，找到一个切入点就够了。"吃饭"是最没压力的社交。',
    difficulty: 1, isNew: true
  },
  {
    id: 12, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '领导在群里@你问进度你还没做完',
    sceneFull: '领导在群里@你问进度，你还没做完，怎么回复？',
    options: [
      { letter: 'A', text: '（假装没看到，等做完再回）' },
      { letter: 'B', text: '领导，目前完成了XX部分，还剩XX，预计XX时间完成。' },
      { letter: 'C', text: '还没做完，我尽快。（简短回复）' }
    ],
    correctIndex: 1,
    response: '选A领导更焦虑，选C太含糊。选B给出进度三要素：已完成+剩余+预计时间，让领导安心。',
    bestAnswer: '领导，目前完成了XX部分，还剩XX，预计XX时间完成。',
    technique: '进度汇报三要素',
    tips: '主动汇报永远比被动追问好，即使进度不如预期，"有计划"也让人安心。',
    difficulty: 2
  },

  // ===== 恋爱沟通 =====
  {
    id: 13, categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '暗恋的人问"你为什么对我这么好"',
    sceneFull: '暗恋的人问"你为什么对我这么好？"，你的心跳加速了……',
    options: [
      { letter: 'A', text: '没有啊，我对谁都这样……（否认）' },
      { letter: 'B', text: '因为你值得啊～（微笑直视对方）' },
      { letter: 'C', text: '因为我喜欢你！一直都喜欢！（突然表白）' }
    ],
    correctIndex: 1,
    response: '选A让对方失望，选C太冒进可能吓到对方。选B真诚不越界，暧昧中留有余地。',
    bestAnswer: '因为你值得啊～（微笑直视对方）',
    technique: '真诚不越界 + 留有余地',
    tips: '暧昧期的最佳状态是"双方都心照不宣"，不必急着捅破窗户纸。',
    difficulty: 2, isHot: true
  },
  {
    id: 14, categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '和对象吵架对方说"你从来都不关心我"',
    sceneFull: '和对象吵架，对方说"你从来都不关心我！"，你觉得很委屈……',
    options: [
      { letter: 'A', text: '我怎么不关心了？我天天为你做这做那的！（反驳）' },
      { letter: 'B', text: '听到你这么说我很心疼，是不是我最近哪里忽略了你的感受？' },
      { letter: 'C', text: '行行行，你说的都对，行了吧？（赌气）' }
    ],
    correctIndex: 1,
    response: '选A激化矛盾，选C赌气更伤人。选B先共情+再询问，让对方说出真实需求。',
    bestAnswer: '听到你这么说我很心疼，是不是我最近哪里忽略了你的感受？',
    technique: '先共情 + 再询问',
    tips: '吵架不是辩论赛，赢了道理输了感情才是最大的输。',
    difficulty: 3
  },
  {
    id: 15, categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '想表白但怕被拒绝连朋友都做不了',
    sceneFull: '想表白但怕被拒绝连朋友都做不了，你犹豫了很久……',
    options: [
      { letter: 'A', text: '（继续暗恋，什么都不说）' },
      { letter: 'B', text: '其实我挺喜欢你的，不管你的答案是什么，我都珍惜我们的关系。' },
      { letter: 'C', text: '我喜欢你！你要是不答应就算了！（强硬）' }
    ],
    correctIndex: 1,
    response: '选A永远没机会，选C给对方压力太大。选B真诚表达+给出退路，让对方没有负担。',
    bestAnswer: '其实我挺喜欢你的，不管你的答案是什么，我都珍惜我们的关系。',
    technique: '真诚表达 + 退路保障',
    tips: '最好的表白不是"请你接受我"，而是"我告诉你我的心意，你不必有负担"。',
    difficulty: 3
  },
  {
    id: 16, categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '对方不回消息你很焦虑',
    sceneFull: '发了消息对方半天没回，你开始胡思乱想……',
    options: [
      { letter: 'A', text: '（连续发好几条：在吗？怎么了？是不是我哪说错了？）' },
      { letter: 'B', text: '（先去做自己的事，等对方回复再说）' },
      { letter: 'C', text: '不回就拉倒，我也不会再发了！（赌气删聊天记录）' }
    ],
    correctIndex: 1,
    response: '选A暴露焦虑，选C直接破坏关系。选B给彼此空间，不回消息有无数种原因，不一定是你的问题。',
    bestAnswer: '（先去做自己的事，等对方回复再说）',
    technique: '给彼此空间 + 不过度解读',
    tips: '不回消息有无数种原因，不一定是你的问题。你的世界不应该围着一条消息转。',
    difficulty: 1
  },

  // ===== 校园生活 =====
  {
    id: 17, categoryId: 4, categoryName: '校园生活', categoryTag: '🎓 校园生活',
    scene: '开学自我介绍不知道说什么',
    sceneFull: '开学第一天，老师让大家轮流自我介绍，轮到你了……',
    options: [
      { letter: 'A', text: '嗯……我叫XX……没什么好说的……（草草结束）' },
      { letter: 'B', text: '大家好，我是XX，喜欢XX，希望能交到志同道合的朋友！' },
      { letter: 'C', text: '（站起来一句话不说，坐下去）' }
    ],
    correctIndex: 1,
    response: '选A和C都浪费了让别人认识你的机会。选B用三段式结构：名字+爱好+期待，简单有效。',
    bestAnswer: '大家好，我是XX，喜欢XX，希望能交到志同道合的朋友！',
    technique: '名字+爱好+期待 三段式',
    tips: '自我介绍的核心目的不是展示多优秀，而是让别人有理由跟你说话。',
    difficulty: 1
  },
  {
    id: 18, categoryId: 4, categoryName: '校园生活', categoryTag: '🎓 校园生活',
    scene: '小组作业有人划水怎么处理',
    sceneFull: '小组作业有人划水，你想说但又怕影响关系……',
    options: [
      { letter: 'A', text: '（默默把TA的部分也做了）' },
      { letter: 'B', text: '我们分下工吧，你擅长哪块？咱们各自认领，效率更高～' },
      { letter: 'C', text: '你再不做事我就跟老师说！（威胁）' }
    ],
    correctIndex: 1,
    response: '选A以后更严重，选C太对抗。选B不指责+明确分工，让对方有选择权。',
    bestAnswer: '我们分下工吧，你擅长哪块？咱们各自认领，效率更高～',
    technique: '不指责 + 明确分工',
    tips: '与其抱怨划水，不如建立机制让每个人有明确责任。',
    difficulty: 2
  },
  {
    id: 19, categoryId: 4, categoryName: '校园生活', categoryTag: '🎓 校园生活',
    scene: '上课被老师点名回答问题不会',
    sceneFull: '上课被老师突然点名回答问题，你完全不知道答案……',
    options: [
      { letter: 'A', text: '（站起来沉默，等老师让你坐下）' },
      { letter: 'B', text: '老师，这个问题我确实不太确定，我的初步想法是……但可能需要再思考。' },
      { letter: 'C', text: '我不知道。（直接坐下）' }
    ],
    correctIndex: 1,
    response: '选A和C都让老师觉得你不在听课。选B诚实+尝试+态度，老师看的是态度不是答案。',
    bestAnswer: '老师，这个问题我确实不太确定，我的初步想法是……但可能需要再思考。',
    technique: '诚实 + 尝试 + 态度',
    tips: '老师点名的目的不是考倒你，而是确认你有在听课和思考。',
    difficulty: 1, isNew: true
  },
  {
    id: 20, categoryId: 4, categoryName: '校园生活', categoryTag: '🎓 校园生活',
    scene: '宿舍室友很吵影响休息',
    sceneFull: '宿舍室友晚上很吵，影响你休息，但你不想搞僵关系……',
    options: [
      { letter: 'A', text: '（忍着不说，戴耳机默默忍受）' },
      { letter: 'B', text: '小伙伴，我明天有早课，能不能稍微小声点？谢谢啦～' },
      { letter: 'C', text: '你们能不能安静点！都几点了！（发火）' }
    ],
    correctIndex: 1,
    response: '选A长期痛苦，选C太伤关系。选B温和表达需求+给出理由+感谢，对方一般都会配合。',
    bestAnswer: '小伙伴，我明天有早课，能不能稍微小声点？谢谢啦～',
    technique: '温和表达需求 + 给出理由 + 感谢',
    tips: '宿舍矛盾最好的方式是"先温和后升级"，不要一开始就撕破脸。',
    difficulty: 1
  },

  // ===== 日常人际 =====
  {
    id: 21, categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '别人夸你"你真厉害"',
    sceneFull: '别人夸你"你真厉害"，你除了说"没有没有"就不知道说什么了……',
    options: [
      { letter: 'A', text: '没有没有，我真的不行……（继续否定）' },
      { letter: 'B', text: '谢谢！被你这么一说好开心～你也很厉害啊！' },
      { letter: 'C', text: '那当然，我可是最厉害的！（骄傲）' }
    ],
    correctIndex: 1,
    response: '选A让夸你的人尴尬，选C太自大。选B大方接受+回夸对方，接受赞美不是自大。',
    bestAnswer: '谢谢！被你这么一说好开心～你也很厉害啊！',
    technique: '接受赞美 + 回夸对方',
    tips: '接受赞美不是自大，是对赞美者的尊重。否定自己反而让夸你的人尴尬。',
    difficulty: 1, isHot: true
  },
  {
    id: 22, categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '朋友借钱你不想借怎么拒绝',
    sceneFull: '朋友找你借钱，你不想借但又怕伤了感情……',
    options: [
      { letter: 'A', text: '好吧……借你多少……（勉强答应）' },
      { letter: 'B', text: '我理解你现在的困难，不过我最近手头也不太方便，要不帮你想想其他办法？' },
      { letter: 'C', text: '不借，我的钱凭什么借给你？（直接拒绝）' }
    ],
    correctIndex: 1,
    response: '选A委屈自己，选C伤感情。选B理解+拒绝+替代方案，拒绝的是"借钱"不是"你"。',
    bestAnswer: '我理解你现在的困难，不过我最近手头也不太方便，要不帮你想想其他办法？',
    technique: '理解 + 拒绝 + 替代方案',
    tips: '拒绝的是"借钱这件事"，不是"你这个人"，两者分开处理。',
    difficulty: 2
  },
  {
    id: 23, categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '朋友总是迟到让你等很久',
    sceneFull: '朋友又迟到了，你已经等了半小时，心里很不爽……',
    options: [
      { letter: 'A', text: '没事没事，我也刚到……（忍着不说）' },
      { letter: 'B', text: '哈哈你终于来了～下次迟到要请客哦！' },
      { letter: 'C', text: '你怎么每次都迟到？我的时间不是时间吗？（发火）' }
    ],
    correctIndex: 1,
    response: '选A积怨，选C太重。选B轻松表达不满+建立规则，用玩笑化解但不放过。',
    bestAnswer: '哈哈你终于来了～下次迟到要请客哦！',
    technique: '轻松表达不满 + 建立规则',
    tips: '与其忍着不说然后内心积怨，不如用开玩笑的方式让对方意识到问题。',
    difficulty: 1
  },
  {
    id: 24, categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '邻居半夜噪音很大',
    sceneFull: '邻居半夜噪音很大，已经影响到你休息了……',
    options: [
      { letter: 'A', text: '（忍着不说，翻来覆去睡不着）' },
      { letter: 'B', text: '您好，不好意思打扰了，我这边隔音不太好，能不能稍微小声一点？非常感谢！' },
      { letter: 'C', text: '（直接报警或者砸墙）' }
    ],
    correctIndex: 1,
    response: '选A自己受罪，选C太极端。选B礼貌表达需求，大多数人会配合。',
    bestAnswer: '您好，不好意思打扰了，我这边隔音不太好，能不能稍微小声一点？非常感谢！',
    technique: '礼貌表达 + 说明原因 + 感谢',
    tips: '邻里关系是长期关系，一开始就温和处理比事后翻脸好得多。',
    difficulty: 2
  },

  // ===== 亲戚应酬 =====
  {
    id: 25, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '过年亲戚问"一个月工资多少啊？"',
    sceneFull: '过年亲戚问"一个月工资多少啊？"你不想说……',
    options: [
      { letter: 'A', text: '（尴尬）就……就那样吧……勉强够花……' },
      { letter: 'B', text: '哈哈，够吃够喝的～您呢，最近身体还好吧？' },
      { letter: 'C', text: '问这个干嘛？这是个人隐私！（直接回怼）' }
    ],
    correctIndex: 1,
    response: '选A很尴尬，选C太伤和气。选B模糊回应+转移话题，说了又等于没说。',
    bestAnswer: '哈哈，够吃够喝的～您呢，最近身体还好吧？',
    technique: '模糊回应 + 转移话题',
    tips: '不想回答的问题，最好的方式是"答非所问+转移焦点"，比直接拒绝更体面。',
    difficulty: 1, isHot: true
  },
  {
    id: 26, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '过年长辈劝酒你不想喝',
    sceneFull: '过年聚餐，长辈一直劝你喝酒，你不喝好像不给他面子……',
    options: [
      { letter: 'A', text: '（勉强喝了一杯又一杯……）' },
      { letter: 'B', text: '谢谢叔叔心意！我最近在吃药/开车，以茶代酒敬您，祝您身体健康！' },
      { letter: 'C', text: '我不喝，别劝了。（态度强硬）' }
    ],
    correctIndex: 1,
    response: '选A伤身体，选C伤和气。选B感谢心意+不可抗力+替代表达，面子给到了喝什么都一样。',
    bestAnswer: '谢谢叔叔心意！我最近在吃药/开车，以茶代酒敬您，祝您身体健康！',
    technique: '感谢心意 + 不可抗力 + 替代表达',
    tips: '在中国式社交中，面子比酒精重要，只要面子给到了，喝什么都一样。',
    difficulty: 2
  },
  {
    id: 27, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '过年亲戚催婚你很烦',
    sceneFull: '过年亲戚又开始催婚："你都这么大了怎么还不找对象？"……',
    options: [
      { letter: 'A', text: '嗯……在找了在找了……（敷衍）' },
      { letter: 'B', text: '哈哈，宁缺毋滥嘛～您放心，有好的一定第一个告诉您！' },
      { letter: 'C', text: '我结不结婚关你什么事？（翻脸）' }
    ],
    correctIndex: 1,
    response: '选A敷衍下次还催，选C太伤和气。选B幽默化解+给出承诺，理解对方出发点是关心。',
    bestAnswer: '哈哈，宁缺毋滥嘛～您放心，有好的一定第一个告诉您！',
    technique: '幽默化解 + 给出承诺',
    tips: '催婚不是攻击，理解对方出发点后用幽默化解，比硬刚更舒服。',
    difficulty: 1
  },
  {
    id: 28, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '亲戚家熊孩子弄坏了你的东西',
    sceneFull: '亲戚家的熊孩子弄坏了你心爱的东西，家长还在旁边笑……',
    options: [
      { letter: 'A', text: '（忍了，算了算了，小孩子不懂事）' },
      { letter: 'B', text: '哎呀这个对我很重要呢～宝贝下次要小心哦，叔叔/阿姨这个不能碰哦！' },
      { letter: 'C', text: '你怎么管孩子的？赔我！（发火）' }
    ],
    correctIndex: 1,
    response: '选A太委屈，选C太伤和气。选B温和表达重要性+给孩子立规矩，既不翻脸也表明态度。',
    bestAnswer: '哎呀这个对我很重要呢～宝贝下次要小心哦，叔叔/阿姨这个不能碰哦！',
    technique: '温和表达 + 给孩子立规矩',
    tips: '对熊孩子的问题，"对孩子说"比对"家长说"更有效，不伤大人面子。',
    difficulty: 2
  },
  {
    id: 29, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '亲戚拿你和别人家孩子比较',
    sceneFull: '亲戚说："你看看人家XX，年纪轻轻就当上了经理/买了房/结了婚……"',
    options: [
      { letter: 'A', text: '（低头不说话，心里很不是滋味）' },
      { letter: 'B', text: '哈哈，每个人节奏不一样嘛～我现在也挺好的，有自己的小目标！' },
      { letter: 'C', text: '那你去认他当侄子吧！（阴阳怪气）' }
    ],
    correctIndex: 1,
    response: '选A自我否定，选C伤和气。选B温和表明态度——我有我的人生节奏，不比较。',
    bestAnswer: '哈哈，每个人节奏不一样嘛～我现在也挺好的，有自己的小目标！',
    technique: '温和表明态度 + 不比较',
    tips: '比较是永远的，但你的价值不需要通过比较来证明。',
    difficulty: 2
  },

  // ===== 更多职场题 =====
  {
    id: 30, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '同事背后说你坏话被你知道了',
    sceneFull: '你无意中听到同事在背后议论你，说了些不好听的话……',
    options: [
      { letter: 'A', text: '（假装没听到，但心里很受伤）' },
      { letter: 'B', text: '（找个合适时机私下跟对方聊）我听到你说了XX，我想了解下是不是有什么误会？' },
      { letter: 'C', text: '（当众质问）你为什么在背后说我坏话？！' }
    ],
    correctIndex: 1,
    response: '选A心里憋屈，选C太冲动。选B私下沟通+了解原因，大多数背后议论源于误会。',
    bestAnswer: '我听到你说了XX，我想了解下是不是有什么误会？',
    technique: '私下沟通 + 了解原因',
    tips: '背后议论往往源于信息差，私下沟通比当众对质更能解决问题。',
    difficulty: 3, isNew: true
  },
  {
    id: 31, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '电梯里遇到大领导不知道说什么',
    sceneFull: '电梯里只有你和大领导，空气突然凝固了……',
    options: [
      { letter: 'A', text: '（低头看手机，假装很忙）' },
      { letter: 'B', text: 'X总好！最近XX项目进展不错，我们团队正在努力推进。' },
      { letter: 'C', text: 'X总，您觉得公司的战略方向是什么？（突然问大问题）' }
    ],
    correctIndex: 1,
    response: '选A浪费了曝光机会，选C太突兀。选B简单打招呼+提一下工作进展，展示存在感。',
    bestAnswer: 'X总好！最近XX项目进展不错，我们团队正在努力推进。',
    technique: '简单打招呼 + 展示存在感',
    tips: '电梯聊天不是汇报，10-30秒的简短交流就够了。展示你在认真做事就好。',
    difficulty: 1
  },
  {
    id: 32, categoryId: 1, categoryName: '职场生存', categoryTag: '🏢 职场生存',
    scene: '团建不想去但怕同事觉得你不合群',
    sceneFull: '公司团建，你实在不想去，但又怕同事觉得你不合群……',
    options: [
      { letter: 'A', text: '（勉强去了，全程玩手机很痛苦）' },
      { letter: 'B', text: '谢谢组织！我那天刚好有事，下次一定参加！祝大家玩得开心～' },
      { letter: 'C', text: '团建有啥好去的，我才不去。（直接拒绝）' }
    ],
    correctIndex: 1,
    response: '选A痛苦且无效果，选C太直接。选B感谢+有理由+期待下次，给人"想去但去不了"的感觉。',
    bestAnswer: '谢谢组织！我那天刚好有事，下次一定参加！祝大家玩得开心～',
    technique: '感谢 + 有理由 + 期待下次',
    tips: '不想参加的活动，关键是"态度积极但客观去不了"，而不是"不想去"。',
    difficulty: 1
  },

  // ===== 更多社交聚会题 =====
  {
    id: 33, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '朋友请客吃饭你不知道聊什么',
    sceneFull: '朋友请客吃饭，桌上好多你不认识的人，你不知道聊什么……',
    options: [
      { letter: 'A', text: '（全程安静吃饭，等人来搭话）' },
      { letter: 'B', text: '这道菜好好吃！是谁点的？你也喜欢这个口味吗？（聊食物）' },
      { letter: 'C', text: '（强行找话题）你们觉得人生的意义是什么？' }
    ],
    correctIndex: 1,
    response: '选A太被动，选C太突兀。选B从眼前的食物切入，最自然、最没有压力的话题。',
    bestAnswer: '这道菜好好吃！是谁点的？你也喜欢这个口味吗？',
    technique: '从眼前事物切入',
    tips: '不知道聊什么的时候，从眼前的食物、环境、天气切入，最自然。',
    difficulty: 1, isNew: true
  },
  {
    id: 34, categoryId: 2, categoryName: '社交聚会', categoryTag: '🎉 社交聚会',
    scene: '被人说"你怎么总是不说话"',
    sceneFull: '又有人说"你怎么总是不说话？"你已经很努力在社交了……',
    options: [
      { letter: 'A', text: '（更沉默了，不想说话了）' },
      { letter: 'B', text: '我话不多但句句精品嘛～来，你继续，我听着呢！' },
      { letter: 'C', text: '你话太多了，让我没法说话。（反击）' }
    ],
    correctIndex: 1,
    response: '选A更委屈，选C太对抗。选B用自嘲化解+表明在参与，不卑不亢。',
    bestAnswer: '我话不多但句句精品嘛～来，你继续，我听着呢！',
    technique: '自嘲化解 + 表明参与',
    tips: '内向不是缺点，不必为此道歉，但也要让对方知道你在参与。',
    difficulty: 2
  },

  // ===== 更多恋爱沟通题 =====
  {
    id: 35, categoryId: 3, categoryName: '恋爱沟通', categoryTag: '💕 恋爱沟通',
    scene: '被喜欢的人拒绝了怎么回应',
    sceneFull: '你表白了，但对方说"我觉得我们还是做朋友比较好"……',
    options: [
      { letter: 'A', text: '（尴尬到不行，以后再也不联系了）' },
      { letter: 'B', text: '我理解，谢谢你的坦诚。那我们继续做朋友吧，希望以后不会尴尬～' },
      { letter: 'C', text: '你为什么不喜欢我？我哪里不够好？（追问）' }
    ],
    correctIndex: 1,
    response: '选A失去一个朋友，选C给对方压力。选B尊重对方选择+保持友好，体面地接受拒绝。',
    bestAnswer: '我理解，谢谢你的坦诚。那我们继续做朋友吧，希望以后不会尴尬～',
    technique: '尊重选择 + 保持友好',
    tips: '被拒绝不代表你不好，只是不合适。体面地接受拒绝，反而更让人尊重。',
    difficulty: 3
  },

  // ===== 更多校园题 =====
  {
    id: 36, categoryId: 4, categoryName: '校园生活', categoryTag: '🎓 校园生活',
    scene: '社团面试自我介绍紧张到发抖',
    sceneFull: '社团面试，让你做自我介绍，你紧张到声音发抖……',
    options: [
      { letter: 'A', text: '（紧张到说不出话，草草结束）' },
      { letter: 'B', text: '有点紧张哈，但我真的很想加入！我是XX，喜欢XX，希望能在这里学到更多！' },
      { letter: 'C', text: '（背了一大段准备好的稿子，毫无感情）' }
    ],
    correctIndex: 1,
    response: '选A太紧张失了印象，选C像机器人。选B坦诚紧张+展现热情，面试官也是过来人。',
    bestAnswer: '有点紧张哈，但我真的很想加入！我是XX，喜欢XX，希望能在这里学到更多！',
    technique: '坦诚紧张 + 展现热情',
    tips: '承认紧张比装淡定更真实，面试官也是过来人，他们理解你的紧张。',
    difficulty: 1
  },

  // ===== 更多日常人际题 =====
  {
    id: 37, categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '不想参加的社交活动怎么拒绝',
    sceneFull: '朋友约你出去，但你今天就是不想出门，怎么拒绝？',
    options: [
      { letter: 'A', text: '好吧……那我出去吧……（勉强出门）' },
      { letter: 'B', text: '今天有点累想在家休息，下次我请你！咱们改天约～' },
      { letter: 'C', text: '不想出门，别约我了。（冷漠）' }
    ],
    correctIndex: 1,
    response: '选A委屈自己，选C太冷漠。选B说明原因+主动约下次，让对方知道你不是不想见TA。',
    bestAnswer: '今天有点累想在家休息，下次我请你！咱们改天约～',
    technique: '说明原因 + 主动约下次',
    tips: '拒绝邀请的关键是让对方知道"不是不想见你，是今天不方便"。',
    difficulty: 1
  },
  {
    id: 38, categoryId: 5, categoryName: '日常人际', categoryTag: '🛒 日常人际',
    scene: '被人打断说话很生气',
    sceneFull: '你正在说话，被人打断了，你很生气但不想发火……',
    options: [
      { letter: 'A', text: '（忍了，等对方说完自己也不想说了）' },
      { letter: 'B', text: '稍等稍等，让我先说完这个点～然后你再说！' },
      { letter: 'C', text: '你能不能别打断我？！（生气）' }
    ],
    correctIndex: 1,
    response: '选A永远没发言权，选C太对抗。选B温和但坚定地夺回话语权，表明"我还没说完"。',
    bestAnswer: '稍等稍等，让我先说完这个点～然后你再说！',
    technique: '温和夺回话语权',
    tips: '被打断不要忍，也不要怒。轻松地说"让我先说完"，大多数人会意识到并道歉。',
    difficulty: 2
  },

  // ===== 更多亲戚应酬题 =====
  {
    id: 39, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '亲戚问"什么时候生孩子"',
    sceneFull: '你已经结婚了，亲戚追问"什么时候要孩子啊？趁年轻赶紧生！"',
    options: [
      { letter: 'A', text: '嗯……在准备了在准备了……（尴尬敷衍）' },
      { letter: 'B', text: '哈哈，这个得看缘分～有了第一时间告诉您！来，吃菜吃菜！' },
      { letter: 'C', text: '生不生是我自己的事！（翻脸）' }
    ],
    correctIndex: 1,
    response: '选A敷衍下次还问，选C太伤和气。选B用"缘分"模糊回应+主动转移话题到吃菜上。',
    bestAnswer: '哈哈，这个得看缘分～有了第一时间告诉您！来，吃菜吃菜！',
    technique: '模糊回应 + 主动转移话题',
    tips: '对亲戚的追问，越认真回答越追问。模糊回应+转移话题是最有效的方式。',
    difficulty: 2
  },
  {
    id: 40, categoryId: 6, categoryName: '亲戚应酬', categoryTag: '🧧 亲戚应酬',
    scene: '过年给压岁钱推来推去',
    sceneFull: '过年亲戚给你压岁钱，你妈说"不用不用"，亲戚硬塞，你不知道该不该接……',
    options: [
      { letter: 'A', text: '（跟着妈妈说不用，但心里想要）' },
      { letter: 'B', text: '谢谢叔叔/阿姨！那我就收下啦～祝您新年快乐！' },
      { letter: 'C', text: '（一把抢过来揣兜里）' }
    ],
    correctIndex: 1,
    response: '选A太拘束，选C太粗鲁。选B礼貌接受+祝福，大人之间的推来推去是礼节，你礼貌接受就好。',
    bestAnswer: '谢谢叔叔/阿姨！那我就收下啦～祝您新年快乐！',
    technique: '礼貌接受 + 祝福',
    tips: '大人之间的推来推去是礼节，你作为晚辈礼貌接受+祝福就是最得体的方式。',
    difficulty: 1
  }
]

const getTodayDateString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export const useQuizStore = create<QuizState>((set, get) => ({
  categories: CATEGORIES,
  questions: QUESTIONS,
  currentQuestionIndex: 0,
  currentCategoryFilter: null,
  userStats: { practiced: 28, streak: 7, accuracy: 85, favorites: 5 },
  favorites: [],
  answeredQuestions: {},
  showPaymentModal: false,
  isPaid: false,
  dailyFreeCount: 3,
  dailyFreeDate: getTodayDateString(),
  quizPhase: 'scene',
  selectedOption: null,

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setCurrentCategoryFilter: (categoryId) => set({ currentCategoryFilter: categoryId }),
  answerQuestion: (questionId, isCorrect) => {
    const state = get()
    const newAnswered = { ...state.answeredQuestions, [questionId]: isCorrect }
    const totalAnswered = Object.keys(newAnswered).length
    const correctCount = Object.values(newAnswered).filter(Boolean).length
    const newAccuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0
    set({
      answeredQuestions: newAnswered,
      userStats: {
        ...state.userStats,
        practiced: totalAnswered,
        accuracy: newAccuracy
      }
    })
  },
  toggleFavorite: (questionId) => {
    const state = get()
    const newFavorites = state.favorites.includes(questionId)
      ? state.favorites.filter((id) => id !== questionId)
      : [...state.favorites, questionId]
    set({ favorites: newFavorites, userStats: { ...state.userStats, favorites: newFavorites.length } })
  },
  setShowPaymentModal: (show) => set({ showPaymentModal: show }),
  setQuizPhase: (phase) => set({ quizPhase: phase }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  selectOption: (optionIndex) => {
    const state = get()
    const question = state.getFilteredQuestions()[state.currentQuestionIndex]
    if (!question) return
    const isCorrect = optionIndex === question.correctIndex
    set({ selectedOption: optionIndex, quizPhase: 'revealed' })
    state.answerQuestion(question.id, isCorrect)
    // Decrease daily free count
    const today = getTodayDateString()
    if (state.dailyFreeDate !== today) {
      set({ dailyFreeDate: today, dailyFreeCount: 2 })
    } else if (state.dailyFreeCount > 0) {
      set({ dailyFreeCount: state.dailyFreeCount - 1 })
    }
  },
  nextQuestion: () => {
    const state = get()
    const filtered = state.getFilteredQuestions()
    const nextIndex = state.currentQuestionIndex + 1
    if (nextIndex < filtered.length) {
      set({ currentQuestionIndex: nextIndex, quizPhase: 'scene', selectedOption: null })
    } else {
      // Loop back to start
      set({ currentQuestionIndex: 0, quizPhase: 'scene', selectedOption: null })
    }
  },
  startQuiz: () => {
    set({ quizPhase: 'selecting', selectedOption: null })
  },
  getFilteredQuestions: () => {
    const state = get()
    if (state.currentCategoryFilter === null || state.currentCategoryFilter === 0) return state.questions
    return state.questions.filter((q) => q.categoryId === state.currentCategoryFilter)
  },
  getTodayQuestion: () => {
    const state = get()
    const today = new Date()
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    )
    const index = dayOfYear % state.questions.length
    return state.questions[index]
  },
  getCategoryQuestions: (categoryId) => {
    return get().questions.filter((q) => q.categoryId === categoryId)
  },
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
  }
}))
