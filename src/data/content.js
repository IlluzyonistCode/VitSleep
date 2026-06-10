// ─────────────────────────────────────────────────────────────
//  VitSleep — Content Data
//  All technique descriptions corrected based on actual research.
//  Key fix: WBTB and Audio Cue are MUTUALLY EXCLUSIVE strategies.
// ─────────────────────────────────────────────────────────────

export const LESSONS = [
  {
    day: 1,
    title: 'Dream Recall',
    subtitle: 'The foundation of everything',
    icon: '🌙',
    theory: `Before you can have a lucid dream, you need to remember your dreams. Most people dream 4–6 times per night and forget nearly everything within minutes of waking.

Dream recall is a trainable skill. The brain treats dream memories as low-priority and overwrites them fast. Your job is to teach it otherwise — every morning, before moving or checking your phone.

**Why it matters:** Lucid dreams only become accessible when your dream memory is sharp enough to catch the moment of realization and hold it long enough to act on it.`,
    technique: {
      name: 'The Morning Still',
      steps: [
        'Keep a notebook and pen on your nightstand — not your phone.',
        'When you wake up, don\'t move. Stay still with eyes closed.',
        'Let dream fragments float to the surface. Don\'t chase them — receive them.',
        'Write down everything, even a single colour, emotion, or face.',
        'If nothing comes, write "No recall" and the date. The ritual itself rewires the brain.',
      ]
    },
    task: {
      text: 'Before sleep tonight, repeat aloud: "Tonight I will remember my dreams." Tomorrow morning, stay still for 60 seconds before writing anything down.',
      type: 'affirmation',
    },
    tip: 'The first 30 seconds after waking are critical. A single move — reaching for your phone — can erase everything. Lie still first.'
  },

  {
    day: 2,
    title: 'The Dream Journal',
    subtitle: 'Building the habit that changes everything',
    icon: '📖',
    theory: `A dream journal is the single most powerful tool for a lucid dreamer. Not because writing is magical, but because of what it trains: your brain starts treating dreams as important information worth preserving.

Within 2–3 weeks of consistent journaling, most people go from remembering one dream per week to three or four per night. That's not an exaggeration — it's a well-documented neurological shift.

**Dream signs** emerge here: recurring elements in your dreams (a childhood house, a specific person, the feeling of flying) that, if noticed, can trigger spontaneous lucidity. You can't know yours until you've recorded enough dreams to see the pattern.`,
    technique: {
      name: 'The Full Entry',
      steps: [
        'Write immediately on waking — before coffee, before your phone.',
        'Structure each entry: title, setting, characters, key events, emotions.',
        'Note the mood of the dream, not just the plot. Emotions are often more memorable than events.',
        'After a week, read back and highlight anything that repeats across entries.',
        'These repeating elements are your personal dream signs. Mark them with a star.',
      ]
    },
    task: {
      text: 'Write your first dream entry today. Even fragments count — one image, one feeling. Date it and note what time you woke up.',
      type: 'journal',
    },
    tip: 'Dreams from different hours of the night have different qualities. REM dreams (later in sleep) tend to be more vivid and emotional. Note the time when you can.'
  },

  {
    day: 3,
    title: 'Reality Checks',
    subtitle: 'Training the critical habit',
    icon: '🤚',
    theory: `Reality checks work on a deceptively simple principle: if you question reality habitually during the day, your dreaming mind will eventually do the same — and that is the moment you become lucid.

The mistake almost every beginner makes is going through the motion without the genuine question. The physical check is just a trigger. The real work is asking yourself, sincerely: **"Could I be dreaming right now?"**

In dreams, physical laws break in subtle ways. Fingers blur or multiply. Text changes when you look away. You can breathe through a pinched nose. These tests exploit exactly those inconsistencies.

**Critically:** 10–15 checks per waking day is the target. Not 2, not 50. Space them through the day using habit anchors — not timers, which become easy to ignore.`,
    technique: {
      name: 'The Three Physical Checks',
      steps: [
        '**Nose pinch (most reliable):** Pinch your nose shut. Try to breathe in. In a dream, you can — and this shock of breathing triggers instant lucidity.',
        '**Hand check:** Look at your hands for 5 full seconds. Count your fingers. In dreams, they blur, merge, or multiply. Do this slowly.',
        '**Text test:** Read something nearby. Look away. Read it again. In dreams, text shifts, scrambles, or becomes nonsense.',
        'After each check, genuinely ask: "Am I dreaming?" Let the question actually land, don\'t rush past it.',
        'Anchor checks to actions, not timers: every door you walk through, every time you pick up your phone, every mirror you pass.',
      ]
    },
    task: {
      text: 'Today, complete at least 10 reality checks. Link them to real actions — don\'t rely on alarms. Every doorway, every time you reach for your phone.',
      type: 'reality_checks',
    },
    tip: 'The nose pinch check is the king of reality checks because it works differently from the others — it\'s physical and shocking. When it works in a dream, there\'s no mistaking it.'
  },

  {
    day: 4,
    title: 'MILD Technique',
    subtitle: 'Programming your sleeping mind',
    icon: '🧠',
    theory: `MILD (Mnemonic Induction of Lucid Dreams) was developed by Dr. Stephen LaBerge at Stanford and is one of the most scientifically validated techniques for inducing lucid dreams.

The mechanism is **prospective memory** — the ability to remember to do something in the future. You are literally programming your sleeping mind with an intention, like leaving yourself a note that reads: "When you're dreaming, know it."

**A critical finding from the research:** The single strongest predictor of MILD success is falling asleep within 5 minutes of completing the exercise. If you lie awake for 20 minutes after — the effect drops by roughly half. So do MILD when you're genuinely drowsy, not wide awake.

Combined with reviewing your journal for personal dream signs, MILD becomes significantly more powerful.`,
    technique: {
      name: 'MILD Before Sleep',
      steps: [
        'Review your recent dream journal entries. Choose one recurring element — your personal dream sign.',
        'As you lie down and begin to feel drowsy, close your eyes and visualise that sign clearly.',
        'Repeat slowly, with meaning: "Next time I see [sign], I will know I\'m dreaming."',
        'Hold that image and intention as consciousness starts to fade. Don\'t force it — let sleep take you while the intention remains active.',
        'If you wake during the night, repeat immediately. The brain is closest to REM and most receptive.',
      ]
    },
    task: {
      text: 'Choose your personal dream sign from your journal entries. Tonight, repeat your MILD phrase — but only when you already feel genuinely sleepy. Don\'t do it lying awake.',
      type: 'affirmation',
    },
    tip: 'Research shows the ideal MILD window is when you\'re about to fall asleep within minutes. Doing it too early (while still alert) reduces effectiveness significantly.'
  },

  {
    day: 5,
    title: 'Choose Your Path',
    subtitle: 'Two strategies — pick one',
    icon: '🔀',
    theory: `Here is something almost no app will tell you clearly: the two most powerful techniques for inducing lucid dreams — **WBTB** and **Audio Cues** — are mutually exclusive. You cannot use both in the same night. Pick one strategy and commit to it.

**Strategy A — Audio Cue (recommended for beginners):**
You sleep normally. Your smart tracker detects REM sleep and plays a cue ("You are dreaming") at low volume. If the conditioning is strong enough, you'll hear it inside the dream and become lucid — without waking up physically.

This works best when: you have a smart bracelet (for accurate REM detection), you've trained the cue response while awake, and you're a lighter sleeper.

**Strategy B — WBTB (Wake Back to Bed):**
You wake after 5–6 hours, stay awake for a few minutes, then return to sleep with MILD or SSILD. You enter REM almost immediately with a half-awake mind — which dramatically increases lucidity.

This works best when: you sleep alone, you can fall back asleep quickly, and you don't mind interrupting sleep.

**Why they conflict:** Audio cues are designed to work while you remain asleep. WBTB requires fully waking up. If you set a WBTB alarm and then play audio cues after going back to sleep — the alarm has already disrupted the precise sleep architecture the cues depend on. Choose one.`,
    technique: {
      name: 'WBTB Protocol (if you choose Strategy B)',
      steps: [
        'Set a single alarm for 5–6 hours after you fall asleep.',
        'When it rings, get up quietly. No bright lights. No phone screen.',
        'Stay awake for no more than 5–10 minutes. Use the bathroom, drink a small glass of water.',
        'Return to bed and do MILD as you drift off — you should fall asleep within 5 minutes.',
        'This is Strategy B: no audio cues tonight.',
      ]
    },
    task: {
      text: 'Decide: Strategy A (Audio Cue, sleep through the night) or Strategy B (WBTB, brief wake in the night). Commit to one and set it up tonight.',
      type: 'alarm',
    },
    tip: 'WBTB critical rule: fall back asleep within 5 minutes of returning to bed — research shows this is the strongest single predictor of success. Do MILD or SSILD immediately on lying down, don\'t wait until more alert. Most beginners find Strategy A (audio cue) easier — no willpower at 4am. Switch to WBTB if cues haven\'t worked after 2 weeks.'
  },

  {
    day: 6,
    title: 'SSILD Technique',
    subtitle: 'The beginner-friendly gateway',
    icon: '👂',
    theory: `SSILD (Senses Initiated Lucid Dream) was developed by practitioner CosmicIron specifically for people who find traditional techniques too demanding. Unlike WILD (which requires staying conscious through the hypnagogic state) or MILD (which requires strong visualisation), SSILD requires almost nothing.

You simply cycle your attention through your senses — passively, without trying to control anything. This gentle process primes the hypnagogic state naturally. The brain does the work.

**Why it works better than you'd expect:** The passive nature is the key. Most techniques fail because the attempt itself keeps you alert. SSILD's passivity allows sleep pressure to build normally while gently shifting your awareness toward the dream state.

SSILD works best after WBTB — but it also works as a standalone technique from the start of the night, just with lower reliability.`,
    technique: {
      name: 'SSILD Cycle',
      steps: [
        'Lie still and comfortable. Close your eyes.',
        '**Vision phase (30s):** Notice whatever appears behind your eyelids. Don\'t try to see anything — just observe passively.',
        '**Hearing phase (30s):** Listen to all sounds, near and far, internal and external. Receive without analysing.',
        '**Body phase (30s):** Feel your body — weight, temperature, any tingling or pulsing. Don\'t move.',
        'Repeat these three phases 4–6 full cycles.',
        'After the final cycle, roll over and fall asleep naturally. Do not stay still trying to hold consciousness.',
      ]
    },
    task: {
      text: 'Use the SSILD timer tonight. If using Strategy B (WBTB), do it after returning to bed. Otherwise, do it as you fall asleep for the first time.',
      type: 'technique',
    },
    tip: 'The most common mistake: evaluating how the cycles feel. "Is it working? I don\'t feel anything." Stop evaluating. Passive observation is the whole technique.'
  },

  {
    day: 7,
    title: 'When It Happens',
    subtitle: 'The first 10 seconds are everything',
    icon: '✨',
    theory: `You've built the foundation. Whether or not you've had a lucid dream yet, you've developed the habits that make them possible and more frequent over time.

When you do become lucid — even for a few seconds — the most common reason people lose it immediately is excitement. The emotional spike of realizing "this is a dream!" is often enough to wake you up.

The technique is counterintuitive: **stay completely calm**. Don't celebrate. Don't immediately try to fly. Stabilise first.

**The first 10 seconds protocol:**
1. Do not shout or make sudden movements
2. Rub your hands together — this is the most effective single stabilisation act
3. Look at your hands in the dream
4. Crouch down and touch the floor — feel the texture
5. Say calmly: "Stabilise" or "Clarity now"

Only after 15–20 seconds of stability should you attempt to direct the dream. And even then — start small. Walk somewhere. Open a door. Flying can come later.`,
    technique: {
      name: 'Stabilisation Protocol',
      steps: [
        'The moment you realise you\'re dreaming — freeze. Do not react with excitement.',
        'Rub your palms together vigorously. Feel the friction. This grounds your attention in the dream body.',
        'Look at your hands for 5 seconds. Really see them.',
        'Crouch and touch the nearest surface. Feel its texture in detail.',
        'Say aloud (in the dream): "Stabilise" or "Clarity now." The dream tends to respond.',
        'Now you have 15–20 seconds. Use them calmly. Explore before you try to control.',
      ]
    },
    task: {
      text: 'Write down three specific things you want to do in your first lucid dream — not "fly" but "fly over the sea at sunset." Specificity works better than vague wishes. Keep this list by your bed.',
      type: 'journal',
    },
    tip: 'Never think about your physical body lying in bed. The moment that thought enters — "I wonder if my arm is really where I think it is" — you will wake up. Stay entirely inside the dream.'
  }
];

// ─────────────────────────────────────────────────────────────
//  TECHNIQUES
// ─────────────────────────────────────────────────────────────

export const TECHNIQUES = [
  {
    id: 'reality-checks',
    name: 'Reality Checks',
    category: 'daytime',
    icon: '🤚',
    description: 'The foundational habit that eventually carries into dreams',
    difficulty: 1,
    bestTime: 'Throughout the day — anchored to actions',
    details: 'Reality checks work by building a habit so ingrained that your dreaming mind replicates it. The physical check is a trigger. The genuine question — "Am I dreaming?" — is the actual technique.',
    steps: [
      'Pinch your nose shut and try to breathe in — in dreams, you can',
      'Look at your hands for 5 seconds — fingers blur or multiply in dreams',
      'Read something, look away, read again — text changes in dreams',
      'Ask genuinely: "Could I be dreaming right now?"',
      'Anchor to actions, not timers: every doorway, every mirror, every phone pickup',
      'Target: 10–15 checks per day',
    ]
  },

  {
    id: 'audio-cue',
    name: 'Audio Cue Training',
    category: 'night',
    icon: '🎧',
    description: 'Train a conditioned response, then trigger it in REM sleep',
    difficulty: 2,
    bestTime: 'Training: daytime. Trigger: REM sleep via smart tracker',
    details: `The brain during sleep is not a binary on/off switch — it's a continuously adjustable filter. During deep sleep, the threshold is high and most sounds are ignored. During REM, the threshold drops: significant stimuli can enter the dream or cause awakening, while neutral background sounds are filtered out.

This is exactly why audio cues work. A random sound would be filtered as unimportant. But a phrase conditioned through weeks of daytime training becomes a significant stimulus — the brain recognises it as meaningful and processes it even during REM. The result: you hear "You are dreaming" inside the dream and the conditioned reflex fires.

Critical: This strategy requires sleeping normally through the night. Do NOT combine with WBTB on the same night.`,
    steps: [
      'Daytime training: play the cue "You are dreaming" using the trainer below — 20 reps daily',
      'Each time you hear it, respond physically: pinch your nose, look at your hands',
      'Say aloud: "When I hear this in a dream, I will know I am sleeping"',
      'Train daily for 1–2 weeks before expecting in-dream results — the reflex builds gradually',
      'At night: set your tracker to play the cue only during detected REM',
      'Volume: low enough not to wake you, but present — the conditioned reflex does the heavy lifting',
      'Do NOT set a WBTB alarm on nights you use audio cues',
    ]
  },

  {
    id: 'wbtb',
    name: 'Wake Back to Bed (WBTB)',
    category: 'night',
    icon: '⏰',
    description: 'Brief awakening to enter REM with a semi-conscious mind',
    difficulty: 2,
    bestTime: '4–6 hours after falling asleep',
    details: `REM cycles get progressively longer through the night. By briefly interrupting sleep at the 4–6 hour mark and returning with intent, you enter REM almost immediately — with your conscious mind unusually alert.

Critical: WBTB is INCOMPATIBLE with the Audio Cue strategy. Choose one per night.`,
    steps: [
      'Set a single alarm for 4–6 hours after you fall asleep (elapsed time, not clock time)',
      'Enable Smart Wake-up (30-min window) so it catches you in a light phase — easier to wake and less disorienting',
      'When it rings: get up quietly. No bright lights. No phone screen (bright light suppresses melatonin and delays re-sleep)',
      'Stay awake 10–15 minutes: bathroom, sip of water. That\'s all',
      'Return to bed. Open Sleep as Android, go to Lucid Dreaming settings, set Later to 1 hour (this is hours from when you press start, not minutes — there is no minute option)',
      'Press the moon icon to start tracking, then put the phone face-down immediately',
      'Do SSILD (3–4 cycles): Vision 10s → Hearing 10s → Body 10s — passive, no effort',
      'Do MILD: repeat 5–10 times "I will hear the signal in my dream and know I am sleeping"',
      'Fall asleep within 5 minutes — research shows this is the single strongest predictor of success',
    ]
  },

  {
    id: 'mild',
    name: 'Mnemonic Induction (MILD)',
    category: 'falling-asleep',
    icon: '🧠',
    description: 'Plant a future intention in your sleeping mind',
    difficulty: 2,
    bestTime: 'When genuinely drowsy — as you fall asleep, or after WBTB',
    details: 'Developed by Dr. Stephen LaBerge at Stanford. MILD uses prospective memory — the ability to remember to do something in the future — to trigger lucidity from inside the dream.\n\nKey research finding: the single strongest predictor of MILD success is falling asleep within 5 minutes of finishing the exercise. Do it when already drowsy.',
    steps: [
      'Choose a personal dream sign from your journal (a recurring element)',
      'As you become genuinely sleepy, close your eyes and visualise that sign',
      'Repeat slowly: "Next time I see [sign], I will know I\'m dreaming"',
      'Let sleep take you while the intention remains present in your mind',
      'If you wake naturally during the night — repeat MILD immediately. That is the best moment.',
    ]
  },

  {
    id: 'ssild',
    name: 'Senses Induced (SSILD)',
    category: 'falling-asleep',
    icon: '👂',
    description: 'Passive sensory cycling — no concentration required',
    difficulty: 1,
    bestTime: 'After WBTB, or as you fall asleep normally',
    details: 'SSILD works because its passivity is the technique. Most methods fail because the attempt keeps you alert. SSILD lets sleep pressure build naturally while gently shifting awareness toward the dream state.',
    steps: [
      'Lie still. Close your eyes.',
      'Vision phase (30s): observe whatever appears behind your eyelids — passively',
      'Hearing phase (30s): listen to all sounds without analysing them',
      'Body phase (30s): feel weight, warmth, any subtle sensations',
      'Repeat for 4–6 full cycles',
      'After the final cycle, roll over and fall asleep — do not try to stay conscious',
    ]
  },

  {
    id: 'wild',
    name: 'Wake Induced (WILD)',
    category: 'falling-asleep',
    icon: '🌀',
    description: 'Maintain consciousness as your body falls asleep',
    difficulty: 5,
    bestTime: 'After WBTB — advanced practitioners only',
    details: 'WILD preserves waking consciousness as you transition directly into REM. Sleep paralysis sensations are expected — they are harmless and mean you\'re close. Most beginners should not attempt this until they have had at least several lucid dreams by other methods.',
    steps: [
      'Use WBTB first — WILD is nearly impossible from a cold start',
      'Return to bed and lie completely still',
      'Watch the hypnagogic imagery (patterns, shapes) without reacting to it',
      'As sleep paralysis begins — tingling, heaviness, sounds — stay calm',
      'Imagine rolling sideways out of bed, or floating upward',
      'You will enter the dream directly, with full consciousness intact',
    ]
  },

  {
    id: 'fild',
    name: 'Finger Induced (FILD)',
    category: 'falling-asleep',
    icon: '🖐️',
    description: 'Micro-movements that keep one foot in wakefulness',
    difficulty: 3,
    bestTime: 'When very drowsy — typically after natural waking at 4–6 hours',
    details: 'FILD works by giving your mind a minimal task that prevents full unconsciousness while your body sleeps. The micro-movements must be imperceptible — the moment they become real movements, the technique breaks.',
    steps: [
      'Wake naturally after 5+ hours and feel genuinely drowsy',
      'Lie completely still. Begin barely, invisibly alternating two fingers — like the ghost of piano playing',
      'No actual movement — just the impulse to move. The fingers should not visibly shift.',
      'After 20–30 seconds, slowly do a nose pinch reality check',
      'If you can breathe through a closed nose — you are dreaming. Stabilise immediately.',
    ]
  },

  {
    id: 'stabilisation',
    name: 'Dream Stabilisation',
    category: 'tool',
    icon: '⚓',
    description: 'The first 10 seconds determine whether you stay or wake',
    difficulty: 1,
    bestTime: 'The moment you become lucid',
    details: 'The most common reason beginners lose their first lucid dream is excitement. The emotional spike of realizing "I\'m dreaming!" is often enough to wake up. These steps override that reflex.',
    steps: [
      'Freeze. Do not celebrate. Do not shout. Stay completely calm.',
      'Rub your palms together vigorously. Feel the friction. This is the most effective single act.',
      'Look at your hands for 5 seconds. Really see them in the dream.',
      'Crouch and touch the nearest surface. Feel its texture.',
      'Say calmly: "Stabilise" or "Clarity now"',
      'Wait 15–20 seconds in this calm state before attempting anything',
      'Never think about your physical body in bed — that thought will immediately wake you',
    ]
  },

  {
    id: 'ssild-timer',
    name: 'SSILD Guided Timer',
    category: 'tool',
    icon: '⏱️',
    description: 'Interactive timer — 5 quick + 4 slow cycles with phase guidance',
    difficulty: 1,
    bestTime: 'After WBTB, or when falling asleep',
    details: 'Runs the correct two-phase SSILD protocol: quick warm-up cycles followed by slow deep cycles. No counting, no clock-watching.',
    steps: []
  },

  {
    id: 'sleep-tracker',
    category: 'tool',
    icon: '📱',
    description: 'How phone & smartwatch tracking actually works — accuracy numbers, placement, honest limits',
    difficulty: 1,
    bestTime: 'Read before setting up Sleep as Android',
    details: 'Understanding what your tracker can and cannot do helps you set realistic expectations and get the most out of it.',
    steps: []
  },

  {
    id: 'dream-recall',
    name: 'Dream Recall Methods',
    category: 'daytime',
    icon: '📝',
    description: 'Journal vs voice recorder vs mental review — ranked by effectiveness',
    difficulty: 1,
    bestTime: 'First 60 seconds after waking',
    details: 'How you record your dreams matters almost as much as whether you record them. The method affects how much you retain and how fast your recall improves.',
    steps: [
      '**Written journal (most effective):** Engages motor, visual, and analytical memory simultaneously. Brain receives the strongest signal that dreams matter. Recall improves within 3–5 days.',
      '**Voice recorder (good compromise):** Speak anything you remember immediately. Review and write key moments later that day. Works well for people who hate writing in the morning.',
      '**Mental review only (least effective):** Working memory holds dream content for 10–30 seconds. One distraction erases it. Can work as a supplement but not a replacement.',
      'After waking: don\'t move. Don\'t open your eyes fully. Let fragments surface for 30 seconds before reaching for pen or recorder.',
      'If you remember nothing, write the date and "no recall." The ritual itself trains the brain to preserve dream memories.',
    ]
  },
];

// ─────────────────────────────────────────────────────────────
//  SUPPORTING DATA
// ─────────────────────────────────────────────────────────────

export const DREAM_SIGNS = [
  'Flying', 'Falling', 'Running slowly', 'School', 'Work', 'Old house',
  'Family member', 'Being chased', 'Missing a train', 'Losing teeth',
  'Being late', 'Can\'t find something', 'Water', 'Mirror', 'Strange door',
  'Numbers changing', 'Childhood friend', 'Dead relative', 'Storm',
  'Being underdressed', 'Phone not working', 'Can\'t run properly',
  'Wrong house layout', 'Talking animal', 'Impossible architecture',
];

export const MOODS = [
  { value: 0,    label: 'Nightmare',  emoji: '😰', color: '#ff4444' },
  { value: 0.25, label: 'Unsettling', emoji: '😟', color: '#ff8844' },
  { value: 0.5,  label: 'Neutral',    emoji: '😐', color: '#aaaacc' },
  { value: 0.75, label: 'Pleasant',   emoji: '🙂', color: '#88aaff' },
  { value: 1,    label: 'Wonderful',  emoji: '😊', color: '#88ffcc' },
];

export const LUCIDITY_LABELS = [
  { level: 0, label: 'Normal Dream', color: 'var(--lucid-0)' },
  { level: 1, label: 'Pre-lucid',    color: 'var(--lucid-1)' },
  { level: 2, label: 'Lucid',        color: 'var(--lucid-2)' },
  { level: 3, label: 'Fully Lucid',  color: 'var(--lucid-3)' },
];

export const ACHIEVEMENTS = [
  { id: 'first-dream',    title: 'First Dream',      desc: 'Record your very first dream entry',       icon: '🌙', target: 1   },
  { id: 'three-days',     title: 'Three Nights',     desc: 'Record dreams 3 days in a row',            icon: '🔥', target: 3   },
  { id: 'week-warrior',   title: 'Week Warrior',     desc: 'Record dreams 7 days in a row',            icon: '⚡', target: 7   },
  { id: 'first-lucid',    title: 'Lucid Newbie',     desc: 'Have your first lucid dream (level 2+)',   icon: '✨', target: 1   },
  { id: 'reality-master', title: 'Reality Master',   desc: 'Complete 100 reality checks',              icon: '🤚', target: 100 },
  { id: 'journalist',     title: 'Dream Journalist', desc: 'Record 20 dreams',                         icon: '📖', target: 20  },
  { id: 'full-lucid',     title: 'Dream Architect',  desc: 'Have a fully lucid dream (level 3)',       icon: '🏛️', target: 1   },
  { id: 'week-complete',  title: '7-Day Graduate',   desc: 'Complete the full 7-day program',          icon: '🎓', target: 7   },
  { id: 'stabiliser',     title: 'Held It Together', desc: 'Stay in a lucid dream for 30+ seconds',   icon: '⚓', target: 1   },
];

export const TIPS = [
  'Waking naturally without an alarm improves dream recall more than almost anything else.',
  'The last 2 hours of sleep are the most REM-rich. Cutting them short kills your practice.',
  'Audio cues and WBTB are mutually exclusive strategies — choose one per night.',
  'MILD works best when you fall asleep within 5 minutes of completing it. Do it when already drowsy.',
  'Reading about lucid dreaming before bed primes the mind for awareness during sleep.',
  'Keep your journal by the bed — reaching for your phone first erases dream memories.',
  'Dream emotions often linger for hours after waking. Notice how your dream colours your morning.',
  'The nose pinch check is the most reliable — you can breathe through a pinched nose in a dream.',
  'Anchoring checks to actions (doorways, mirrors, phone pickups) works far better than timers.',
  'During WBTB, avoid bright light and phone screens — they suppress melatonin and delay re-sleep.',
  'Dreams often begin in a familiar place that is slightly, wrongly different. That wrong detail is your cue.',
  'The clearest lucid dreams come in the 7th and 8th hour of sleep.',
  'Stress compresses REM sleep. A calm day produces better dreams than an anxious one.',
  'Even a single keyword written down immediately on waking can unlock an entire dream memory.',
  'Flying in a lucid dream: don\'t flap. Jump and expect to rise. Expectation drives dream physics.',
  'Rubbing your hands together is the most reliably documented stabilisation technique.',
  'Never think about your body in bed during a lucid dream — that thought causes immediate waking.',
  'The first lucid dream often lasts only 5–10 seconds. That\'s normal. Duration grows with practice.',
  'A smart bracelet improves audio cue accuracy dramatically over a plain timer or phone alone.',
  'Vitamin B6 (taken before sleep) has some research support for increasing dream vividness.',
];
