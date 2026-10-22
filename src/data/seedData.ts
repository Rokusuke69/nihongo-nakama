/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VocabItem, KanjiItem, GrammarItem, ReadingMaterial, User, ActivityLog, DailyStudyStat } from '../types';

export const initialUser: User = {
  id: 'usr_nihon_01',
  username: 'Kenji Sato',
  email: 'kenji.learner@nihongonakama.jp',
  streakDays: 7,
  dailyGoalMinutes: 30,
  minutesStudiedToday: 24,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: '2026-03-01T08:00:00.000Z',
};

export const initialVocab: VocabItem[] = [
  // N5 Vocabulary
  {
    id: 'v_n5_01',
    japanese: '友達',
    furigana: 'ともだち',
    romaji: 'tomodachi',
    meaning: 'Friend, companion, nakama',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 4, intervalDays: 14, easeFactor: 2.6, nextReviewDate: '2026-10-25T00:00:00.000Z' },
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'v_n5_02',
    japanese: '桜',
    furigana: 'さくら',
    romaji: 'sakura',
    meaning: 'Cherry blossom',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 3, intervalDays: 6, easeFactor: 2.5, nextReviewDate: '2026-10-23T00:00:00.000Z' },
    createdAt: '2026-10-15T10:05:00.000Z',
  },
  {
    id: 'v_n5_03',
    japanese: '食べる',
    furigana: 'たべる',
    romaji: 'taberu',
    meaning: 'To eat',
    level: 'N5',
    partOfSpeech: 'Ichidan Verb',
    isFavorite: false,
    isLearned: true,
    srs: { repetitions: 5, intervalDays: 21, easeFactor: 2.7, nextReviewDate: '2026-10-29T00:00:00.000Z' },
    createdAt: '2026-10-15T10:10:00.000Z',
  },
  {
    id: 'v_n5_04',
    japanese: '飲む',
    furigana: 'のむ',
    romaji: 'nomu',
    meaning: 'To drink',
    level: 'N5',
    partOfSpeech: 'Godan Verb',
    isFavorite: false,
    isLearned: true,
    srs: { repetitions: 2, intervalDays: 6, easeFactor: 2.5, nextReviewDate: '2026-10-22T00:00:00.000Z' },
    createdAt: '2026-10-15T10:15:00.000Z',
  },
  {
    id: 'v_n5_05',
    japanese: '先生',
    furigana: 'せんせい',
    romaji: 'sensei',
    meaning: 'Teacher, doctor, master',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 4, intervalDays: 12, easeFactor: 2.5, nextReviewDate: '2026-10-24T00:00:00.000Z' },
    createdAt: '2026-10-15T10:20:00.000Z',
  },
  {
    id: 'v_n5_06',
    japanese: '学校',
    furigana: 'がっこう',
    romaji: 'gakkou',
    meaning: 'School',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: false,
    isLearned: true,
    srs: { repetitions: 2, intervalDays: 4, easeFactor: 2.4, nextReviewDate: '2026-10-23T00:00:00.000Z' },
    createdAt: '2026-10-15T10:25:00.000Z',
  },
  {
    id: 'v_n5_07',
    japanese: '本',
    furigana: 'ほん',
    romaji: 'hon',
    meaning: 'Book',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: false,
    isLearned: false,
    srs: { repetitions: 0, intervalDays: 1, easeFactor: 2.5, nextReviewDate: '2026-10-22T00:00:00.000Z' },
    createdAt: '2026-10-16T08:00:00.000Z',
  },
  {
    id: 'v_n5_08',
    japanese: '水',
    furigana: 'みず',
    romaji: 'mizu',
    meaning: 'Water',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: false,
    isLearned: true,
    srs: { repetitions: 3, intervalDays: 8, easeFactor: 2.5, nextReviewDate: '2026-10-24T00:00:00.000Z' },
    createdAt: '2026-10-16T08:05:00.000Z',
  },
  {
    id: 'v_n5_09',
    japanese: '日本語',
    furigana: 'にほんご',
    romaji: 'nihongo',
    meaning: 'Japanese language',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 6, intervalDays: 30, easeFactor: 2.8, nextReviewDate: '2026-11-10T00:00:00.000Z' },
    createdAt: '2026-10-16T08:10:00.000Z',
  },
  {
    id: 'v_n5_10',
    japanese: '時間',
    furigana: 'じかん',
    romaji: 'jikan',
    meaning: 'Time, hours',
    level: 'N5',
    partOfSpeech: 'Noun',
    isFavorite: false,
    isLearned: false,
    srs: { repetitions: 1, intervalDays: 1, easeFactor: 2.5, nextReviewDate: '2026-10-22T00:00:00.000Z' },
    createdAt: '2026-10-16T08:15:00.000Z',
  },

  // N4 Vocabulary
  {
    id: 'v_n4_01',
    japanese: '案内する',
    furigana: 'あんないする',
    romaji: 'annai suru',
    meaning: 'To guide, show around',
    level: 'N4',
    partOfSpeech: 'Suru Verb',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 2, intervalDays: 4, easeFactor: 2.5, nextReviewDate: '2026-10-23T00:00:00.000Z' },
    createdAt: '2026-10-16T09:00:00.000Z',
  },
  {
    id: 'v_n4_02',
    japanese: '準備',
    furigana: 'じゅんび',
    romaji: 'junbi',
    meaning: 'Preparation, arrangement',
    level: 'N4',
    partOfSpeech: 'Noun / Suru Verb',
    isFavorite: false,
    isLearned: true,
    srs: { repetitions: 3, intervalDays: 8, easeFactor: 2.5, nextReviewDate: '2026-10-25T00:00:00.000Z' },
    createdAt: '2026-10-16T09:05:00.000Z',
  },
  {
    id: 'v_n4_03',
    japanese: '約束',
    furigana: 'やくそく',
    romaji: 'yakusoku',
    meaning: 'Promise, appointment',
    level: 'N4',
    partOfSpeech: 'Noun / Suru Verb',
    isFavorite: true,
    isLearned: false,
    srs: { repetitions: 1, intervalDays: 2, easeFactor: 2.4, nextReviewDate: '2026-10-23T00:00:00.000Z' },
    createdAt: '2026-10-16T09:10:00.000Z',
  },

  // N3 Vocabulary
  {
    id: 'v_n3_01',
    japanese: '影響',
    furigana: 'えいきょう',
    romaji: 'eikyou',
    meaning: 'Influence, effect',
    level: 'N3',
    partOfSpeech: 'Noun / Suru Verb',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 3, intervalDays: 7, easeFactor: 2.5, nextReviewDate: '2026-10-24T00:00:00.000Z' },
    createdAt: '2026-10-17T11:00:00.000Z',
  },
  {
    id: 'v_n3_02',
    japanese: '解決',
    furigana: 'かいけつ',
    romaji: 'kaiketsu',
    meaning: 'Settlement, solution, resolution',
    level: 'N3',
    partOfSpeech: 'Noun / Suru Verb',
    isFavorite: false,
    isLearned: false,
    srs: { repetitions: 0, intervalDays: 1, easeFactor: 2.5, nextReviewDate: '2026-10-22T00:00:00.000Z' },
    createdAt: '2026-10-17T11:05:00.000Z',
  },

  // N2 Vocabulary
  {
    id: 'v_n2_01',
    japanese: '把握',
    furigana: 'はあく',
    romaji: 'haaku',
    meaning: 'Grasp, comprehension, catch',
    level: 'N2',
    partOfSpeech: 'Noun / Suru Verb',
    isFavorite: true,
    isLearned: true,
    srs: { repetitions: 2, intervalDays: 5, easeFactor: 2.4, nextReviewDate: '2026-10-25T00:00:00.000Z' },
    createdAt: '2026-10-18T14:00:00.000Z',
  },

  // N1 Vocabulary
  {
    id: 'v_n1_01',
    japanese: '妥協',
    furigana: 'だきょう',
    romaji: 'dakyou',
    meaning: 'Compromise, giving in',
    level: 'N1',
    partOfSpeech: 'Noun / Suru Verb',
    isFavorite: true,
    isLearned: false,
    srs: { repetitions: 1, intervalDays: 1, easeFactor: 2.5, nextReviewDate: '2026-10-22T00:00:00.000Z' },
    createdAt: '2026-10-18T14:30:00.000Z',
  },
];

export const initialKanji: KanjiItem[] = [
  // N5 Kanji
  {
    id: 'k_n5_01',
    kanji: '日',
    meaning: 'Sun, Day, Japan',
    onyomi: 'ニチ, ジツ',
    kunyomi: 'ひ, -び, -か',
    strokeCount: 4,
    level: 'N5',
    radical: '日 (sun)',
    isLearned: true,
    personalNotes: 'Forms 日本 (Nihon / Japan) and 日曜日 (Sunday). Essential foundation kanji.',
    examples: [
      { word: '日本', reading: 'にほん', meaning: 'Japan' },
      { word: '今日', reading: 'きょう', meaning: 'Today' },
      { word: '毎日', reading: 'まいにち', meaning: 'Every day' },
    ],
    strokeGuide: [
      'Vertical line on left side: top to bottom',
      'Top horizontal line turning down to form right edge',
      'Middle horizontal line left to right',
      'Bottom closing horizontal line left to right',
    ],
    createdAt: '2026-10-15T12:00:00.000Z',
  },
  {
    id: 'k_n5_02',
    kanji: '本',
    meaning: 'Book, Origin, Root',
    onyomi: 'ホン',
    kunyomi: 'もと',
    strokeCount: 5,
    level: 'N5',
    radical: '木 (tree)',
    isLearned: true,
    personalNotes: 'Looks like a tree (木) with a base stroke indicating the root or origin of things.',
    examples: [
      { word: '本棚', reading: 'ほんだな', meaning: 'Bookshelf' },
      { word: '日本語', reading: 'にほんご', meaning: 'Japanese language' },
      { word: '一本', reading: 'いっぽん', meaning: 'One long object (counter)' },
    ],
    strokeGuide: [
      'Horizontal bar',
      'Vertical stem with hooked bottom',
      'Diagonal sweep left',
      'Diagonal sweep right',
      'Horizontal root marker near bottom',
    ],
    createdAt: '2026-10-15T12:05:00.000Z',
  },
  {
    id: 'k_n5_03',
    kanji: '山',
    meaning: 'Mountain',
    onyomi: 'サン, セン',
    kunyomi: 'やま',
    strokeCount: 3,
    level: 'N5',
    radical: '山 (mountain)',
    isLearned: true,
    personalNotes: 'Pictograph of Mount Fuji with three distinct peaks. Central stroke is longest.',
    examples: [
      { word: '富士山', reading: 'ふじさん', meaning: 'Mount Fuji' },
      { word: '山登り', reading: 'やまのぼり', meaning: 'Mountain climbing' },
      { word: '火山', reading: 'かざん', meaning: 'Volcano' },
    ],
    strokeGuide: [
      'Long center vertical stroke',
      'Left vertical stroke bending into bottom horizontal',
      'Right vertical stroke connecting to bottom',
    ],
    createdAt: '2026-10-15T12:10:00.000Z',
  },
  {
    id: 'k_n5_04',
    kanji: '川',
    meaning: 'River, Stream',
    onyomi: 'セン',
    kunyomi: 'かわ',
    strokeCount: 3,
    level: 'N5',
    radical: '川 (river)',
    isLearned: true,
    personalNotes: 'Three curving flow lines of a river stream.',
    examples: [
      { word: '小川', reading: 'おがわ', meaning: 'Stream, brook' },
      { word: '川岸', reading: 'かわぎし', meaning: 'Riverbank' },
      { word: '河川', reading: 'かせん', meaning: 'Rivers and waterways' },
    ],
    strokeGuide: [
      'Left curved stroke downward',
      'Middle short vertical stroke',
      'Right long straight vertical stroke',
    ],
    createdAt: '2026-10-15T12:15:00.000Z',
  },
  {
    id: 'k_n5_05',
    kanji: '人',
    meaning: 'Person, Human',
    onyomi: 'ジン, ニン',
    kunyomi: 'ひと',
    strokeCount: 2,
    level: 'N5',
    radical: '人 (person)',
    isLearned: true,
    personalNotes: 'Two legs leaning on each other symbolizing mutual human support.',
    examples: [
      { word: '外国人', reading: 'がいこくじん', meaning: 'Foreigner' },
      { word: '日本人', reading: 'にほんじん', meaning: 'Japanese person' },
      { word: '三人', reading: 'さんにん', meaning: 'Three people' },
    ],
    strokeGuide: [
      'Diagonal sweep from top right down toward bottom left',
      'Secondary stroke branching from middle to bottom right',
    ],
    createdAt: '2026-10-15T12:20:00.000Z',
  },
  {
    id: 'k_n5_06',
    kanji: '友',
    meaning: 'Friend, Companion',
    onyomi: 'ユウ',
    kunyomi: 'とも',
    strokeCount: 4,
    level: 'N5',
    radical: '又 (again/hand)',
    isLearned: false,
    personalNotes: 'Represents two clasping hands in friendship (Nakama).',
    examples: [
      { word: '友達', reading: 'ともだち', meaning: 'Friend' },
      { word: '友人', reading: 'ゆうじん', meaning: 'Friend (formal)' },
      { word: '友情', reading: 'ゆうじょう', meaning: 'Friendship' },
    ],
    strokeGuide: [
      'Top horizontal stroke',
      'Long left diagonal sweep',
      'Right downward hook stroke',
      'Cross stroke to complete base',
    ],
    createdAt: '2026-10-15T12:25:00.000Z',
  },

  // N4 Kanji
  {
    id: 'k_n4_01',
    kanji: '道',
    meaning: 'Road, Way, Path, Tao',
    onyomi: 'ドウ, トウ',
    kunyomi: 'みち',
    strokeCount: 12,
    level: 'N4',
    radical: '辶 (road/walk)',
    isLearned: true,
    personalNotes: 'Used in martial arts like Judo (柔道), Kendo (剣道), and Tea Ceremony (茶道).',
    examples: [
      { word: '道路', reading: 'どうろ', meaning: 'Highway, road' },
      { word: '歩道', reading: 'ほどう', meaning: 'Footpath, sidewalk' },
      { word: '茶道', reading: 'さどう', meaning: 'Japanese tea ceremony' },
    ],
    strokeGuide: ['Inside radical 首 first (top to bottom)', 'Outer motion radical 辶 drawn last'],
    createdAt: '2026-10-16T13:00:00.000Z',
  },

  // N3 Kanji
  {
    id: 'k_n3_01',
    kanji: '結',
    meaning: 'Tie, Bind, Conclude',
    onyomi: 'ケツ, ケチ',
    kunyomi: 'むす-ぶ, ゆ-う',
    strokeCount: 12,
    level: 'N3',
    radical: '糸 (thread)',
    isLearned: true,
    personalNotes: 'Thread radical 糸 on the left, combined with 吉 (good luck) on right.',
    examples: [
      { word: '結果', reading: 'けっか', meaning: 'Result, consequence' },
      { word: '結婚', reading: 'けっこん', meaning: 'Marriage' },
      { word: '結論', reading: 'けつろん', meaning: 'Conclusion' },
    ],
    createdAt: '2026-10-17T14:00:00.000Z',
  },

  // N2 Kanji
  {
    id: 'k_n2_01',
    kanji: '響',
    meaning: 'Echo, Resound, Sound',
    onyomi: 'キョウ',
    kunyomi: 'ひび-く',
    strokeCount: 20,
    level: 'N2',
    radical: '音 (sound)',
    isLearned: false,
    personalNotes: 'Composed of 郷 (village/native) on top and 音 (sound) at the bottom.',
    examples: [
      { word: '影響', reading: 'えいきょう', meaning: 'Influence, impact' },
      { word: '反響', reading: 'はんきょう', meaning: 'Reverberation, reaction' },
    ],
    createdAt: '2026-10-18T15:00:00.000Z',
  },

  // N1 Kanji
  {
    id: 'k_n1_01',
    kanji: '憂',
    meaning: 'Grief, Anxiety, Melancholy',
    onyomi: 'ユウ',
    kunyomi: 'うれ-える, う-い',
    strokeCount: 15,
    level: 'N1',
    radical: '心 (heart)',
    isLearned: false,
    personalNotes: 'Complex character containing 心 (heart) nestled in the center.',
    examples: [
      { word: '憂鬱', reading: 'ゆううつ', meaning: 'Depression, gloom' },
      { word: '憂慮', reading: 'ゆうりょ', meaning: 'Anxiety, concern' },
    ],
    createdAt: '2026-10-18T15:30:00.000Z',
  },
];

export const initialGrammar: GrammarItem[] = [
  // N5 Grammar
  {
    id: 'g_n5_01',
    title: '〜は〜です (Topic Marker & Copula)',
    structure: '[Noun A] は [Noun B] です',
    meaning: 'A is B (polite statement of identity or equivalence)',
    usageNotes: 'The particle は is pronounced "wa" when serving as the topic marker. です is the polite copula, equivalent to "is/am/are". In speech, contractions or casual variants (だ) are used among close friends.',
    exampleSentences: [
      {
        japanese: '私は学生です。',
        furigana: 'わたしは がくせいです。',
        english: 'I am a student.',
      },
      {
        japanese: 'これは日本の緑茶です。',
        furigana: 'これは にほんの りょくちゃです。',
        english: 'This is Japanese green tea.',
      },
    ],
    commonMistakes: 'Do not pronounce は as "ha" when it marks the sentence topic. Also, do not confuse with が which specifies the grammatical subject rather than the broad topic.',
    level: 'N5',
    category: 'Basic Sentence Structure',
    isLearned: true,
    createdAt: '2026-10-15T15:00:00.000Z',
  },
  {
    id: 'g_n5_02',
    title: '〜があります / います (Existence)',
    structure: '[Location] に [Subject] が あります / います',
    meaning: 'There is / exists (あります for inanimate objects; います for living beings)',
    usageNotes: 'Always distinguish between living creatures (people, pets, animals using います) and non-living objects/plants (books, cars, trees using あります). Location is marked with に.',
    exampleSentences: [
      {
        japanese: '庭に綺麗な桜の木があります。',
        furigana: 'にわに きれいな さくらの きが あります。',
        english: 'There is a beautiful cherry blossom tree in the garden.',
      },
      {
        japanese: '教室に先生がいます。',
        furigana: 'きょうしつに せんせいが います。',
        english: 'The teacher is in the classroom.',
      },
    ],
    commonMistakes: 'Using あります for people or pets, e.g. "猫があります" is incorrect; use "猫がいます". Plants conventionally take あります despite being biologically alive.',
    level: 'N5',
    category: 'Existence & State',
    isLearned: true,
    createdAt: '2026-10-15T15:10:00.000Z',
  },
  {
    id: 'g_n5_03',
    title: '〜てください (Polite Request)',
    structure: '[Verb て-form] + ください',
    meaning: 'Please do [verb] (standard polite request)',
    usageNotes: 'Convert the verb to its て (te) form and attach ください. Used in everyday polite interactions, instructions, and menus.',
    exampleSentences: [
      {
        japanese: 'この漢字を読んでください。',
        furigana: 'この かんじを よんで ください。',
        english: 'Please read this kanji.',
      },
      {
        japanese: '美味しいラーメンを食べてください。',
        furigana: 'おいしい らーめんを たべて ください。',
        english: 'Please try this delicious ramen.',
      },
    ],
    commonMistakes: 'Using with superiors when asking a big favor; for higher etiquette, 〜ていただけませんか is preferred over simple 〜てください.',
    level: 'N5',
    category: 'Requests & Instructions',
    isLearned: false,
    createdAt: '2026-10-15T15:20:00.000Z',
  },

  // N4 Grammar
  {
    id: 'g_n4_01',
    title: '〜たことがある (Past Experience)',
    structure: '[Verb た-form] + ことがある',
    meaning: 'Have ever done [verb] (prior life experience)',
    usageNotes: 'Expresses whether one has experienced something in their lifetime. Negated as ことがない (have never done).',
    exampleSentences: [
      {
        japanese: '富士山に登ったことがあります。',
        furigana: 'ふじさんに のぼった ことが あります。',
        english: 'I have climbed Mount Fuji before.',
      },
    ],
    commonMistakes: 'Do not use for routine past actions (e.g., "I ate breakfast this morning"). Reserve for notable life experiences.',
    level: 'N4',
    category: 'Experience & Habits',
    isLearned: true,
    createdAt: '2026-10-16T16:00:00.000Z',
  },

  // N3 Grammar
  {
    id: 'g_n3_01',
    title: '〜わけにはいかない (Cannot Bring Oneself To)',
    structure: '[Verb Dictionary Form] + わけにはいかない',
    meaning: 'Cannot do due to social, moral, or situational obligations',
    usageNotes: 'Differs from physical impossibility; expresses that psychological, ethical, or social reasons prevent the action.',
    exampleSentences: [
      {
        japanese: '大切な試験があるから、遊んでいるわけにはいかない。',
        furigana: 'たいせつな しけんが あるから、あそんでいる わけには いかない。',
        english: 'Because I have an important exam, I cannot afford to be playing around.',
      },
    ],
    commonMistakes: 'Confusing with 〜ことができない (objective inability).',
    level: 'N3',
    category: 'Social & Moral Obligation',
    isLearned: false,
    createdAt: '2026-10-17T16:30:00.000Z',
  },

  // N2 Grammar
  {
    id: 'g_n2_01',
    title: '〜に伴って (Along With / Concurrently)',
    structure: '[Noun / Verb Dictionary Form] + に伴って (にともなって)',
    meaning: 'As X changes, Y changes concurrently; in tandem with',
    usageNotes: 'Formal expression indicating that when one shift happens, another naturally accompanies it.',
    exampleSentences: [
      {
        japanese: '人口の増加に伴って、住宅需要が高まった。',
        furigana: 'じんこうの ぞうかに ともなって、じゅうたく じゅようが たかまった。',
        english: 'In tandem with the population growth, housing demand rose.',
      },
    ],
    commonMistakes: 'Usually describes macroscopic trends rather than trivial personal momentary choices.',
    level: 'N2',
    category: 'Correlative Changes',
    isLearned: false,
    createdAt: '2026-10-18T17:00:00.000Z',
  },

  // N1 Grammar
  {
    id: 'g_n1_01',
    title: '〜極まりない / 極まる (Utterly / Extremely)',
    structure: '[な-adjective stem] + 極まりない / 極まる',
    meaning: 'Extremely, know no bounds (formal / literary tone)',
    usageNotes: 'Indicates an ultimate, extreme state of emotion or quality, often with negative or critical resonance.',
    exampleSentences: [
      {
        japanese: 'そんな危険な行為は無責任極まりない。',
        furigana: 'そんな きけんな こういは むせきにん きわまりない。',
        english: 'Such dangerous behavior is utterly irresponsible.',
      },
    ],
    commonMistakes: 'Do not use in casual everyday chat; strictly formal or essayistic.',
    level: 'N1',
    category: 'Extreme Degree',
    isLearned: false,
    createdAt: '2026-10-18T17:30:00.000Z',
  },
];

export const initialReading: ReadingMaterial[] = [
  {
    id: 'read_n5_01',
    title: 'Momotaro, The Peach Boy',
    japaneseTitle: '桃太郎（ももたろう）',
    filename: 'momotaro_folk_tale.txt',
    fileType: 'story',
    uploadDate: '2026-10-15',
    coverTheme: 'momotaro',
    level: 'N5',
    estimatedMinutes: 8,
    englishSummary: 'Japan’s most celebrated folk tale about a boy born from a giant peach who befriends a dog, a monkey, and a pheasant to defeat the ogres of Ogre Island.',
    bookmarks: [1, 3],
    notes: 'Key vocab: きびだんご (millet dumplings), おにがしま (Ogre Island), なかま (companion).',
    readingProgress: 75,
    content: `【第一章：川から流れてきた大きな桃】
むかし、むかし、ある所に、おじいさんとおばあさんが住んでいました。
おじいさんは山へ柴刈りに、おばあさんは川へ洗濯に行きました。

おばあさんが川で洗濯をしていると、川上から大きな桃が、
「どんぶらこ、どんぶらこ」
と流れてきました。

おばあさんはびっくりして、その桃を家に持って帰りました。
夕方になって、おじいさんが山から帰ってくると、
「おじいさん、珍しいものがありますよ」
と言って、大きな桃を見せました。

【第二章：桃から生まれた男の子】
おじいさんが包丁で桃を切ろうとすると、桃がぱかっと割れて、中から元気な男の子が飛び出しました。
「おぎゃあ、おぎゃあ！」
二人は大喜びで、桃から生まれたので「桃太郎」と名付けました。
桃太郎はご飯をたくさん食べて、ぐんぐん大きくなり、力持ちで優しい若者に育ちました。

【第三章：鬼ヶ島への旅立ちと仲間たち】
ある日、桃太郎は言いました。
「おじいさん、おばあさん。鬼ヶ島の鬼が村人を苦しめています。私が鬼を退治してきます」
おばあさんは日本一のきびだんごを作って、桃太郎の腰の袋に入れてくれました。

旅の途中で、犬、猿、キジに出会いました。
「桃太郎さん、腰につけたきびだんごを一つくださいな。お供します」
桃太郎は美味しいきびだんごをあげて、心強い「仲間（Nakama）」になりました。

【第四章：鬼退治と平和】
桃太郎と仲間たちは船に乗って鬼ヶ島へ渡り、力を合わせて鬼たちを懲らしめました。
宝物を取り返し、村人たちの平和を守って、おじいさんとおばあさんの待つ家へ幸せに帰りました。めでたし、めでたし。`,
  },
  {
    id: 'read_n5_02',
    title: 'Urashima Taro and the Dragon Palace',
    japaneseTitle: '浦島太郎（うらしまたろう）',
    filename: 'urashima_taro_sea.txt',
    fileType: 'story',
    uploadDate: '2026-10-16',
    coverTheme: 'urashima',
    level: 'N5',
    estimatedMinutes: 6,
    englishSummary: 'The timeless fable of a kind fisherman who saves a sea turtle, journeys to the magical underwater Dragon Palace, and receives a mysterious smoke box.',
    bookmarks: [2],
    notes: 'Teaches past tense and sea vocabulary: かめ (turtle), りゅうぐうじょう (Dragon Palace), たまてばこ (casket of jewels).',
    readingProgress: 45,
    content: `【第一章：浜辺の出会い】
むかし、海辺の小さな村に、浦島太郎という心の優しい漁師が住んでいました。
ある日の夕暮れ、太郎が浜辺を歩いていると、子どもたちが小さな海亀をつかまえて、棒で突っついていじめていました。

「これこれ、子どもたち。亀をいじめてはいけないよ。逃がしておやり」
太郎はお金を渡して亀を助け、そっと青い海に返してあげました。亀は嬉しそうに手足をバタバタさせて、深い海へと泳いでいきました。

【第二章：竜宮城へのご招待】
二、三日後、太郎が海で釣りをしていると、
「浦島さん、浦島さん」
と呼ぶ声がしました。見ると、この前助けた亀が大きくなって海面に顔を出していました。
「先日は助けていただき、本当にありがとうございました。お礼に、海の底にある竜宮城へご案内いたします」
太郎が亀の甲羅に乗ると、亀はすいすいと透き通った海の中へ潜っていきました。

【第三章：夢のような歓待】
竜宮城はサンゴや真珠で飾られた目を見張るほど美しい御殿でした。
美しい乙姫様が現れ、
「優しい浦島さん、ようこそいらっしゃいました」
と温かく迎えました。色とりどりの魚たちが舞い踊り、ごちそうが次々と運ばれ、太郎は夢のような日々を過ごしました。

【第四章：玉手箱と帰郷】
しかし、太郎は故郷の年老いた母が心配になり、帰る決意をしました。
乙姫様は別れを惜しみながら、ひとつの小箱を渡しました。
「これは玉手箱です。絶対に開けてはなりませんよ」
太郎が村に戻ると、見知らぬ人ばかり。なんと竜宮城の数日は、地上の三百年だったのです。
悲しみに暮れた太郎が思わず玉手箱を開けると、白い煙がもくもくと立ち上り、太郎は一瞬にして白髪のおじいさんになってしまいました。`,
  },
  {
    id: 'read_n4_01',
    title: 'The Tale of the Bamboo Cutter',
    japaneseTitle: '竹取物語（かぐや姫）',
    filename: 'kaguya_hime.txt',
    fileType: 'story',
    uploadDate: '2026-10-17',
    coverTheme: 'kaguya',
    level: 'N4',
    estimatedMinutes: 10,
    englishSummary: 'Japan’s oldest prose narrative. A glowing bamboo shoot yields the celestial Princess Kaguya, admired by emperors before returning to the Moon.',
    bookmarks: [],
    notes: 'Classical foundation text. Reflects Japanese aesthetic of beauty, mystery, and impermanence.',
    readingProgress: 20,
    content: `【第一章：光り輝く竹】
いまは昔、竹取の翁と呼ばれるおじいさんがいました。野山に分け入っては竹を取り、籠や道具を作って暮らしていました。
ある日、竹林の中で根元が黄金に光り輝く不思議な竹を見つけました。
「不思議なこともあるものじゃ」
近寄って切ってみると、筒の中に三寸（約9センチ）ほどの可愛らしい女の子が座っていました。

おじいさんは家に連れて帰り、おばあさんと共に大切に育てました。
その後、竹を切るたびに黄金が詰まった竹が見つかり、二人は豊かになりました。女の子はわずか三ヶ月で息をのむほど美しい娘に成長し、「かぐや姫」と名付けられました。

【第二章：月からの迎え】
その美しさは国中に知れ渡り、貴公子たちや帝からも求婚されましたが、姫は決して首を縦に振ることはありませんでした。
やがて夏の終わりが近づくと、かぐや姫は月を見上げては涙を流すようになりました。
「私はこの世界の人間ではありません。月の都から来たのです。次の満月の夜、迎えが参ります」

満月の夜、天から光り輝く雲と天人たちが降りてきました。
おじいさんとおばあさんは泣いて引き止めましたが、かぐや姫は感謝の涙を流しながら羽衣をまとい、静かに月の都へと昇っていきました。`,
  },
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'act_01',
    timestamp: '2026-10-21T18:30:00.000Z',
    type: 'vocab',
    description: 'Mastered 5 new N5 Torii gate vocabulary words',
    durationMinutes: 15,
  },
  {
    id: 'act_02',
    timestamp: '2026-10-21T19:00:00.000Z',
    type: 'kanji',
    description: 'Practiced stroke order for Mount Fuji kanji: 日, 本, 山',
    durationMinutes: 12,
  },
  {
    id: 'act_03',
    timestamp: '2026-10-21T20:15:00.000Z',
    type: 'reading',
    description: 'Read Momotaro Chapter 3 & bookmarked companion dialogue',
    durationMinutes: 18,
  },
];

export const initialWeeklyStats: DailyStudyStat[] = [
  { day: 'Thu', date: '2026-10-15', minutes: 25, itemsReviewed: 18 },
  { day: 'Fri', date: '2026-10-16', minutes: 35, itemsReviewed: 24 },
  { day: 'Sat', date: '2026-10-17', minutes: 40, itemsReviewed: 32 },
  { day: 'Sun', date: '2026-10-18', minutes: 30, itemsReviewed: 22 },
  { day: 'Mon', date: '2026-10-19', minutes: 45, itemsReviewed: 35 },
  { day: 'Tue', date: '2026-10-20', minutes: 30, itemsReviewed: 28 },
  { day: 'Wed', date: '2026-10-21', minutes: 24, itemsReviewed: 20 },
];
