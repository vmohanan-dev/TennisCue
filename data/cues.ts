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

  // === NEW CUES - GENERAL ===

  {
    id: 'gen-7',
    title: 'Recover to Center',
    shortDescription: 'Return to middle after every shot',
    fullDescription:
      'After hitting, move back toward the center of the baseline. This neutral position covers both sides of the court equally. Make recovery automatic - it should happen without thinking.',
    strokeType: 'general',
    skillArea: 'recovery',
    level: 'beginner',
  },
  {
    id: 'gen-8',
    title: 'Breathe on Contact',
    shortDescription: 'Exhale as you hit the ball',
    fullDescription:
      'Release your breath as you make contact with the ball. This natural exhale helps you relax through the shot and generates more power. Holding your breath creates tension and tight strokes.',
    strokeType: 'general',
    skillArea: 'timing',
    level: 'beginner',
  },
  {
    id: 'gen-9',
    title: 'Play the Ball Early',
    shortDescription: 'Take time away from opponent',
    fullDescription:
      'Hit the ball on the rise or at the top of the bounce rather than letting it drop. This gives your opponent less time to prepare and puts you in an offensive position. Step into the court.',
    strokeType: 'general',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'gen-10',
    title: 'Use Court Geometry',
    shortDescription: 'Crosscourt is longer and safer',
    fullDescription:
      'The crosscourt shot travels over the lowest part of the net and has more court to land in. Use crosscourt as your default rally ball. Save down-the-line for when you have an opening.',
    strokeType: 'general',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'gen-11',
    title: 'Build the Point',
    shortDescription: 'Work opponent out of position first',
    fullDescription:
      'Don\'t go for winners too early. Move your opponent side to side with deep shots, then attack the short ball. Patience creates opportunities - rushed winners create errors.',
    strokeType: 'general',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'gen-12',
    title: 'Pressure Big Points',
    shortDescription: 'Play aggressive on crucial moments',
    fullDescription:
      'On break points and game points, take calculated risks. Your opponent feels pressure too. A well-placed aggressive shot is better than a tentative push that invites attack.',
    strokeType: 'general',
    skillArea: 'mental',
    level: 'advanced',
  },

  // === NEW CUES - FOREHAND ===

  {
    id: 'fh-8',
    title: 'Unit Turn',
    shortDescription: 'Shoulders and hips rotate together',
    fullDescription:
      'Turn your shoulders and hips as one unit when preparing for your forehand. This coils your body like a spring. Avoid just taking your arm back - the power comes from body rotation.',
    strokeType: 'forehand',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'fh-9',
    title: 'Contact Out Front',
    shortDescription: 'Hit the ball ahead of your body',
    fullDescription:
      'Make contact with the ball well in front of your leading hip. If you hit too late (beside or behind you), you lose power and control. Early preparation lets you meet the ball out front.',
    strokeType: 'forehand',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'fh-10',
    title: 'Brush Up the Ball',
    shortDescription: 'Racket face climbs up the back of ball',
    fullDescription:
      'For topspin, imagine your strings brushing up the back of the ball from 6 o\'clock to 12 o\'clock. The faster you brush, the more spin you create. This helps the ball dip into the court.',
    strokeType: 'forehand',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'fh-11',
    title: 'Open Stance Power',
    shortDescription: 'Rotate hips for wide balls',
    fullDescription:
      'On wide forehands, use an open stance - feet parallel to baseline. Generate power by rotating your hips explosively toward the target. This stance allows faster recovery to center.',
    strokeType: 'forehand',
    skillArea: 'footwork',
    level: 'intermediate',
  },
  {
    id: 'fh-12',
    title: 'Heavy Ball',
    shortDescription: 'More spin equals more margin',
    fullDescription:
      'Hit with heavy topspin by accelerating your racket head steeply upward. The ball clears the net with margin and dips sharply, pushing your opponent back. Trade some pace for spin depth.',
    strokeType: 'forehand',
    skillArea: 'contact',
    level: 'advanced',
  },
  {
    id: 'fh-13',
    title: 'Inside-In Forehand',
    shortDescription: 'Run around backhand, hit down line',
    fullDescription:
      'Run around a ball to your backhand side and hit a forehand down the line to the open court. This aggressive pattern catches opponents off guard and opens up the court for winners.',
    strokeType: 'forehand',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'fh-14',
    title: 'Lag the Racket',
    shortDescription: 'Racket head trails the hand',
    fullDescription:
      'As you swing forward, let your racket head lag behind your hand. This creates a whip effect that generates racket head speed at contact. Don\'t muscle the ball - let the lag create power.',
    strokeType: 'forehand',
    skillArea: 'timing',
    level: 'advanced',
  },

  // === NEW CUES - BACKHAND ===

  {
    id: 'bh-5',
    title: 'Non-Dominant Hand Leads',
    shortDescription: 'Top hand controls the swing',
    fullDescription:
      'On a two-handed backhand, your non-dominant (top) hand is the engine. Think of it like hitting a one-handed forehand with your other hand. Your dominant hand just guides.',
    strokeType: 'backhand',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'bh-6',
    title: 'Eyes to Contact',
    shortDescription: 'Watch ball meet strings',
    fullDescription:
      'Keep your head still and eyes fixed on the contact point through the hit. Don\'t look up to see where the ball goes. Your head turning early pulls your swing off target.',
    strokeType: 'backhand',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'bh-7',
    title: 'Step Across',
    shortDescription: 'Front foot crosses toward sideline',
    fullDescription:
      'Step with your front foot across your body toward the sideline. This closed stance creates better rotation and extension through the ball. Feel your weight transfer forward.',
    strokeType: 'backhand',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'bh-8',
    title: 'Compact Backswing',
    shortDescription: 'Less backswing, more forward swing',
    fullDescription:
      'Keep your backhand preparation short and compact. A shorter backswing gives you more time and makes your swing more repeatable under pressure. Focus energy on the forward swing.',
    strokeType: 'backhand',
    skillArea: 'preparation',
    level: 'intermediate',
  },
  {
    id: 'bh-9',
    title: 'Two-Hand Release',
    shortDescription: 'Let go with top hand for extension',
    fullDescription:
      'Release your non-dominant hand after contact to allow full extension and follow-through. This creates more racket head speed and helps you finish the swing naturally over your shoulder.',
    strokeType: 'backhand',
    skillArea: 'follow-through',
    level: 'intermediate',
  },
  {
    id: 'bh-10',
    title: 'One-Hand Backhand Grip',
    shortDescription: 'Eastern backhand for control',
    fullDescription:
      'For a one-handed backhand, use an eastern backhand grip with the base knuckle on the top bevel. This positions the racket face correctly at contact for a flat or topspin shot.',
    strokeType: 'backhand',
    skillArea: 'preparation',
    level: 'intermediate',
  },
  {
    id: 'bh-11',
    title: 'One-Hand Extension',
    shortDescription: 'Arm fully extended at contact',
    fullDescription:
      'On a one-handed backhand, contact the ball with your arm nearly straight. This gives you maximum reach and power. Bend your knees to get low rather than bending at the waist.',
    strokeType: 'backhand',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'bh-12',
    title: 'Attack Short Balls',
    shortDescription: 'Step in and drive through',
    fullDescription:
      'When a ball lands short to your backhand, move in quickly and take it on the rise. Don\'t let it drop - attack it with forward momentum. Short balls are opportunities, not threats.',
    strokeType: 'backhand',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'bh-13',
    title: 'Disguise Direction',
    shortDescription: 'Same prep, different targets',
    fullDescription:
      'Use identical preparation for crosscourt and down-the-line backhands. Decide direction at the last moment with slight wrist adjustment. This keeps opponents guessing.',
    strokeType: 'backhand',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'bh-14',
    title: 'Running Backhand',
    shortDescription: 'Hit through the ball while moving',
    fullDescription:
      'When stretched wide, plant your outside foot and drive through the ball while still moving. Use an open stance and rotate your hips for power. Recover immediately after contact.',
    strokeType: 'backhand',
    skillArea: 'footwork',
    level: 'advanced',
  },

  // === NEW CUES - SERVE ===

  {
    id: 'sv-7',
    title: 'Toss Arm Straight',
    shortDescription: 'Lift the ball, don\'t throw it',
    fullDescription:
      'Keep your tossing arm straight as you lift the ball. Release at eye level with fingertips pointing up. A bent elbow or flick of the wrist makes the toss inconsistent.',
    strokeType: 'serve',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'sv-8',
    title: 'Feet Position',
    shortDescription: 'Front foot at 45 degrees to baseline',
    fullDescription:
      'Position your front foot at roughly 45 degrees to the baseline, pointing toward the net post. Your back foot should be parallel to the baseline. This stance enables proper rotation.',
    strokeType: 'serve',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'sv-9',
    title: 'Scratch Your Back',
    shortDescription: 'Racket drops behind before swing up',
    fullDescription:
      'Let the racket drop behind your back in the backswing - like scratching your back. This creates the loading position to swing up and out to the ball. Don\'t muscle straight at the toss.',
    strokeType: 'serve',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'sv-10',
    title: 'Reach High',
    shortDescription: 'Contact at full extension',
    fullDescription:
      'Hit the serve at your highest comfortable reach. Full extension gives you the best angle into the service box. If you contact too low, you\'ll hit into the net or long.',
    strokeType: 'serve',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'sv-11',
    title: 'Slice Serve Toss',
    shortDescription: 'Toss slightly right for righties',
    fullDescription:
      'For a slice serve, toss the ball slightly to your right (for right-handers). Strike the ball on its right side at 3 o\'clock, brushing around it. The ball curves away from right-handed receivers.',
    strokeType: 'serve',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'sv-12',
    title: 'Second Serve Spin',
    shortDescription: 'More spin, less pace for safety',
    fullDescription:
      'On second serves, prioritize spin over speed. A heavy kick or slice serve will land in more often than a flat serve hit softer. Spin creates margin and makes returns harder.',
    strokeType: 'serve',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'sv-13',
    title: 'Serve Wide Ad Court',
    shortDescription: 'Pull receiver off court',
    fullDescription:
      'A wide serve to the ad court (to a righty\'s backhand) pulls them off the court, opening up the entire court for your next shot. Follow with an aggressive forehand to the open court.',
    strokeType: 'serve',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'sv-14',
    title: 'Body Serve',
    shortDescription: 'Jam the receiver for weak returns',
    fullDescription:
      'Serve directly at the receiver\'s body, especially on big points. Body serves are hard to return with pace because the receiver can\'t extend. Target the hip area for maximum awkwardness.',
    strokeType: 'serve',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'sv-15',
    title: 'Serve Plus One',
    shortDescription: 'Plan your second shot before serving',
    fullDescription:
      'Know where you\'ll hit your second shot before you serve. A wide serve sets up a forehand to the open court. A body serve often brings a return down the middle. Think two shots ahead.',
    strokeType: 'serve',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'sv-16',
    title: 'Disguise Serve Type',
    shortDescription: 'Same toss, different spins',
    fullDescription:
      'Use a similar toss for flat, slice, and kick serves. Vary the contact point and racket path at the last moment. A readable toss gives away your serve; a disguised one creates free points.',
    strokeType: 'serve',
    skillArea: 'tactics',
    level: 'advanced',
  },

  // === NEW CUES - RETURN ===

  {
    id: 'rt-2',
    title: 'Watch the Toss',
    shortDescription: 'Read serve direction from ball toss',
    fullDescription:
      'The server\'s toss often reveals where the serve is going. A toss to the right (for right-handers) usually means slice out wide. A toss behind the head means kick. Read early and react.',
    strokeType: 'return',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'rt-3',
    title: 'Split Step Timing',
    shortDescription: 'Land as server contacts ball',
    fullDescription:
      'Time your split step to land just as the server makes contact. This puts you in an athletic ready position to move in any direction. Too early or late and you\'ll be caught flat-footed.',
    strokeType: 'return',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'rt-4',
    title: 'Block Return',
    shortDescription: 'Use server\'s pace, minimal swing',
    fullDescription:
      'Against big servers, shorten your swing and block the ball back. Let the server\'s pace do the work. A compact motion with firm wrist redirects the ball deep. Don\'t try to swing hard.',
    strokeType: 'return',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'rt-5',
    title: 'Chip and Charge',
    shortDescription: 'Slice return and rush the net',
    fullDescription:
      'On weaker second serves, slice the return deep and follow it to net. The low skidding ball forces a difficult passing shot attempt. Close quickly and look for the volley winner.',
    strokeType: 'return',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'rt-6',
    title: 'Attack Second Serves',
    shortDescription: 'Step inside baseline and drive',
    fullDescription:
      'Move inside the baseline for second serve returns. Take the ball early on the rise and drive it aggressively. This pressures the server immediately and shortens the point.',
    strokeType: 'return',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'rt-7',
    title: 'Deep Middle Return',
    shortDescription: 'Safest target under pressure',
    fullDescription:
      'When in doubt, return deep down the middle. This high-percentage target takes away angles and gives you time to recover. It\'s better than a risky shot that might miss.',
    strokeType: 'return',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'rt-8',
    title: 'Crosscourt Return',
    shortDescription: 'More margin over lower net',
    fullDescription:
      'Return crosscourt as your default target. The net is lower in the middle, and crosscourt gives you more court to work with. Save down-the-line returns for when you\'re in position.',
    strokeType: 'return',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'rt-9',
    title: 'Return Winners',
    shortDescription: 'Punish weak second serves',
    fullDescription:
      'When you get a short, weak second serve, step in and go for a winner. Don\'t just get it back - attack it. Move forward, take it early, and hit to the open court with conviction.',
    strokeType: 'return',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'rt-10',
    title: 'Change Return Position',
    shortDescription: 'Keep server guessing with position',
    fullDescription:
      'Vary your return position to disrupt the server\'s rhythm. Stand close to attack second serves, far back for big first serves. Move just before the toss to create doubt.',
    strokeType: 'return',
    skillArea: 'tactics',
    level: 'advanced',
  },

  // === NEW CUES - VOLLEY ===

  {
    id: 'vl-3',
    title: 'Continental Grip',
    shortDescription: 'One grip for all volleys',
    fullDescription:
      'Use a continental grip for both forehand and backhand volleys. There\'s no time to change grips at net. The continental allows you to hit either side with the same hand position.',
    strokeType: 'volley',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'vl-4',
    title: 'Bend Your Knees',
    shortDescription: 'Get low for low volleys',
    fullDescription:
      'On low volleys, bend your knees deeply to get your eyes level with the ball. Don\'t bend at the waist - this throws off your balance. Stay low and punch through the ball.',
    strokeType: 'volley',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'vl-5',
    title: 'Racket Out Front',
    shortDescription: 'Keep racket visible in peripheral vision',
    fullDescription:
      'At the net, keep your racket up and in front of you where you can see it. This ready position shortens your reaction time. If the racket drops, you won\'t be ready for fast shots.',
    strokeType: 'volley',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'vl-6',
    title: 'Angle the Face',
    shortDescription: 'Open racket for sharp angles',
    fullDescription:
      'To hit angled volleys, open your racket face slightly and redirect the ball crosscourt. The sharper the angle you want, the more you open the face. Use your opponent\'s pace.',
    strokeType: 'volley',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'vl-7',
    title: 'First Volley Deep',
    shortDescription: 'Approach volley targets depth',
    fullDescription:
      'Your first volley (approach volley) should go deep to push your opponent back. Don\'t try for a winner - set up your second volley. Hit deep to one side, then put away the short reply.',
    strokeType: 'volley',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'vl-8',
    title: 'Split at Net',
    shortDescription: 'Small hop between each volley',
    fullDescription:
      'After each volley, do a small split step to reset. This keeps you balanced and ready for the next shot. Without the split, you\'ll be caught moving the wrong way.',
    strokeType: 'volley',
    skillArea: 'footwork',
    level: 'intermediate',
  },
  {
    id: 'vl-9',
    title: 'Drop Volley',
    shortDescription: 'Soft hands for touch winners',
    fullDescription:
      'For a drop volley, absorb the ball\'s pace with soft hands - let the racket give slightly on contact. Barely clear the net with backspin. Use this when your opponent is deep.',
    strokeType: 'volley',
    skillArea: 'contact',
    level: 'advanced',
  },
  {
    id: 'vl-10',
    title: 'Swing Volley',
    shortDescription: 'Full swing on high balls',
    fullDescription:
      'When you get a high floating ball at net, don\'t just punch it - swing through it like a groundstroke. This aggressive shot can be a clean winner. Stay balanced and aim for depth or angle.',
    strokeType: 'volley',
    skillArea: 'contact',
    level: 'advanced',
  },

  // === NEW CUES - OVERHEAD ===

  {
    id: 'oh-2',
    title: 'Turn Sideways',
    shortDescription: 'Shoulders perpendicular to net',
    fullDescription:
      'As soon as you see a lob, turn sideways with your shoulders perpendicular to the net. This position allows you to track the ball and generate power. Shuffle back while staying sideways.',
    strokeType: 'overhead',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'oh-3',
    title: 'Back Foot First',
    shortDescription: 'Move back with crossover steps',
    fullDescription:
      'For deep lobs, don\'t backpedal - turn and use crossover steps to move back quickly. Keep your eye on the ball and get behind it. It\'s easier to move forward into the smash than backward.',
    strokeType: 'overhead',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'oh-4',
    title: 'Scissor Kick',
    shortDescription: 'Jump and switch legs for power',
    fullDescription:
      'On deep overheads, jump off your back foot and land on your front foot (scissor kick). This athletic move generates power while moving backward. Your legs switch in mid-air like scissors.',
    strokeType: 'overhead',
    skillArea: 'footwork',
    level: 'intermediate',
  },
  {
    id: 'oh-5',
    title: 'High Contact Point',
    shortDescription: 'Hit at full arm extension',
    fullDescription:
      'Contact the overhead at the peak of your reach with arm fully extended. Hitting too low reduces power and angle. Let the ball drop slightly from the peak if needed to find the right height.',
    strokeType: 'overhead',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'oh-6',
    title: 'Aim Deep Center',
    shortDescription: 'Safe target for tough overheads',
    fullDescription:
      'When stretched or off-balance, aim your overhead deep down the middle. Don\'t go for too much angle. A deep overhead keeps you in the point; a missed angle loses it.',
    strokeType: 'overhead',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'oh-7',
    title: 'Bounce Smash',
    shortDescription: 'Let deep lobs bounce first',
    fullDescription:
      'Very deep lobs can be let to bounce. This gives you time to set up properly. After the bounce, you can hit a regular overhead or drive it like a high forehand.',
    strokeType: 'overhead',
    skillArea: 'tactics',
    level: 'advanced',
  },

  // === NEW CUES - APPROACH ===

  {
    id: 'ap-1',
    title: 'Move Through the Shot',
    shortDescription: 'Don\'t stop to hit approach shots',
    fullDescription:
      'Hit your approach shot while moving forward, not standing still. Continue toward the net after contact. Stopping breaks your momentum and gives your opponent more time.',
    strokeType: 'approach',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'ap-2',
    title: 'Split Before Volley',
    shortDescription: 'Stop and balance after approach',
    fullDescription:
      'After hitting your approach shot, do a split step just before your opponent hits. This stops your forward momentum and puts you in position to react for the volley.',
    strokeType: 'approach',
    skillArea: 'footwork',
    level: 'beginner',
  },
  {
    id: 'ap-3',
    title: 'Approach Down the Line',
    shortDescription: 'Close off the passing angle',
    fullDescription:
      'Hit most approach shots down the line, then move to cover that side of the court. This takes away the down-the-line passing shot and forces a difficult crosscourt pass.',
    strokeType: 'approach',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'ap-4',
    title: 'Slice Approach',
    shortDescription: 'Low ball stays low for difficult pass',
    fullDescription:
      'Use slice for approach shots - the low skidding ball forces your opponent to hit up, giving you an easier volley. The backspin keeps the ball from sitting up.',
    strokeType: 'approach',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'ap-5',
    title: 'Depth Over Pace',
    shortDescription: 'Deep approach pins opponent back',
    fullDescription:
      'Your approach shot doesn\'t need to be a winner - depth is more important than pace. A deep ball pushed your opponent back, giving you time to get to net and prepare for the volley.',
    strokeType: 'approach',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'ap-6',
    title: 'Wrong-Foot Approach',
    shortDescription: 'Hit behind the recovering opponent',
    fullDescription:
      'If your opponent is moving to cover one side, hit your approach behind them - to where they came from. This wrong-footing tactic catches them in no-man\'s land.',
    strokeType: 'approach',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'ap-7',
    title: 'Drive Approach',
    shortDescription: 'Attack weak balls with pace',
    fullDescription:
      'On a very short ball, don\'t slice - drive through it with topspin for a potential winner. When you have time and position, the aggressive approach puts immediate pressure on.',
    strokeType: 'approach',
    skillArea: 'contact',
    level: 'advanced',
  },
  {
    id: 'ap-8',
    title: 'Read the Pass',
    shortDescription: 'Watch opponent setup for volley',
    fullDescription:
      'As you approach, watch your opponent\'s racket preparation. An open stance often means crosscourt; closed stance suggests down the line. Read their body to anticipate the pass.',
    strokeType: 'approach',
    skillArea: 'tactics',
    level: 'advanced',
  },

  // === NEW CUES - DROP SHOT ===

  {
    id: 'ds-1',
    title: 'Soft Hands',
    shortDescription: 'Relax grip for touch shots',
    fullDescription:
      'Loosen your grip pressure for drop shots. Tight hands create too much pace. Soft, relaxed hands allow you to absorb pace and drop the ball just over the net with feel.',
    strokeType: 'drop-shot',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'ds-2',
    title: 'Disguise the Shot',
    shortDescription: 'Same preparation as a drive',
    fullDescription:
      'Set up for a drop shot exactly like you would for a normal groundstroke. At the last moment, open the racket face and slow down. If your opponent reads it early, they\'ll run it down.',
    strokeType: 'drop-shot',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'ds-3',
    title: 'Backspin for Bite',
    shortDescription: 'Slice under the ball',
    fullDescription:
      'Use backspin on your drop shot by slicing under the ball. The underspin makes the ball check up after bouncing, or even bounce back toward the net. This gives your opponent less time.',
    strokeType: 'drop-shot',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'ds-4',
    title: 'When Opponent is Deep',
    shortDescription: 'Use when they can\'t reach it',
    fullDescription:
      'The drop shot works best when your opponent is behind the baseline. They have farther to run. If they\'re inside the court, a drop shot is risky - they\'ll reach it easily.',
    strokeType: 'drop-shot',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'ds-5',
    title: 'Follow Your Drop',
    shortDescription: 'Move forward after drop shot',
    fullDescription:
      'After hitting a drop shot, move in toward the net. If your opponent reaches it, they\'ll likely pop it up for an easy volley. Standing back after a drop shot wastes the opportunity.',
    strokeType: 'drop-shot',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'ds-6',
    title: 'Angle Drop Shot',
    shortDescription: 'Cross court with sharp angle',
    fullDescription:
      'Combine the drop shot with angle by hitting it crosscourt short. The ball bounces and runs away from your opponent. This is especially effective on clay courts.',
    strokeType: 'drop-shot',
    skillArea: 'contact',
    level: 'advanced',
  },
  {
    id: 'ds-7',
    title: 'Drop on Return',
    shortDescription: 'Surprise with short return',
    fullDescription:
      'Occasionally drop shot a second serve return. The server expects you to drive it, so they stay back. A well-disguised drop return can be a clean winner or force a desperate scramble.',
    strokeType: 'drop-shot',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'ds-8',
    title: 'Counter-Drop',
    shortDescription: 'Drop shot the drop shot',
    fullDescription:
      'When your opponent hits a drop shot and you reach it, consider dropping it back instead of driving. They\'re likely moving backward expecting a drive. Catch them off guard.',
    strokeType: 'drop-shot',
    skillArea: 'tactics',
    level: 'advanced',
  },

  // === NEW CUES - LOB ===

  {
    id: 'lb-1',
    title: 'High and Deep',
    shortDescription: 'Clear the net player with height',
    fullDescription:
      'When lobbing, aim high enough to clear an outstretched racket and deep enough to land near the baseline. A short lob is an easy smash; a deep one resets the point or wins it.',
    strokeType: 'lob',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'lb-2',
    title: 'Defensive Lob',
    shortDescription: 'Buy time when pulled wide',
    fullDescription:
      'When stretched wide and in trouble, hit a high defensive lob. This gives you time to recover to the center of the court. Height is your friend - it buys time.',
    strokeType: 'lob',
    skillArea: 'tactics',
    level: 'beginner',
  },
  {
    id: 'lb-3',
    title: 'Topspin Lob',
    shortDescription: 'Ball kicks away after bounce',
    fullDescription:
      'Add topspin to your lob by brushing up the back of the ball. The topspin makes the ball dip and then kick forward after bouncing, making it nearly impossible to chase down.',
    strokeType: 'lob',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'lb-4',
    title: 'Lob the Poacher',
    shortDescription: 'Over the head of the net player',
    fullDescription:
      'In doubles, when the net player is poaching aggressively, lob over their head. This punishes over-aggression and makes them think twice about poaching on the next point.',
    strokeType: 'lob',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'lb-5',
    title: 'Lob Recovery',
    shortDescription: 'Move back to center after lobbing',
    fullDescription:
      'After hitting a lob, immediately recover toward the baseline center. Your opponent will likely hit an overhead - give yourself space and time to defend. Don\'t admire your lob.',
    strokeType: 'lob',
    skillArea: 'recovery',
    level: 'intermediate',
  },
  {
    id: 'lb-6',
    title: 'Disguised Lob',
    shortDescription: 'Set up like a passing shot',
    fullDescription:
      'The best lobs look like passing shots until the last moment. Use the same preparation, then lift under the ball. If the net player reads it early, they\'ll get back in time.',
    strokeType: 'lob',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'lb-7',
    title: 'Offensive Lob',
    shortDescription: 'Go for winner over closing net player',
    fullDescription:
      'When a net player closes in for a putaway volley, hit a quick offensive topspin lob. This low-to-high shot clears them by feet, not inches. It can be an outright winner.',
    strokeType: 'lob',
    skillArea: 'contact',
    level: 'advanced',
  },

  // === NEW CUES - SLICE ===

  {
    id: 'sl-1',
    title: 'Continental Grip',
    shortDescription: 'Same grip as serve and volley',
    fullDescription:
      'Use a continental grip for slice groundstrokes - the same grip you use for serves and volleys. This positions the racket face correctly to slide under the ball and create backspin.',
    strokeType: 'slice',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'sl-2',
    title: 'High to Low Path',
    shortDescription: 'Swing down through the ball',
    fullDescription:
      'Start your slice with the racket above the ball, then swing forward and downward through contact. This high-to-low path creates the underspin that makes the ball skid and stay low.',
    strokeType: 'slice',
    skillArea: 'contact',
    level: 'beginner',
  },
  {
    id: 'sl-3',
    title: 'Stay Sideways',
    shortDescription: 'Don\'t open shoulders early',
    fullDescription:
      'Keep your shoulders turned through the slice swing. Opening up too early causes the ball to float or spray wide. Feel like you\'re hitting along the baseline, not across your body.',
    strokeType: 'slice',
    skillArea: 'preparation',
    level: 'beginner',
  },
  {
    id: 'sl-4',
    title: 'Slice Approach Shot',
    shortDescription: 'Low ball for easier volley',
    fullDescription:
      'Use slice for approach shots - the low, skidding ball forces your opponent to hit up, giving you a higher volley. Approach with slice down the line, then close for the volley.',
    strokeType: 'slice',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'sl-5',
    title: 'Defensive Slice',
    shortDescription: 'Float deep when out of position',
    fullDescription:
      'When stretched wide or off balance, use a high, deep slice to buy time. The slower pace and backspin give you time to recover while keeping your opponent back.',
    strokeType: 'slice',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'sl-6',
    title: 'Change of Pace',
    shortDescription: 'Disrupt rhythm with slice',
    fullDescription:
      'Mix slice into your rally patterns to disrupt your opponent\'s timing. After several topspin shots, a slice sits up differently. The change of spin can draw errors.',
    strokeType: 'slice',
    skillArea: 'tactics',
    level: 'intermediate',
  },
  {
    id: 'sl-7',
    title: 'Wide Slice Angle',
    shortDescription: 'Open court with underspin',
    fullDescription:
      'Hit a short, angled slice that pulls your opponent wide off the court. The backspin helps the ball stay short. This opens up the court for an easy winner on the next shot.',
    strokeType: 'slice',
    skillArea: 'contact',
    level: 'intermediate',
  },
  {
    id: 'sl-8',
    title: 'Heavy Slice',
    shortDescription: 'Maximum spin, ball stays down',
    fullDescription:
      'For a heavy slice, exaggerate the high-to-low swing path and really carve under the ball. The extreme backspin makes the ball bite into the court and stay very low.',
    strokeType: 'slice',
    skillArea: 'contact',
    level: 'advanced',
  },
  {
    id: 'sl-9',
    title: 'Slice vs Topspin',
    shortDescription: 'Neutralize heavy hitters',
    fullDescription:
      'Against players who hit with heavy topspin, slice can neutralize their power. The different spin disrupts their rhythm and takes pace off the ball, preventing them from timing their shots.',
    strokeType: 'slice',
    skillArea: 'tactics',
    level: 'advanced',
  },
  {
    id: 'sl-10',
    title: 'Forehand Slice',
    shortDescription: 'Surprise weapon for variety',
    fullDescription:
      'Develop a forehand slice for variety. It\'s unexpected and can catch opponents off guard. Use it as an approach shot or change-up. The same continental grip works here.',
    strokeType: 'slice',
    skillArea: 'contact',
    level: 'advanced',
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
  approach: 'Approach',
  'drop-shot': 'Drop Shot',
  lob: 'Lob',
  slice: 'Slice',
};

export const skillAreaLabels: Record<string, string> = {
  footwork: 'Footwork',
  preparation: 'Preparation',
  contact: 'Contact',
  'follow-through': 'Follow-through',
  timing: 'Timing',
  mental: 'Mental',
  recovery: 'Recovery',
  tactics: 'Tactics',
};

export const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
