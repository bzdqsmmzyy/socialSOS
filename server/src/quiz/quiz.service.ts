import { Injectable } from '@nestjs/common';
import { CategoryDto, QuizQuestionDto } from './quiz.dto';

const CATEGORIES: CategoryDto[] = [
  { id: 1, name: '职场生存', emoji: '🏢', count: 50, description: '被领导批评、开会发言、同事甩锅…' },
  { id: 2, name: '社交聚会', emoji: '🎉', count: 40, description: '聚会插不上话、敬酒、被问隐私…' },
  { id: 3, name: '恋爱沟通', emoji: '💕', count: 30, description: '暗恋开口、表白、吵架处理…' },
  { id: 4, name: '校园生活', emoji: '🎓', count: 30, description: '自我介绍、小组作业、被点名…' },
  { id: 5, name: '日常人际', emoji: '🛒', count: 30, description: '被夸、拒绝、沟通技巧…' },
  { id: 6, name: '亲戚应酬', emoji: '🧧', count: 20, description: '过年被问、催婚、长辈劝酒…' }
];

const QUESTIONS: QuizQuestionDto[] = [
  {
    id: 1, categoryId: 2, categoryName: '社交聚会', categoryEmoji: '🎉',
    scene: '聚会上有人问"你怎么这么安静啊？"',
    sceneFull: '聚会上，有人当着大家的面问你：\n\n"你怎么这么安静啊？都不怎么说话。"\n\n所有人都在看你，空气突然安静了……',
    hint: '选一个你会说的答案（别紧张，选错了也没关系）',
    options: [
      { letter: 'A', text: '嗯……我就是比较内向，不太会说话……（低头沉默）' },
      { letter: 'B', text: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～' },
      { letter: 'C', text: '是吗？可能是我们不熟吧，熟了你就知道我话多了（翻白眼）' }
    ],
    correctIndex: 1,
    bestAnswer: '哈哈，我在认真听你们聊呢，你们太精彩了我都插不上嘴～',
    technique: '💡 技巧：用自嘲化解 + 先夸对方',
    analysis: '这句话巧妙地化解了尴尬：\n\n① 不否定自己——没有承认"我不爱说话"\n② 夸了在场的人——"你们太精彩了"让大家都舒服\n③ 解释了原因——不是我不说话，是你们聊得太好了\n④ 语气轻松——"哈哈"开头拉近距离，不沉重\n\n核心心法：把"我不够好"转化为"你们很好"，气氛瞬间就轻松了。',
    difficulty: 2, isHot: true
  },
  {
    id: 2, categoryId: 2, categoryName: '社交聚会', categoryEmoji: '🎉',
    scene: '同事当众开你的玩笑，大家都笑了',
    sceneFull: '同事当众开你的玩笑，大家都笑了，但你并不觉得好笑……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（强颜欢笑）哈哈是挺搞笑的……' },
      { letter: 'B', text: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）' },
      { letter: 'C', text: '你来一个试试？你自己被开玩笑开心吗？（生气）' }
    ],
    correctIndex: 1,
    bestAnswer: '你这个玩笑我可不觉得好笑哦～（微笑但坚定）',
    technique: '💡 技巧：温柔地划清边界',
    analysis: '这个回答的关键在于"温柔但坚定"：\n\n① 没有委屈自己——不强颜欢笑\n② 没有攻击对方——微笑表达善意\n③ 明确表达立场——"我不觉得好笑"\n④ 加了"～"让语气不那么生硬\n\n核心心法：拒绝不必带有敌意，温柔也是一种力量。',
    difficulty: 2
  },
  {
    id: 3, categoryId: 5, categoryName: '日常人际', categoryEmoji: '🛒',
    scene: '别人夸你"你真厉害"',
    sceneFull: '别人夸你"你真厉害"，你除了说"没有没有"就不知道说什么了……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '没有没有，我真的不行……（继续否定）' },
      { letter: 'B', text: '谢谢！被你这么一说好开心～你也很厉害啊！' },
      { letter: 'C', text: '那当然，我可是最厉害的！（骄傲）' }
    ],
    correctIndex: 1,
    bestAnswer: '谢谢！被你这么一说好开心～你也很厉害啊！',
    technique: '💡 技巧：接受赞美 + 回夸对方',
    analysis: '很多人面对夸奖只会否定自己，其实：\n\n① 大方接受——"谢谢"就够了\n② 表达开心——让对方知道ta的话有正面效果\n③ 回夸对方——让气氛更融洽\n\n核心心法：接受赞美不是自大，是对赞美者的尊重。否定自己反而让夸你的人尴尬。',
    difficulty: 1
  },
  {
    id: 4, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '领导让你周末加班，你已经有安排了',
    sceneFull: '领导让你周末加班，你已经有安排了，怎么拒绝？',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '好的领导，没问题……（默默取消计划）' },
      { letter: 'B', text: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？' },
      { letter: 'C', text: '我不管，周末就是不上班！（直接拒绝）' }
    ],
    correctIndex: 1,
    bestAnswer: '领导，我这周末确实有重要安排，下周一我优先处理这个事，可以吗？',
    technique: '💡 技巧：说明原因 + 提供替代方案',
    analysis: '职场拒绝的关键是"拒事不拒人"：\n\n① 不是不配合——而是时间上有冲突\n② 说明原因——有安排是合理的\n③ 提供方案——"下周一优先处理"表明态度\n④ 商量语气——"可以吗？"给领导台阶\n\n核心心法：拒绝的同时给出解决方案，对方会更愿意接受。',
    difficulty: 2, isHot: true
  },
  {
    id: 5, categoryId: 6, categoryName: '亲戚应酬', categoryEmoji: '🧧',
    scene: '过年亲戚问"一个月工资多少啊？"',
    sceneFull: '过年亲戚问"一个月工资多少啊？"你不想说……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（尴尬）就……就那样吧……勉强够花……' },
      { letter: 'B', text: '哈哈，够吃够喝的～您呢，最近身体还好吧？' },
      { letter: 'C', text: '问这个干嘛？这是个人隐私！（直接回怼）' }
    ],
    correctIndex: 1,
    bestAnswer: '哈哈，够吃够喝的～您呢，最近身体还好吧？',
    technique: '💡 技巧：模糊回应 + 转移话题',
    analysis: '面对隐私提问，不必正面回答：\n\n① 模糊带过——"够吃够喝"说了又等于没说\n② 保持礼貌——"哈哈"开头不伤和气\n③ 巧妙转移——关心对方身体状况，话题自然切换\n\n核心心法：不想回答的问题，最好的方式是"答非所问+转移焦点"，比直接拒绝更体面。',
    difficulty: 1, isHot: true
  },
  {
    id: 6, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '开部门会时领导突然点你名字让你发言',
    sceneFull: '开部门会时，领导突然点你名字让你发表意见，你完全没准备……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '嗯……我……没什么想法……（语无伦次）' },
      { letter: 'B', text: '刚才大家的想法很好，我补充一点：我觉得可以从XX角度考虑……' },
      { letter: 'C', text: '我还没想好，等我想好了再说。（沉默）' }
    ],
    correctIndex: 1,
    bestAnswer: '刚才大家的想法很好，我补充一点：我觉得可以从XX角度考虑……',
    technique: '💡 技巧：借力打力 + 补充式发言',
    analysis: '突然被点名不必慌：\n\n① 先肯定别人——争取思考时间\n② 用"补充"开场——降低发言压力\n③ 提出一个角度——哪怕很小也是有价值的输出\n\n核心心法：不需要完美的发言，只需要有"我在认真参与"的态度。',
    difficulty: 3
  },
  {
    id: 7, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '领导当着全办公室批评你的方案',
    sceneFull: '领导当着全办公室的人批评你的方案，你觉得很丢脸……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（低头不说话，心里很难受）' },
      { letter: 'B', text: '好的领导，您说得对，我马上修改，XX时间前给您新版本。' },
      { letter: 'C', text: '我觉得我的方案没问题啊，是你们理解错了！（反驳）' }
    ],
    correctIndex: 1,
    bestAnswer: '好的领导，您说得对，我马上修改，XX时间前给您新版本。',
    technique: '💡 技巧：先接受 + 行动承诺',
    analysis: '当众被批评确实很难受，但处理方式决定后续影响：\n\n① 不辩解——当众辩解只会更尴尬\n② 承认问题——展现职业素养\n③ 给出行动——"马上修改"+"时间节点"显得靠谱\n④ 私下沟通——如果觉得批评不公，事后单独聊\n\n核心心法：公开接受、私下讨论，面子可以后面找回来。',
    difficulty: 3
  },
  {
    id: 8, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '同事把本该他做的工作甩给你',
    sceneFull: '同事把本该他做的工作甩给你，你怎么拒绝又不伤和气？',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '好吧……我帮你做……（默默接手）' },
      { letter: 'B', text: '我手头也有事在赶，要不咱们一起找领导协调下分工？' },
      { letter: 'C', text: '这是你的工作，凭什么给我做？（直接拒绝）' }
    ],
    correctIndex: 1,
    bestAnswer: '我手头也有事在赶，要不咱们一起找领导协调下分工？',
    technique: '💡 技巧：陈述客观困难 + 提供协商途径',
    analysis: '同事甩锅最忌两种极端：\n\n① 全盘接受——以后会更频繁\n② 直接撕破脸——影响后续合作\n③ 正确做法——"我有困难"+"一起协商"\n\n核心心法：把矛盾从"你我之间"转移到"流程层面"，找领导协调是最合理的方式。',
    difficulty: 2
  },
  {
    id: 9, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '年终述职轮到你脑子一片空白',
    sceneFull: '年终述职，其他人都说了很多，轮到你脑子一片空白……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '嗯……我……今年就是做了些日常工作……（草草结束）' },
      { letter: 'B', text: '我主要从三个方面来总结：一是完成的项目，二是学到的东西，三是明年的计划。' },
      { letter: 'C', text: '前面都说完了，我也没什么好补充的了。（放弃）' }
    ],
    correctIndex: 1,
    bestAnswer: '我主要从三个方面来总结：一是完成的项目，二是学到的东西，三是明年的计划。',
    technique: '💡 技巧：框架式表达',
    analysis: '述职不是比谁说得多，而是比谁说得有条理：\n\n① 先给框架——"三个方面"让听众有预期\n② 逐项展开——每项挑1-2个亮点\n③ 面向未来——"明年计划"展现主动性\n\n核心心法：有框架的表达永远胜过没结构的长篇大论。',
    difficulty: 3
  },
  {
    id: 10, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '新入职第一天不知道怎么融入',
    sceneFull: '新入职第一天，同事都已经在聊天了，你不知道怎么融入……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（坐在工位上玩手机，等别人来搭话）' },
      { letter: 'B', text: '大家好，我是新来的XX，以后多多关照！中午一起吃饭吗？' },
      { letter: 'C', text: '（强行加入别人的聊天）你们在聊什么啊？' }
    ],
    correctIndex: 1,
    bestAnswer: '大家好，我是新来的XX，以后多多关照！中午一起吃饭吗？',
    technique: '💡 技巧：主动介绍 + 自然邀约',
    analysis: '新人的融入关键在于"主动但不突兀"：\n\n① 主动介绍——别等别人来问\n② 态度友好——"多多关照"给台阶\n③ 自然邀约——"吃饭"是最没压力的社交场景\n\n核心心法：不需要强行融入所有话题，找到一个切入点就够了。',
    difficulty: 1, isNew: true
  },
  {
    id: 11, categoryId: 1, categoryName: '职场生存', categoryEmoji: '🏢',
    scene: '领导在群里@你问进度你还没做完',
    sceneFull: '领导在群里@你问进度，你还没做完，怎么回复？',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（假装没看到，等做完再回）' },
      { letter: 'B', text: '领导，目前完成了XX部分，还剩XX，预计XX时间完成。' },
      { letter: 'C', text: '还没做完，我尽快。（简短回复）' }
    ],
    correctIndex: 1,
    bestAnswer: '领导，目前完成了XX部分，还剩XX，预计XX时间完成。',
    technique: '💡 技巧：进度汇报三要素',
    analysis: '领导问进度，最怕两种回复：沉默和含糊。\n\n① 已完成部分——证明你没有在摸鱼\n② 剩余部分——让领导心里有数\n③ 预计时间——给领导确定感\n\n核心心法：主动汇报永远比被动追问好，即使进度不如预期，"有计划"也让人安心。',
    difficulty: 2
  },
  {
    id: 12, categoryId: 3, categoryName: '恋爱沟通', categoryEmoji: '💕',
    scene: '暗恋的人问"你为什么对我这么好"',
    sceneFull: '暗恋的人问"你为什么对我这么好？"，你的心跳加速了……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '没有啊，我对谁都这样……（否认）' },
      { letter: 'B', text: '因为你值得啊～（微笑直视对方）' },
      { letter: 'C', text: '因为我喜欢你！一直都喜欢！（突然表白）' }
    ],
    correctIndex: 1,
    bestAnswer: '因为你值得啊～（微笑直视对方）',
    technique: '💡 技巧：真诚不越界 + 留有余地',
    analysis: '暧昧期的回答需要拿捏分寸：\n\n① 不否认——否认会让对方失望\n② 不冒进——突然表白可能吓到对方\n③ "你值得"——暧昧中带着真诚\n④ 微笑直视——肢体语言比文字更重要\n\n核心心法：暧昧期的最佳状态是"双方都心照不宣"，不必急着捅破窗户纸。',
    difficulty: 2, isHot: true
  },
  {
    id: 13, categoryId: 3, categoryName: '恋爱沟通', categoryEmoji: '💕',
    scene: '和对象吵架对方说"你从来都不关心我"',
    sceneFull: '和对象吵架，对方说"你从来都不关心我！"，你觉得很委屈……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '我怎么不关心了？我天天为你做这做那的！（反驳）' },
      { letter: 'B', text: '听到你这么说我很心疼，是不是我最近哪里忽略了你的感受？' },
      { letter: 'C', text: '行行行，你说的都对，行了吧？（赌气）' }
    ],
    correctIndex: 1,
    bestAnswer: '听到你这么说我很心疼，是不是我最近哪里忽略了你的感受？',
    technique: '💡 技巧：先共情 + 再询问',
    analysis: '吵架中最忌讳的是"比谁对谁错"：\n\n① 不反驳——反驳只会激化矛盾\n② 表达关心——"心疼"代替"委屈"\n③ 引导倾诉——"哪里忽略了"让对方说出真实需求\n\n核心心法：吵架不是辩论赛，赢了道理输了感情才是最大的输。',
    difficulty: 3
  },
  {
    id: 14, categoryId: 3, categoryName: '恋爱沟通', categoryEmoji: '💕',
    scene: '想表白但怕被拒绝连朋友都做不了',
    sceneFull: '想表白但怕被拒绝连朋友都做不了，你犹豫了很久……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（继续暗恋，什么都不说）' },
      { letter: 'B', text: '其实我挺喜欢你的，不管你的答案是什么，我都珍惜我们的关系。' },
      { letter: 'C', text: '我喜欢你！你要是不答应就算了！（强硬）' }
    ],
    correctIndex: 1,
    bestAnswer: '其实我挺喜欢你的，不管你的答案是什么，我都珍惜我们的关系。',
    technique: '💡 技巧：真诚表达 + 退路保障',
    analysis: '表白的最高境界是让对方没有压力：\n\n① 表达心意——不藏着掖着\n② 给出退路——"不管答案"减少对方压力\n③ 强调关系——"珍惜"表明不是非此即彼\n\n核心心法：最好的表白不是"请你接受我"，而是"我告诉你我的心意，你不必有负担"。',
    difficulty: 3
  },
  {
    id: 15, categoryId: 4, categoryName: '校园生活', categoryEmoji: '🎓',
    scene: '开学自我介绍不知道说什么',
    sceneFull: '开学第一天，老师让大家轮流自我介绍，轮到你了……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '嗯……我叫XX……没什么好说的……（草草结束）' },
      { letter: 'B', text: '大家好，我是XX，喜欢XX，希望能交到志同道合的朋友！' },
      { letter: 'C', text: '（站起来一句话不说，坐下去）' }
    ],
    correctIndex: 1,
    bestAnswer: '大家好，我是XX，喜欢XX，希望能交到志同道合的朋友！',
    technique: '💡 技巧：名字+爱好+期待 三段式',
    analysis: '自我介绍不需要多精彩，有结构就够了：\n\n① 名字——让大家都记住你\n② 爱好——给同好一个搭话的理由\n③ 期待——展现友善和开放\n\n核心心法：自我介绍的核心目的不是展示自己多优秀，而是让别人有理由跟你说话。',
    difficulty: 1
  },
  {
    id: 16, categoryId: 4, categoryName: '校园生活', categoryEmoji: '🎓',
    scene: '小组作业有人划水怎么处理',
    sceneFull: '小组作业有人划水，你想说但又怕影响关系……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（默默把TA的部分也做了）' },
      { letter: 'B', text: '我们分下工吧，你擅长哪块？咱们各自认领，效率更高～' },
      { letter: 'C', text: '你再不做事我就跟老师说！（威胁）' }
    ],
    correctIndex: 1,
    bestAnswer: '我们分下工吧，你擅长哪块？咱们各自认领，效率更高～',
    technique: '💡 技巧：不指责 + 明确分工',
    analysis: '处理划水同学的原则是"对事不对人"：\n\n① 不指责——"划水"是主观判断，直接说会对抗\n② 明确分工——让每个人的任务可追踪\n③ 让对方选——"你擅长哪块"给选择权\n\n核心心法：与其抱怨划水，不如建立机制让每个人有明确责任。',
    difficulty: 2
  },
  {
    id: 17, categoryId: 4, categoryName: '校园生活', categoryEmoji: '🎓',
    scene: '上课被老师点名回答问题不会',
    sceneFull: '上课被老师突然点名回答问题，你完全不知道答案……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（站起来沉默，等老师让你坐下）' },
      { letter: 'B', text: '老师，这个问题我确实不太确定，我的初步想法是……但可能需要再思考。' },
      { letter: 'C', text: '我不知道。（直接坐下）' }
    ],
    correctIndex: 1,
    bestAnswer: '老师，这个问题我确实不太确定，我的初步想法是……但可能需要再思考。',
    technique: '💡 技巧：诚实 + 尝试 + 态度',
    analysis: '被点名不会答，老师看的是态度不是答案：\n\n① 诚实——承认不确定比硬编好\n② 尝试——哪怕想法不成熟也展现思考\n③ 谦虚——"需要再思考"表明你会在意\n\n核心心法：老师点名的目的不是考倒你，而是确认你有在听课和思考。',
    difficulty: 1, isNew: true
  },
  {
    id: 18, categoryId: 5, categoryName: '日常人际', categoryEmoji: '🛒',
    scene: '朋友借钱你不想借怎么拒绝',
    sceneFull: '朋友找你借钱，你不想借但又怕伤了感情……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '好吧……借你多少……（勉强答应）' },
      { letter: 'B', text: '我理解你现在的困难，不过我最近手头也不太方便，要不帮你想想其他办法？' },
      { letter: 'C', text: '不借，我的钱凭什么借给你？（直接拒绝）' }
    ],
    correctIndex: 1,
    bestAnswer: '我理解你现在的困难，不过我最近手头也不太方便，要不帮你想想其他办法？',
    technique: '💡 技巧：理解 + 拒绝 + 替代方案',
    analysis: '拒绝借钱不等于拒绝友谊：\n\n① 先理解——让对方感受到你的关心\n② 说明原因——不是不愿而是不能\n③ 提供帮助——帮找其他办法展现诚意\n\n核心心法：拒绝的是"借钱这件事"，不是"你这个人"，两者分开处理。',
    difficulty: 2
  },
  {
    id: 19, categoryId: 5, categoryName: '日常人际', categoryEmoji: '🛒',
    scene: '朋友总是迟到让你等很久',
    sceneFull: '朋友又迟到了，你已经等了半小时，心里很不爽……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '没事没事，我也刚到……（忍着不说）' },
      { letter: 'B', text: '哈哈你终于来了～下次迟到要请客哦！' },
      { letter: 'C', text: '你怎么每次都迟到？我的时间不是时间吗？（发火）' }
    ],
    correctIndex: 1,
    bestAnswer: '哈哈你终于来了～下次迟到要请客哦！',
    technique: '💡 技巧：轻松表达不满 + 建立规则',
    analysis: '处理朋友的小毛病要"指出但不伤人"：\n\n① 轻松开场——"哈哈"降低对抗感\n② 间接提醒——"终于来了"暗示等了很久\n③ 建立规则——"请客"是友好的惩罚机制\n\n核心心法：与其忍着不说然后内心积怨，不如用开玩笑的方式让对方意识到问题。',
    difficulty: 1
  },
  {
    id: 20, categoryId: 6, categoryName: '亲戚应酬', categoryEmoji: '🧧',
    scene: '过年长辈劝酒你不想喝',
    sceneFull: '过年聚餐，长辈一直劝你喝酒，你不喝好像不给他面子……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '（勉强喝了一杯又一杯……）' },
      { letter: 'B', text: '谢谢叔叔心意！我最近在吃药/开车，以茶代酒敬您，祝您身体健康！' },
      { letter: 'C', text: '我不喝，别劝了。（态度强硬）' }
    ],
    correctIndex: 1,
    bestAnswer: '谢谢叔叔心意！我最近在吃药/开车，以茶代酒敬您，祝您身体健康！',
    technique: '💡 技巧：感谢心意 + 不可抗力 + 替代表达',
    analysis: '劝酒文化的应对三步曲：\n\n① 先感谢——"谢谢心意"给足面子\n② 不可抗力——"吃药/开车"让劝酒者没法继续\n③ 替代表达——"以茶代酒"仪式感不减\n④ 祝福收尾——转移注意力到美好祝愿\n\n核心心法：在中国式社交中，面子比酒精重要，只要面子给到了，喝什么都一样。',
    difficulty: 2
  },
  {
    id: 21, categoryId: 6, categoryName: '亲戚应酬', categoryEmoji: '🧧',
    scene: '过年亲戚催婚你很烦',
    sceneFull: '过年亲戚又开始催婚："你都这么大了怎么还不找对象？"……',
    hint: '选一个你会说的答案',
    options: [
      { letter: 'A', text: '嗯……在找了在找了……（敷衍）' },
      { letter: 'B', text: '哈哈，宁缺毋滥嘛～您放心，有好的一定第一个告诉您！' },
      { letter: 'C', text: '我结不结婚关你什么事？（翻脸）' }
    ],
    correctIndex: 1,
    bestAnswer: '哈哈，宁缺毋滥嘛～您放心，有好的一定第一个告诉您！',
    technique: '💡 技巧：幽默化解 + 给出承诺',
    analysis: '催婚是过年最大烦恼之一：\n\n① 幽默回应——"宁缺毋滥"表明不是不想找\n② 给出承诺——"有好的一定告诉您"让亲戚放心\n③ 不伤和气——亲戚出发点其实是关心\n\n核心心法：催婚不是攻击，理解对方出发点后用幽默化解，比硬刚更舒服。',
    difficulty: 1
  }
];

@Injectable()
export class QuizService {
  private questions: QuizQuestionDto[] = QUESTIONS;
  private categories: CategoryDto[] = CATEGORIES;

  // In-memory user stats
  private userStats = { practiced: 0, streak: 1, accuracy: 0, favorites: 0 };
  private answeredQuestions: Record<number, boolean> = {};
  private favoriteIds: number[] = [];

  getAllCategories(): CategoryDto[] {
    return this.categories;
  }

  getAllQuestions(categoryId?: number): QuizQuestionDto[] {
    if (categoryId) {
      return this.questions.filter(q => q.categoryId === categoryId);
    }
    return this.questions;
  }

  getQuestionById(id: number): QuizQuestionDto | undefined {
    return this.questions.find(q => q.id === id);
  }

  getTodayQuestion(): QuizQuestionDto {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % this.questions.length;
    return this.questions[index];
  }

  answerQuestion(questionId: number, isCorrect: boolean) {
    this.answeredQuestions[questionId] = isCorrect;
    const totalAnswered = Object.keys(this.answeredQuestions).length;
    const correctCount = Object.values(this.answeredQuestions).filter(Boolean).length;
    this.userStats.practiced = totalAnswered;
    this.userStats.accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return this.userStats;
  }

  getUserStats() {
    return this.userStats;
  }

  toggleFavorite(questionId: number): number[] {
    if (this.favoriteIds.includes(questionId)) {
      this.favoriteIds = this.favoriteIds.filter(id => id !== questionId);
    } else {
      this.favoriteIds.push(questionId);
    }
    this.userStats.favorites = this.favoriteIds.length;
    return this.favoriteIds;
  }

  getFavorites(): number[] {
    return this.favoriteIds;
  }
}
