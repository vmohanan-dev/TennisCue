import { Cue } from '@/types';

export const cues: Cue[] = [
  // === BEGINNER CUES ===

  // General - Beginner
  {
    id: 'gen-1',
    title: 'Watch the Ball',
    shortDescription: 'Keep your eyes on the ball through contact',
    fullDescription:
      'Track the ball from your opponent\'s racket all the way to your strings. Don\'t look up early to see where your shot is going. Trust your stroke and watch the ball compress against your strings.',
    strokeType: 'general',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'gen-2',
    title: 'Split Step',
    shortDescription: 'Small hop before opponent hits',
    fullDescription:
      'Just before your opponent makes contact with the ball, do a small hop and land on the balls of your feet with knees slightly bent. This puts you in an athletic ready position to move in any direction.',
    strokeType: 'general',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'gen-3',
    title: 'Ready Position',
    shortDescription: 'Knees bent, racket in front',
    fullDescription:
      'Stand with feet shoulder-width apart, knees bent, weight on balls of feet. Hold the racket in front of your body with both hands, slightly above waist level. Stay alert and ready to move.',
    strokeType: 'general',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'gen-4',
    title: 'Move Your Feet',
    shortDescription: 'Get to the ball early',
    fullDescription:
      'Start moving as soon as you read the direction of your opponent\'s shot. Take small adjustment steps to position yourself properly. Arriving early gives you time to set up for your shot.',
    strokeType: 'general',
    skillArea: 'footwork',
    level: 'beginner',
  },

  // Forehand - Beginner
  {
    id: 'fh-1',
    title: 'Racket Back Early',
    shortDescription: 'Turn and prepare before the ball bounces',
    fullDescription:
      'As soon as you see the ball coming to your forehand side, turn your shoulders and take your racket back. Your preparation should be complete before the ball bounces on your side. This gives you more time to swing forward smoothly.',
    strokeType: 'forehand',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'fh-2',
    title: 'Low to High',
    shortDescription: 'Swing from low to high for topspin',
    fullDescription:
      'Start your swing with the racket below the ball and finish high over your shoulder. This low-to-high swing path creates natural topspin, helping the ball clear the net and drop into the court.',
    strokeType: 'forehand',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'fh-3',
    title: 'Follow Through',
    shortDescription: 'Complete your swing over your shoulder',
    fullDescription:
      'After contact, let your arm continue naturally up and across your body. Your racket should finish over your opposite shoulder. A complete follow-through ensures you\'re accelerating through the ball, not slowing down at contact.',
    strokeType: 'forehand',
    skillArea: 'follow-through',
    level: 'beginner',
  },

  // Backhand - Beginner
  {
    id: 'bh-1',
    title: 'Two Hands for Control',
    shortDescription: 'Use both hands for stability',
    fullDescription:
      'For beginners, a two-handed backhand offers more control and power. Your non-dominant hand does most of the work while your dominant hand guides the racket. Keep both hands on the grip throughout the swing.',
    strokeType: 'backhand',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'bh-2',
    title: 'Shoulder Turn',
    shortDescription: 'Rotate shoulders to prepare',
    fullDescription:
      'Turn your shoulders so your back faces the net during preparation. This coils your body and allows you to unwind into the shot for more power. Your chin should be near your front shoulder at the start of the swing.',
    strokeType: 'backhand',
    skillArea: 'preparation',
    level: 'beginner',
  },

  // Serve - Beginner
  {
    id: 'sv-1',
    title: 'Toss Consistency',
    shortDescription: 'Toss to the same spot every time',
    fullDescription:
      'A consistent toss is the foundation of a good serve. Hold the ball in your fingertips, not your palm. Lift your arm straight up and release the ball at eye level. The toss should peak at the height where you\'ll make contact.',
    strokeType: 'serve',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'sv-2',
    title: 'Continental Grip',
    shortDescription: 'Hold the racket like a hammer',
    fullDescription:
      'Use a continental grip for serves - hold the racket like you\'re holding a hammer or shaking hands with the edge. This grip allows you to hit flat, slice, and kick serves without changing your hand position.',
    strokeType: 'serve',
    skillArea: 'preparation',
    level: 'beginner',
  },

  // === INTERMEDIATE CUES ===

  // Forehand - Intermediate
  {
    id: 'fh-4',
    title: 'Catch the Racket',
    shortDescription: 'Catch with non-dominant hand on follow-through',
    fullDescription:
      'After your forehand follow-through, catch the racket throat with your non-dominant hand. This ensures a complete follow-through and helps you recover quickly to ready position for the next shot.',
    strokeType: 'forehand',
    skillArea: 'follow-through',
    level: 'intermediate',
  },
  {
    id: 'fh-5',
    title: 'Load the Outside Leg',
    shortDescription: 'Push off your back foot into the shot',
    fullDescription:
      'Transfer your weight from your outside (back) foot to your front foot as you swing. This ground-up power generation adds pace and depth to your forehand. Feel like you\'re pushing the ground away.',
    strokeType: 'forehand',
    skillArea: 'footwork',
    level: 'intermediate',
  },
  {
    id: 'fh-6',
    title: 'Windshield Wiper Finish',
    shortDescription: 'Racket face rolls over for heavy spin',
    fullDescription:
      'For more topspin, finish your forehand with a windshield wiper motion - your forearm rotates so the racket face turns over like a windshield wiper. This adds spin while maintaining racket head speed.',
    strokeType: 'forehand',
    skillArea: 'follow-through',
    level: 'intermediate',
  },

  // Backhand - Intermediate
  {
    id: 'bh-3',
    title: 'Stay Sideways Longer',
    shortDescription: 'Don\'t open up too early',
    fullDescription:
      'Keep your shoulders turned until the moment of contact. Opening up too early causes the ball to spray wide. Your chest should face the side fence longer than feels natural.',
    strokeType: 'backhand',
    skillArea: 'preparation',
    level: 'intermediate',
  },
  {
    id: 'bh-4',
    title: 'Drive Through Contact',
    shortDescription: 'Extend through the ball',
    fullDescription:
      'Don\'t just swing at the ball - drive through it. Imagine pushing the ball toward your target for as long as possible. This extension creates depth and consistency in your backhand.',
    strokeType: 'backhand',
    skillArea: 'contact',
    level: 'intermediate',
  },

  // Serve - Intermediate
  {
    id: 'sv-3',
    title: 'Trophy Position',
    shortDescription: 'Pause at the top with racket behind',
    fullDescription:
      'At the top of your service motion, your body should form a "trophy pose" - tossing arm pointing up, racket arm bent with racket dropping behind your back. This position stores energy for the swing forward.',
    strokeType: 'serve',
    skillArea: 'timing',
    level: 'intermediate',
  },
  {
    id: 'sv-4',
    title: 'Load the Legs',
    shortDescription: 'Bend knees and push up into serve',
    fullDescription:
      'Power in the serve starts from the ground. Bend your knees as you prepare, then push explosively upward as you swing. Your legs should straighten as you reach for the ball.',
    strokeType: 'serve',
    skillArea: 'preparation',
    level: 'intermediate',
  },
  {
    id: 'sv-5',
    title: 'Pronation',
    shortDescription: 'Rotate forearm through contact',
    fullDescription:
      'As you make contact, rotate your forearm inward (like turning a key). This pronation adds power and helps hit different serve types. For a flat serve, pronate through the ball; for slice, pronate across it.',
    strokeType: 'serve',
    skillArea: 'contact',
    level: 'intermediate',
  },

  // Return - Intermediate
  {
    id: 'rt-1',
    title: 'Shorten Your Backswing',
    shortDescription: 'Compact swing for faster serves',
    fullDescription:
      'Against big servers, shorten your preparation. Use the server\'s pace and redirect it back. Think "block and redirect" rather than taking a full swing. This gives you more time to react.',
    strokeType: 'return',
    skillArea: 'preparation',
    level: 'intermediate',
  },

  // Volley - Intermediate
  {
    id: 'vl-1',
    title: 'Punch, Don\'t Swing',
    shortDescription: 'Short, firm motion at the net',
    fullDescription:
      'Volleys require a short, punching motion - not a full swing. Keep your wrist firm and move the racket forward with your shoulder. The ball\'s pace does most of the work; you just redirect it.',
    strokeType: 'volley',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'vl-2',
    title: 'Step Into the Volley',
    shortDescription: 'Move forward with each volley',
    fullDescription:
      'As you hit a volley, step forward with the foot opposite to your hitting side. This forward movement adds power and depth. Never hit a volley while stepping backward.',
    strokeType: 'volley',
    skillArea: 'footwork',
    level: 'intermediate',
  },

  // === ADVANCED CUES ===

  // General - Advanced
  {
    id: 'gen-5',
    title: 'Disguise Your Shots',
    shortDescription: 'Same preparation, different directions',
    fullDescription:
      'Use identical preparation for different shots to keep opponents guessing. Whether hitting crosscourt or down the line, your backswing should look the same. Decide direction at the last moment.',
    strokeType: 'general',
    skillArea: 'mental',
    level: 'advanced',
  },
  {
    id: 'gen-6',
    title: 'Controlled Aggression',
    shortDescription: 'Attack smart, not just hard',
    fullDescription:
      'Being aggressive doesn\'t mean hitting hard every shot. It means taking time away from your opponent, moving them around, and taking calculated risks when the opportunity presents itself.',
    strokeType: 'general',
    skillArea: 'mental',
    level: 'advanced',
  },

  // Forehand - Advanced
  {
    id: 'fh-7',
    title: 'Inside-Out Forehand',
    shortDescription: 'Run around backhand for aggressive forehand',
    fullDescription:
      'When a ball comes to your backhand side but isn\'t too wide, run around it to hit an inside-out forehand. This puts you in an offensive position and hits to most players\' weaker backhand side.',
    strokeType: 'forehand',
    skillArea: 'footwork',
    level: 'advanced',
  },

  // Serve - Advanced
  {
    id: 'sv-6',
    title: 'Kick Serve Height',
    shortDescription: 'Brush up the back of the ball',
    fullDescription:
      'For a kick serve, toss the ball slightly behind and to the left (for righties). Brush up the back of the ball at 7 o\'clock to 1 o\'clock. The ball should jump high off the bounce to the opponent\'s backhand.',
    strokeType: 'serve',
    skillArea: 'contact',
    level: 'advanced',
  },

  // Overhead - Intermediate/Advanced
  {
    id: 'oh-1',
    title: 'Point at the Ball',
    shortDescription: 'Non-racket hand tracks the lob',
    fullDescription:
      'Point at the ball with your non-racket hand as you move under a lob. This helps you track the ball and maintain proper shoulder rotation. Drop your hand as you swing up to hit.',
    strokeType: 'overhead',
    skillArea: 'preparation',
    level: 'intermediate',
  },
];

export const strokeLabels: Record<string, string> = {
  forehand: 'Forehand',
  backhand: 'Backhand',
  serve: 'Serve',
  return: 'Return',
  volley: 'Volley',
  overhead: 'Overhead',
  general: 'General',
};

export const skillAreaLabels: Record<string, string> = {
  footwork: 'Footwork',
  preparation: 'Preparation',
  contact: 'Contact',
  'follow-through': 'Follow-through',
  timing: 'Timing',
  mental: 'Mental',
};

export const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
