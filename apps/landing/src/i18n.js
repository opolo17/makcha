export const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
];

export const COPY = {
  ko: {
    langSelect: '언어 선택',
    langMenuTitle: '언어',
    scrollTop: '맨 위로 올라가기',
    brand: 'MAKCHA',
    brandSub: '막차',
    hero: {
      h1: ['시간을 알려주는 앱이', '아닙니다.', '지금 당장', '문 열고 나가게', '만듭니다.'],
      h1Mark: { lineIndex: 3, word: '문 열고 나가게' },
      descLead:
        '지도 앱은 기계가 움직이는 시간만 계산합니다. MAKCHA는 환승 버퍼, 외출 준비, 엘리베이터 대기까지 더해 ',
      descHighlight: '진짜 막차 시간을 계산하고, 지각 전에 몸을 움직이게 합니다.',
    },
    form: {
      emailPlaceholder: '이메일을 입력해 주세요',
      emailLabel: '이메일',
      featurePlaceholder: 'MAKCHA에 이런 기능도 있었으면 좋겠어요! (선택)',
      featureLabel: '기능 제안 (선택)',
      submit: '1초 만에 사전신청하기',
      submitting: '신청 중...',
      error: '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      successTitle: '사전 예약이 완료되었습니다!',
      successDesc: '출시 후 가장 먼저 안내해 드리겠습니다.',
    },
    benefit: {
      prefix: '지금 사전 신청 시,',
      badge: '얼리버드',
      suffix: '에게',
      highlight: '평생 무료 프리미엄',
      end: '를 드립니다.',
    },
    phone: {
      statusBar: '9:41',
      countdownLabel: '막차 출발까지',
      countdown: '04:21',
      message: '지금 안 씻으면 오늘 지각입니다.',
      appointment: '오후 7:00 · 강남역',
      push20: '슬슬 옷 고르세요. 패션쇼 할 시간 없습니다.',
      push5: '지금 현관문 도어락 안 누르면 무조건 지각.',
    },
    pain: {
      title: ['왜 지도 앱으로는', '또 지각할까요?'],
      cards: [
        {
          title: '기계만의 이동 시간',
          desc: '약속 시간 − 지하철 이동 시간 = 출발 시간. 인간이 밍기적거리는 시간은 계산에 없습니다.',
        },
        {
          title: '정중한 알림은 무시됩니다',
          desc: '"곧 출발하세요~" 같은 부드러운 푸시는 지각러의 자기합리화를 깨지 못합니다.',
        },
        {
          title: '정보 과부하',
          desc: '경로, 환승, 도보 안내가 가득한 화면은 "아직 시간 있지"라는 착각만 키웁니다.',
        },
      ],
    },
    flow: {
      title: ['막차까지, 딱 4단계'],
      steps: [
        {
          title: '초간단 약속 입력',
          desc: '언제, 어디서, 어디로 — 세 가지만 입력하면 끝입니다.',
        },
        {
          title: '막차 시각 자동 계산',
          desc: '이동 시간 + 인간 버퍼(기본 15분)를 더해, 진짜 늦지 않는 데드라인을 도출합니다.',
        },
        {
          title: '심리 압박 카운트다운',
          desc: '복잡한 정보 없이, 오직 타이머와 직설적인 한 줄 메시지만 보여 줍니다.',
        },
        {
          title: '가차 없는 푸시 알림',
          desc: '막차 20분 전, 5분 전 — 행동을 강제하는 직설 카피로 밀어냅니다.',
        },
      ],
      visual: {
        when: '오후 7:00',
        from: '우리 집',
        to: '강남역',
        pureTravel: '이동 42분',
        buffer: '인간 버퍼 +15분',
        deadline: '막차 18:03',
        push20label: '20분 전',
        push5label: '5분 전',
      },
    },
    states: {
      title: ['남은 시간에 따라', '압박이 강해집니다'],
      items: [
        {
          name: '안전',
          time: '30분 이상',
          color: 'safe',
          message: '아직은 여유가 있습니다. 미리 준비해 두세요.',
        },
        {
          name: '경고',
          time: '10분 전',
          color: 'warning',
          message: '머리 말리면서 옷 입어야 하는 타이밍입니다.',
        },
        {
          name: '임박',
          time: '3분 전',
          color: 'urgent',
          message: '신발 신으세요. 스타벅스 들르면 끝장납니다.',
        },
        {
          name: '종료',
          time: '막차 지남',
          color: 'over',
          message: '이미 늦었습니다. 친구에게 보낼 사과 카톡을 준비하세요.',
        },
      ],
    },
    reverse: {
      title: [
        'MAKCHA는 길을 알려주지 않습니다.',
        '당신이 문을 열고 나가게',
        '만듭니다.',
      ],
      desc: '지각러의 "5분만 더"를 깨는 행동 교정 서비스. 현실 인간 시간으로 계산한 막차 시각, 그 전에 몸을 움직이세요.',
    },
    cta: {
      title: ['오늘도 "아직 괜찮아"라고', '말하기 전에,', 'MAKCHA와 막차를 잡으세요.'],
    },
    footer: '© 2026 MAKCHA. All rights reserved.',
  },
  en: {
    langSelect: 'Select language',
    langMenuTitle: 'Language',
    scrollTop: 'Back to top',
    brand: 'MAKCHA',
    brandSub: 'Last train',
    hero: {
      h1: [
        'Not a clock app.',
        'We break your excuses',
        'and make you',
        'walk out the door',
        'right now.',
      ],
      h1Mark: { lineIndex: 3, word: 'walk out the door' },
      descLead:
        'Maps only count machine travel time. MAKCHA adds transfer buffer, getting-ready time, and elevator waits — ',
      descHighlight: 'then counts you down until you actually leave.',
    },
    form: {
      emailPlaceholder: 'Enter your email',
      emailLabel: 'Email',
      featurePlaceholder: 'Wish MAKCHA had this feature! (optional)',
      featureLabel: 'Feature suggestion (optional)',
      submit: 'Join waitlist in 1 second',
      submitting: 'Submitting...',
      error: 'Submission failed. Please try again shortly.',
      successTitle: "You're on the waitlist!",
      successDesc: "We'll reach out first when we launch.",
    },
    benefit: {
      prefix: 'Pre-register now —',
      badge: 'Early birds',
      suffix: 'get',
      highlight: 'lifetime premium free',
      end: '.',
    },
    phone: {
      statusBar: '9:41',
      countdownLabel: 'Until last train',
      countdown: '04:21',
      message: "If you don't shower now, you're late today.",
      appointment: '7:00 PM · Gangnam Station',
      push20: 'Pick clothes. This is not a fashion show.',
      push5: "If you don't hit the door lock now, you're late. Period.",
    },
    pain: {
      title: ['Why do map apps', 'still make you late?'],
      cards: [
        {
          title: 'Machine-only travel time',
          desc: 'Appointment − subway time = leave time. Human dawdling is never in the formula.',
        },
        {
          title: 'Polite notifications fail',
          desc: 'Gentle "time to leave~" pushes cannot break a chronic late person\'s self-rationalization.',
        },
        {
          title: 'Information overload',
          desc: 'Routes, transfers, walking guides — they only feed the illusion that you still have time.',
        },
      ],
    },
    flow: {
      title: ['Four steps to', 'your last train'],
      steps: [
        {
          title: 'Quick appointment input',
          desc: 'When, from where, to where — only three fields.',
        },
        {
          title: 'Auto last-train deadline',
          desc: 'Travel time plus a forced human buffer (default 15 min) = your real deadline.',
        },
        {
          title: 'Pressure countdown',
          desc: 'No clutter — just a timer and one blunt line on screen.',
        },
        {
          title: 'No-nonsense push alerts',
          desc: 'At 20 and 5 minutes before — copy that forces action, not sympathy.',
        },
      ],
      visual: {
        when: '7:00 PM',
        from: 'Home',
        to: 'Gangnam Stn.',
        pureTravel: 'Travel 42 min',
        buffer: 'Human buffer +15 min',
        deadline: 'Last train 6:03 PM',
        push20label: '20 min left',
        push5label: '5 min left',
      },
    },
    states: {
      title: ['Pressure ramps up', 'as time runs out'],
      items: [
        {
          name: 'Safe',
          time: '30+ min left',
          color: 'safe',
          message: 'You still have room. Get ready early.',
        },
        {
          name: 'Warning',
          time: '10 min left',
          color: 'warning',
          message: 'Dry your hair and get dressed — now.',
        },
        {
          name: 'Urgent',
          time: '3 min left',
          color: 'urgent',
          message: 'Put on shoes. A Starbucks stop ends you.',
        },
        {
          name: 'Over',
          time: 'Past deadline',
          color: 'over',
          message: "You're late. Draft the apology text.",
        },
      ],
    },
    reverse: {
      title: [
        'MAKCHA does not show you the route.',
        'It makes you',
        'open the door and leave.',
      ],
      desc: 'Behavior correction for chronic lateness. Real human time, real deadline — move before the last train is gone.',
    },
    cta: {
      title: [
        'Before you say "I\'m fine for now" again,',
        'catch your last train',
        'with MAKCHA.',
      ],
    },
    footer: '© 2026 MAKCHA. All rights reserved.',
  },
  ja: {
    langSelect: '言語を選択',
    langMenuTitle: '言語',
    scrollTop: 'ページ上部へ',
    brand: 'MAKCHA',
    brandSub: '終電',
    hero: {
      h1: ['時間を教えるアプリ', 'ではありません。', '今すぐ', 'ドアを開けて', '出かけさせます。'],
      h1Mark: { lineIndex: 3, word: 'ドアを開けて' },
      descLead:
        '地図アプリは機械の移動時間だけを計算します。MAKCHAは乗り換えバッファ、支度、エレベーター待ちまで足して、',
      descHighlight: '本当の終電時刻を出し、遅刻する前に体を動かします。',
    },
    form: {
      emailPlaceholder: 'メールアドレスを入力してください',
      emailLabel: 'メールアドレス',
      featurePlaceholder: 'MAKCHAにこんな機能があったらいいな！（任意）',
      featureLabel: '機能の提案（任意）',
      submit: '1秒で事前登録',
      submitting: '送信中...',
      error: '送信に失敗しました。しばらくしてから再度お試しください。',
      successTitle: '事前登録が完了しました！',
      successDesc: 'リリース後、いち早くご案内いたします。',
    },
    benefit: {
      prefix: '今事前登録すると、',
      badge: '早期登録者',
      suffix: 'に',
      highlight: '永久無料プレミアム',
      end: 'をプレゼント。',
    },
    phone: {
      statusBar: '9:41',
      countdownLabel: '終電出発まで',
      countdown: '04:21',
      message: '今シャワーしなければ、今日は遅刻です。',
      appointment: '午後7:00 · 江南駅',
      push20: '服を選んで。ファッションショーじゃない。',
      push5: '今玄関のドアロック押さなければ、確実に遅刻。',
    },
    pain: {
      title: ['なぜ地図アプリでも', 'また遅刻するのか？'],
      cards: [
        {
          title: '機械だけの移動時間',
          desc: '約束時間 − 地下鉄の移動時間 = 出発時間。人間がモタつく時間は入っていません。',
        },
        {
          title: '丁寧な通知は無視される',
          desc: '「そろそろ出発〜」の優しいプッシュは、遅刻常習者の自己正当化を崩せません。',
        },
        {
          title: '情報過多',
          desc: '経路・乗換・徒歩案内だらけの画面は「まだ時間ある」という錯覚だけを強めます。',
        },
      ],
    },
    flow: {
      title: ['終電まで、たった4ステップ'],
      steps: [
        {
          title: '超シンプルな予定入力',
          desc: 'いつ、どこから、どこへ — 3つだけ入力すれば完了。',
        },
        {
          title: '終電時刻の自動計算',
          desc: '移動時間 + 人間バッファ（デフォルト15分）で、本当に遅れない締め切りを算出。',
        },
        {
          title: '心理的プレッシャーカウントダウン',
          desc: '複雑な情報はなし。タイマーと直球の一行メッセージだけ。',
        },
        {
          title: '容赦ないプッシュ通知',
          desc: '終電20分前、5分前 — 行動を強制する直球コピーで押し出します。',
        },
      ],
      visual: {
        when: '午後7:00',
        from: '自宅',
        to: '江南駅',
        pureTravel: '移動 42分',
        buffer: '人間バッファ +15分',
        deadline: '終電 18:03',
        push20label: '20分前',
        push5label: '5分前',
      },
    },
    states: {
      title: ['残り時間で', 'プレッシャーが強まる'],
      items: [
        {
          name: '安全',
          time: '30分以上',
          color: 'safe',
          message: 'まだ余裕があります。早めに準備を。',
        },
        {
          name: '警告',
          time: '10分前',
          color: 'warning',
          message: '髪を乾かしながら服を着るタイミングです。',
        },
        {
          name: '迫急',
          time: '3分前',
          color: 'urgent',
          message: '靴を履いて。スタバに寄ったら終わり。',
        },
        {
          name: '終了',
          time: '終電過ぎ',
          color: 'over',
          message: 'もう遅れました。友達への謝罪LINEを準備を。',
        },
      ],
    },
    reverse: {
      title: [
        'MAKCHAは道を教えません。',
        'あなたがドアを開けて',
        '出かけるようにします。',
      ],
      desc: '遅刻常習者の「あと5分だけ」を崩す行動矯正サービス。現実の人間時間で計算した終電、その前に動け。',
    },
    cta: {
      title: [
        '今日も「まだ大丈夫」と',
        '言う前に、',
        'MAKCHAで終電を掴もう。',
      ],
    },
    footer: '© 2026 MAKCHA. All rights reserved.',
  },
};
