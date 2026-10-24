/**
 * Campaign content data.
 *
 * Everything here is data consumed by src/campaign/run.js — starter pools,
 * Trainer Relics, event definitions, shop stock tables, opponent archetypes and
 * Act boss teams. Nothing in this file touches the DOM or the battle engine
 * directly, so adding content never means editing the renderer.
 *
 * Boss teams list *preferred* moves. `run.js` filters them to what the species
 * can legally learn and fills any gap from the level-up pool, and
 * tests/campaign.js asserts that no preferred move is illegal — so a typo here
 * fails the build rather than silently producing a weaker boss.
 */
(function (global) {
  'use strict';

  const RedGPT = global.RedGPT;

  /* ================================================================ *
   * Difficulty and ascension
   * ================================================================ */

  /**
   * Difficulty dials. **These numbers were set by measurement, not by feel** —
   * §6 of `docs/PROJECT_CONTEXT.md` records the clear rate each row produces and
   * the ranked effect of every dial (boss team size dominates; healing fractions
   * are nearly inert). Re-run `tools/balance-probe.js 200 <difficulty>` after
   * touching any of them, and note that `beacons` is also the base
   * `challengeLevel` measures a player's self-chosen shape against.
   */
  const DIFFICULTIES = [
    {
      id: 'normal', name: 'Normal',
      description: 'For learning the systems. Generous rewards, forgiving economy and Trainer-level opponents — but the Act bosses play sharply.',
      aiTier: {trainer: 'casual', elite: 'trainer', boss: 'ace', final: 'ace'},
      enemyLevelOffset: -2, startingCredits: 500, shopPriceMultiplier: 1,
      restHealPercent: 1, battleHealPercent: 0.66, faintReviveFraction: 0.4,
      rerolls: 2, rewardOptions: 3, beacons: 3, bossTeamPenalty: 1,
      unlockedBy: null,
    },
    {
      id: 'veteran', name: 'Veteran',
      description: 'Smarter opponents, tighter economy and fewer rerolls. The intended experience.',
      aiTier: {trainer: 'trainer', elite: 'ace', boss: 'ace', final: 'expert'},
      enemyLevelOffset: -2, startingCredits: 400, shopPriceMultiplier: 1.15,
      restHealPercent: 1, battleHealPercent: 0.62, faintReviveFraction: 0.38,
      rerolls: 1, rewardOptions: 3, beacons: 3, bossTeamPenalty: 1,
      unlockedBy: null,
    },
    {
      id: 'master', name: 'Master',
      description: 'Every opponent plays at Expert level. Expensive shops, the least healing between nodes and only two Rescue Beacons.',
      aiTier: {trainer: 'expert', elite: 'expert', boss: 'expert', final: 'expert'},
      enemyLevelOffset: -2, startingCredits: 300, shopPriceMultiplier: 1.35,
      restHealPercent: 1, battleHealPercent: 0.56, faintReviveFraction: 0.28,
      rerolls: 1, rewardOptions: 2, beacons: 2, bossTeamPenalty: 1,
      unlockedBy: 'veteran',
    },
  ];

  /**
   * Ascension modifiers stack: running at ascension N applies every entry with
   * `level <= N`. They tighten the run economy and improve enemy builds; they
   * never hand the AI illegal stats.
   */
  const ASCENSIONS = [
    {level: 1, name: 'Sharper Elites', description: 'Elite encounters use Expert AI and full six-Pokémon rosters earlier.', effects: {eliteAi: 'expert', eliteTeamBonus: 1}},
    {level: 2, name: 'Thin Supplies', description: 'Rest Sites restore 25% less and shops stock one fewer item.', effects: {restPenalty: 0.25, shopSlots: -1}},
    {level: 3, name: 'Steeper Prices', description: 'Everything in a shop costs 30% more.', effects: {priceMultiplier: 1.3}},
    {level: 4, name: 'Hardened Bosses', description: 'Act bosses gain an extra team member and better spreads.', effects: {bossTeamBonus: 1}},
    {level: 5, name: 'No Second Chances', description: 'Rerolls are removed from drafts and recruitment.', effects: {rerolls: 0}},
    {level: 6, name: 'Long Roads', description: 'Each Act adds two extra rows before the boss.', effects: {extraRows: 2}},
    {level: 7, name: 'Relentless', description: 'Post-battle healing is halved again and Elites appear more often.', effects: {healPenalty: 0.5, eliteWeight: 1.6}},
  ];

  /* ================================================================ *
   * Starter draft pools
   * ================================================================ */

  const STARTER_POOLS = {
    classic: {
      id: 'classic', name: 'Classic Partners', unlockedBy: null,
      description: 'Familiar first partners from across the regions.',
      species: ['bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile',
        'treecko', 'torchic', 'mudkip', 'turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott',
        'chespin', 'fennekin', 'froakie', 'rowlet', 'litten', 'popplio', 'grookey', 'scorbunny', 'sobble',
        'sprigatito', 'fuecoco', 'quaxly'],
    },
    wild: {
      id: 'wild', name: 'Wild Prospects', unlockedBy: 'firstWin',
      description: 'Unevolved Pokémon with strong final stages. Unlocked by completing a run.',
      species: ['larvitar', 'bagon', 'beldum', 'gible', 'dratini', 'axew', 'deino', 'goomy', 'jangmoo',
        'riolu', 'rockruff', 'applin', 'frigibax', 'charcadet', 'tinkatink', 'toxel', 'dreepy',
        'honedge', 'shinx', 'starly', 'zorua'],
    },
    oddities: {
      id: 'oddities', name: 'Odd Specimens', unlockedBy: 'veteranWin',
      description: 'Unusual builds that reward creative teams. Unlocked by winning on Veteran.',
      species: ['shuckle', 'wobbuffet', 'ditto', 'sableye', 'shedinja', 'spiritomb', 'rotom', 'castform',
        'unown', 'delibird', 'stunfisk', 'pyukumuku', 'falinks', 'cramorant', 'morpeko', 'dunsparce',
        'wimpod', 'skrelp', 'mimikyu'],
    },
    tacticians: {
      id: 'tacticians', name: 'Tacticians', unlockedBy: 'veteranAssistWin',
      description: 'Defensive and utility specialists that reward planning. Unlocked by clearing Veteran with Assist Mode battling every fight.',
      species: ['ferrothorn', 'toxapex', 'corviknight', 'clefable', 'gliscor', 'skarmory',
        'hippowdon', 'amoonguss', 'blissey', 'slowbro', 'quagsire', 'mandibuzz',
        'garganacl', 'dondozo', 'grimmsnarl'],
    },
    paragons: {
      id: 'paragons', name: 'Paragons', unlockedBy: 'masterAssistWin',
      description: 'Fully evolved powerhouses. Unlocked by clearing Master with Assist Mode battling every fight.',
      species: ['garchomp', 'dragonite', 'tyranitar', 'metagross', 'hydreigon', 'goodra',
        'kommoo', 'baxcalibur', 'dragapult', 'salamence', 'volcarona', 'ironvaliant',
        'roaringmoon', 'gholdengo', 'kingambit'],
    },
    prodigies: {
      id: 'prodigies', name: 'Prodigies', unlockedBy: 'masterWin',
      description: 'Fully evolved starters at reduced level. Unlocked by winning on Master.',
      species: ['venusaur', 'charizard', 'blastoise', 'meganium', 'typhlosion', 'feraligatr',
        'sceptile', 'blaziken', 'swampert', 'torterra', 'infernape', 'empoleon', 'serperior',
        'emboar', 'samurott', 'decidueye', 'incineroar', 'primarina', 'rillaboom', 'cinderace', 'inteleon',
        'meowscarada', 'skeledirge', 'quaquaval'],
    },
    ascendants: {
      id: 'ascendants', name: 'Ascendants', unlockedBy: 'ascension2',
      description: 'Pseudo-legendaries and their peers, already part-grown. Unlocked at Ascension 2.',
      species: ['dragonair', 'pupitar', 'shelgon', 'metang', 'gabite', 'fraxure', 'zweilous',
        'sliggoo', 'hakamoo', 'arctibax', 'dreepy', 'drakloak', 'lampent', 'rhydon', 'porygon2'],
    },
    apexpredators: {
      id: 'apexpredators', name: 'Apex Predators', unlockedBy: 'ascension5',
      description: 'Punishing offensive picks with real drawbacks. Unlocked at Ascension 5.',
      species: ['slaking', 'regigigas', 'archeops', 'darmanitan', 'basculegion', 'palafin',
        'gyarados', 'crawdaunt', 'weavile', 'lycanrocdusk', 'barraskewda', 'flapple',
        'hawlucha', 'shiftry', 'pawniard'],
    },
    wayfarers: {
      id: 'wayfarers', name: 'Wayfarers', unlockedBy: 'acts5',
      description: 'Slow starters that pay off over a long run. Unlocked by clearing 5 Acts or more.',
      species: ['magikarp', 'feebas', 'wurmple', 'scatterbug', 'kricketot', 'sunkern',
        'azurill', 'igglybuff', 'cleffa', 'tyrogue', 'happiny', 'munchlax', 'riolu',
        'gible', 'larvesta'],
    },
    sprinters: {
      id: 'sprinters', name: 'Sprinters', unlockedBy: 'acts1',
      description: 'Immediate threats that need no time to come online. Unlocked by clearing a single-Act run.',
      species: ['talonflame', 'crobat', 'jolteon', 'aerodactyl', 'sneasler', 'cinderace',
        'meowscarada', 'zeraora', 'regieleki', 'dragapult', 'ironbundle', 'floatzel',
        'electrode', 'ninjask', 'accelgor'],
    },
    menagerie: {
      id: 'menagerie', name: 'Menagerie', unlockedBy: 'recruited60',
      description: 'One of everything: the oddballs, the specialists and the merely strange. Unlocked by recruiting 60 Pokémon.',
      species: ['eevee', 'ditto', 'smeargle', 'rotom', 'castform', 'burmy', 'silvally',
        'zorua', 'indeedee', 'maushold', 'dudunsparce', 'tatsugiri', 'veluza',
        'brambleghast', 'wugtrio'],
    },
  };

  /* ================================================================ *
   * Team plans
   * ================================================================ */

  /**
   * The team the player is trying to build, declared as data.
   *
   * Assist Mode's recommendations are otherwise plan-blind: they score a
   * recruit, an item or a move on general quality, which is right for a
   * balanced team and actively wrong for a specific one. A Trick Room team
   * wants the *slowest* Pokémon on offer; general quality scoring recommends
   * the fastest. A Rain team wants a Damp Rock, which a quality score rates
   * near the bottom of the item pool.
   *
   * Declared rather than branched for the same reason UNLOCKS is: a plan is a
   * row of preferences, and `advisor.js` reads them uniformly instead of
   * carrying eight special cases.
   *
   * **`run.assist.plan` is advisory only.** It lives in `run.assist`, is
   * toggleable mid-run, and must never be read by anything that draws from the
   * run RNG or decides what is *offered* — only by what is *recommended*.
   * Letting it steer generation would desynchronise a seeded run, which is the
   * same rule the other two Assist switches follow.
   *
   * **The rows themselves are not advisory**, and that distinction is the whole
   * reason Rebirth Mode could reuse them. Rebirth opponents are *built* from a
   * plan and a boss *declares* one (`boss.teamPlan`), both drawn from the run
   * RNG at battle-construction time and stored on the battle config. What is
   * forbidden is reading the *player's* Assist setting during generation, not
   * reading this table.
   *
   * Fields:
   *   enablers  `{moves, abilities}` — the thing that switches the plan on. The
   *             advisor weights these hugely while the team has none, because a
   *             payoff piece with no enabler is a dead card.
   *   payoff    `{moves, abilities}` — what cashes in once the enabler is down.
   *   items     item id -> bonus. What the plan wants that quality scoring
   *             would otherwise rate as junk (Damp Rock, Light Clay, Warp Prism).
   *   speed     'fast' | 'slow' | null — the preferred Speed profile. `slow` is
   *             not a typo for Trick Room; it is the whole point of it.
   *   bulk      0-1, how much the plan values raw bulk in a recruit.
   *   statusBias  move id -> multiplier applied to the advisor's status-move
   *             table, so a plan re-weights utility without a second table.
   *   rebirth   Rebirth Mode's doctrine for this plan: `{name, blurb, theme,
   *             effect}`. `theme` is the *type* used to pick a trainer sprite
   *             and name from TRAINER_ARCHETYPES, so themed opposition reuses
   *             that table rather than needing a parallel one. `effect` is the
   *             opening field state, in `Battle.applyFieldEffects`'s JSON shape
   *             minus the side index, which the run supplies.
   *
   * Every plan's `rebirth.effect` is **endless, not primal** (see `ENDLESS` in
   * battle.js): it has no turn counter, and an opposing weather setter, a
   * replacement terrain, Cloud Nine / Air Lock, Defog or Brick Break all still
   * beat it. That was the explicit requirement — persistence without the lock.
   */
  const TEAM_PLANS = [
    {
      id: 'balance', name: 'Balance',
      blurb: 'No specialisation — score everything on general quality.',
      enablers: {moves: [], abilities: []},
      payoff: {moves: [], abilities: []},
      items: {}, speed: null, bulk: 0.5, statusBias: {},
      // No gimmick to remove, so the doctrine is a field that refuses shortcuts
      // rather than one that helps the team: Psychic Terrain blocks priority
      // against anything grounded. Another terrain setter takes it away.
      rebirth: {
        name: 'Warded Field', theme: null,
        blurb: 'Psychic Terrain that will not fade — no priority gets through.',
        effect: {terrain: 'psychic', label: 'A warded field settles over the battlefield — and does not lift.'},
      },
    },
    {
      id: 'hyperoffense', name: 'Hyper Offense',
      blurb: 'Fast attackers and setup sweepers. Trade bulk for pressure.',
      enablers: {moves: [], abilities: []},
      payoff: {
        moves: ['swordsdance', 'dragondance', 'nastyplot', 'shellsmash', 'quiverdance',
          'bellydrum', 'filletaway', 'victorydance', 'shiftgear', 'tailglow', 'calmmind',
          'suckerpunch', 'extremespeed', 'machpunch', 'bulletpunch', 'aquajet', 'iceshard'],
        abilities: ['adaptability', 'sheerforce', 'technician', 'hugepower', 'purepower',
          'moxie', 'beastboost', 'protosynthesis', 'quarkdrive', 'speedboost'],
      },
      items: {lifeorb: 70, focussash: 60, choiceband: 60, choicespecs: 60, choicescarf: 55, powerherb: 40},
      speed: 'fast', bulk: 0.1,
      statusBias: {stealthrock: 1.2, spikes: 1.2, recover: 0.5, roost: 0.5, softboiled: 0.5,
        protect: 0.6, toxic: 0.4, wish: 0.4},
      rebirth: {
        name: 'Endless Tailwind', theme: 'Flying',
        blurb: 'A Tailwind that never drops — every attacker moves first.',
        effect: {own: {tailwind: true}, label: 'A tailwind rises behind the challenger — and keeps blowing.'},
      },
    },
    {
      id: 'stall', name: 'Stall',
      blurb: 'Outlast rather than outdamage. Recovery, chip and hazards.',
      enablers: {moves: [], abilities: []},
      payoff: {
        moves: ['recover', 'roost', 'softboiled', 'milkdrink', 'slackoff', 'strengthsap',
          'toxic', 'willowisp', 'leechseed', 'protect', 'haze', 'wish', 'painsplit',
          'stealthrock', 'spikes', 'toxicspikes', 'defog', 'rapidspin'],
        abilities: ['regenerator', 'unaware', 'magicguard', 'naturalcure', 'poisonheal',
          'intimidate', 'thickfat', 'waterabsorb', 'voltabsorb', 'flashfire'],
      },
      items: {leftovers: 80, rockyhelmet: 70, heavydutyboots: 60, blacksludge: 60, eviolite: 50},
      speed: null, bulk: 1,
      statusBias: {recover: 1.35, roost: 1.35, softboiled: 1.35, slackoff: 1.35, strengthsap: 1.3,
        toxic: 1.5, willowisp: 1.4, leechseed: 1.4, protect: 1.4, haze: 1.5, wish: 1.4,
        swordsdance: 0.4, nastyplot: 0.4, dragondance: 0.4, shellsmash: 0.3},
      rebirth: {
        name: 'Prepared Ground', theme: 'Poison',
        blurb: 'Stealth Rock and Toxic Spikes already down on your side.',
        effect: {foe: {stealthrock: true, toxicspikes: 1},
          label: 'The ground on your side has already been prepared.'},
      },
    },
    {
      id: 'rain', name: 'Rain',
      blurb: 'Set rain, then sweep with Swift Swim and boosted Water moves.',
      enablers: {moves: ['raindance'], abilities: ['drizzle']},
      payoff: {
        moves: ['surf', 'hydropump', 'waterfall', 'aquatail', 'liquidation', 'wavecrash',
          'scald', 'thunder', 'hurricane', 'weatherball', 'muddywater', 'aquajet'],
        abilities: ['swiftswim', 'hydration', 'raindish', 'dryskin', 'stormdrain', 'waterabsorb'],
      },
      items: {damprock: 120, mysticwater: 45, lifeorb: 30},
      speed: null, bulk: 0.3,
      statusBias: {raindance: 2.2},
      rebirth: {
        name: 'Unbroken Downpour', theme: 'Water',
        blurb: 'Rain with no turn counter. Another weather setter still ends it.',
        effect: {weather: 'rain', label: 'The downpour here has no end to it.'},
      },
    },
    {
      id: 'sun', name: 'Sun',
      blurb: 'Set sun, then sweep with Chlorophyll and boosted Fire moves.',
      enablers: {moves: ['sunnyday'], abilities: ['drought', 'orichalcumpulse']},
      payoff: {
        moves: ['solarbeam', 'solarblade', 'fireblast', 'flamethrower', 'overheat',
          'flareblitz', 'weatherball', 'growth', 'eruption', 'heatwave'],
        abilities: ['chlorophyll', 'solarpower', 'flowergift', 'leafguard', 'harvest', 'protosynthesis'],
      },
      items: {heatrock: 120, charcoal: 45, lifeorb: 30},
      speed: null, bulk: 0.3,
      statusBias: {sunnyday: 2.2, growth: 1.6},
      rebirth: {
        name: 'Unsetting Sun', theme: 'Fire',
        blurb: 'Sunlight with no turn counter. Another weather setter still ends it.',
        effect: {weather: 'sun', label: 'The sun overhead does not move.'},
      },
    },
    {
      id: 'trickroom', name: 'Trick Room',
      blurb: 'Invert Speed for five turns, then hit first with the slowest thing you own.',
      enablers: {moves: ['trickroom'], abilities: []},
      payoff: {
        moves: ['gyroball', 'avalanche', 'bodypress', 'highhorsepower', 'earthquake'],
        abilities: ['slowstart', 'sheerforce', 'hugepower', 'purepower', 'levitate'],
      },
      // Warp Prism is this project's own item: Trick Room 5 -> 8 turns.
      items: {warpprism: 140, roomservice: 60, lifeorb: 35, assaultvest: 30},
      speed: 'slow', bulk: 0.7,
      statusBias: {trickroom: 2.4, agility: 0.2, dragondance: 0.5},
      rebirth: {
        name: 'Sealed Dimensions', theme: 'Psychic',
        blurb: 'Trick Room that never expires — your Speed stays a liability.',
        effect: {pseudoWeather: ['trickroom'], label: 'The dimensions here are twisted shut.'},
      },
    },
    {
      id: 'stickyweb', name: 'Sticky Web',
      blurb: 'Drop the opposing team a Speed stage, then outrun everything.',
      enablers: {moves: ['stickyweb'], abilities: []},
      payoff: {
        moves: ['stealthrock', 'spikes', 'toxicspikes', 'swordsdance', 'nastyplot',
          'dragondance', 'taunt', 'suckerpunch'],
        abilities: ['sturdy', 'prankster', 'moxie', 'sheerforce'],
      },
      items: {focussash: 90, heavydutyboots: 50, lifeorb: 40, redcard: 30},
      speed: 'fast', bulk: 0.2,
      statusBias: {stickyweb: 2.4, stealthrock: 1.3, spikes: 1.3, taunt: 1.3, defog: 0.5},
      rebirth: {
        name: 'Woven Ground', theme: 'Bug',
        blurb: 'Sticky Web and Stealth Rock already waiting on your side.',
        effect: {foe: {stickyweb: true, stealthrock: true},
          label: 'Silk and pointed stones already cover your side of the field.'},
      },
    },
    {
      id: 'screens', name: 'Screens',
      blurb: 'Halve incoming damage, then set up behind it.',
      enablers: {moves: ['reflect', 'lightscreen', 'auroraveil'], abilities: []},
      payoff: {
        moves: ['swordsdance', 'dragondance', 'nastyplot', 'shellsmash', 'quiverdance',
          'calmmind', 'batonpass', 'taunt'],
        abilities: ['prankster', 'snowwarning', 'moxie', 'speedboost'],
      },
      items: {lightclay: 130, lifeorb: 45, focussash: 35},
      speed: 'fast', bulk: 0.3,
      statusBias: {reflect: 2, lightscreen: 2, auroraveil: 2.2, taunt: 1.2},
      rebirth: {
        name: 'Standing Screens', theme: 'Fairy',
        blurb: 'Reflect and Light Screen already up, and they do not expire.',
        effect: {own: {reflect: true, lightscreen: true},
          label: 'Screens are already standing, and they show no sign of thinning.'},
      },
    },
    {
      id: 'sand', name: 'Sandstorm',
      blurb: 'Set sand, then grind behind Rock/Ground/Steel bulk and Sand Rush cleanup.',
      enablers: {moves: ['sandstorm'], abilities: ['sandstream', 'sandspit']},
      payoff: {
        moves: ['earthquake', 'stoneedge', 'rockslide', 'ironhead', 'highhorsepower',
          'rockblast', 'bodypress', 'crunch', 'stealthrock', 'shoreup'],
        abilities: ['sandrush', 'sandforce', 'sandveil', 'solidrock', 'sturdy', 'roughskin'],
      },
      // Smooth Rock is sand's Damp Rock: correct for the plan, junk on paper.
      items: {smoothrock: 120, leftovers: 40, assaultvest: 35, lifeorb: 30, rockyhelmet: 30},
      speed: null, bulk: 0.7,
      statusBias: {sandstorm: 2.2, stealthrock: 1.3, spikes: 1.2, shoreup: 1.3},
      rebirth: {
        name: 'Ceaseless Erosion', theme: 'Rock',
        blurb: 'A sandstorm with no turn counter. Another weather setter still ends it.',
        effect: {weather: 'sandstorm', label: 'The sand here never settles.'},
      },
    },
  ];

  const teamPlan = id => TEAM_PLANS.find(p => p.id === id) || TEAM_PLANS[0];

  /* ================================================================ *
   * Meta unlocks
   * ================================================================ */

  /**
   * Everything a profile can unlock, as data.
   *
   * These used to be a run of hardcoded `if` statements inside
   * `campaign-ui.finaliseRun` — meta-progression logic living in a UI file,
   * where nothing could test it and every new unlock meant another branch.
   * Declaring them lets `Campaign.evaluateUnlocks` award them, the run-setup
   * screen list what is still locked and why, and a test assert every one of
   * them is reachable.
   *
   * `requires` is a set of conditions, all of which must hold:
   *   won              the run must have been cleared
   *   difficulty       cleared on this difficulty or harder
   *   assistOnly       cleared without playing a battle by hand
   *   ascension        the run's Ascension level was at least this
   *   acts             the run was at least this many Acts long
   *   recruited        lifetime Pokémon recruited across all runs
   *   clears           lifetime cleared runs
   *
   * `grants` is `{track, id}` — the profile array to push onto.
   */
  const UNLOCKS = [
    // --- clearing runs -------------------------------------------------
    {
      id: 'wild', grants: {track: 'starterPools', id: 'wild'},
      name: 'Wild Prospects', requires: {won: true},
      hint: 'Clear a run.',
    },
    {
      id: 'oddities', grants: {track: 'starterPools', id: 'oddities'},
      name: 'Odd Specimens', requires: {won: true, difficulty: 'veteran'},
      hint: 'Clear a run on Veteran.',
    },
    {
      id: 'prodigies', grants: {track: 'starterPools', id: 'prodigies'},
      name: 'Prodigies', requires: {won: true, difficulty: 'master'},
      hint: 'Clear a run on Master.',
    },
    {
      id: 'tacticians', grants: {track: 'starterPools', id: 'tacticians'},
      name: 'Tacticians', requires: {won: true, difficulty: 'veteran', assistOnly: true},
      hint: 'Clear Veteran with Assist Mode battling every fight.',
    },
    {
      id: 'paragons', grants: {track: 'starterPools', id: 'paragons'},
      name: 'Paragons', requires: {won: true, difficulty: 'master', assistOnly: true},
      hint: 'Clear Master with Assist Mode battling every fight.',
    },

    // --- Ascension -----------------------------------------------------
    {
      id: 'ascendants', grants: {track: 'starterPools', id: 'ascendants'},
      name: 'Ascendants', requires: {won: true, ascension: 2},
      hint: 'Clear a run at Ascension 2 or higher.',
    },
    {
      id: 'apexpredators', grants: {track: 'starterPools', id: 'apexpredators'},
      name: 'Apex Predators', requires: {won: true, ascension: 5},
      hint: 'Clear a run at Ascension 5 or higher.',
    },
    {
      id: 'relicascendant', grants: {track: 'relics', id: 'ascendantsigil'},
      name: 'Ascendant Sigil', requires: {won: true, ascension: 3},
      hint: 'Clear a run at Ascension 3 or higher.',
    },
    {
      id: 'relicunbroken', grants: {track: 'relics', id: 'unbrokenwill'},
      name: 'Unbroken Will', requires: {won: true, ascension: 7},
      hint: 'Clear a run at Ascension 7.',
    },

    // --- run length ----------------------------------------------------
    {
      id: 'wayfarers', grants: {track: 'starterPools', id: 'wayfarers'},
      name: 'Wayfarers', requires: {won: true, acts: 5},
      hint: 'Clear a run of 5 Acts or more.',
    },
    {
      id: 'relicpathfinder', grants: {track: 'relics', id: 'pathfindersmap'},
      name: "Pathfinder's Map", requires: {won: true, acts: 4},
      hint: 'Clear a run of 4 Acts or more.',
    },
    {
      id: 'relicmarathon', grants: {track: 'relics', id: 'marathonrations'},
      name: 'Marathon Rations', requires: {won: true, acts: 8},
      hint: 'Clear a full 8-Act run.',
    },
    {
      id: 'sprinters', grants: {track: 'starterPools', id: 'sprinters'},
      name: 'Sprinters', requires: {won: true, acts: 1},
      hint: 'Clear a single-Act run.',
    },

    // --- lifetime recruiting -------------------------------------------
    {
      id: 'relicscoutnet', grants: {track: 'relics', id: 'scoutsnetwork'},
      name: "Scout's Network", requires: {recruited: 25},
      hint: 'Recruit 25 Pokémon across all runs.',
    },
    {
      id: 'menagerie', grants: {track: 'starterPools', id: 'menagerie'},
      name: 'Menagerie', requires: {recruited: 60},
      hint: 'Recruit 60 Pokémon across all runs.',
    },
    {
      id: 'relicfullhouse', grants: {track: 'relics', id: 'fullhouse'},
      name: 'Full House', requires: {recruited: 120},
      hint: 'Recruit 120 Pokémon across all runs.',
    },
  ];

  /**
   * Does a finished run (plus lifetime records) satisfy an unlock?
   * @param {object} entry     an UNLOCKS row
   * @param {object} context   `{won, difficulty, assistOnly, ascension, acts, recruited, clears}`
   */
  function unlockSatisfied(entry, context) {
    const need = entry.requires || {};
    if (need.won && !context.won) return false;
    if (need.difficulty) {
      const order = ['normal', 'veteran', 'master'];
      if (order.indexOf(context.difficulty) < order.indexOf(need.difficulty)) return false;
    }
    if (need.assistOnly && !context.assistOnly) return false;
    if (need.ascension != null && (context.ascension ?? -1) < need.ascension) return false;
    if (need.acts != null && (context.acts ?? 0) < need.acts) return false;
    if (need.recruited != null && (context.recruited ?? 0) < need.recruited) return false;
    if (need.clears != null && (context.clears ?? 0) < need.clears) return false;
    return true;
  }

  /* ================================================================ *
   * Trainer Relics
   * ================================================================ */

  /**
   * Relics are run-scoped passives, distinct from held items. They change how a
   * run is routed and budgeted rather than inflating raw damage.
   *
   * Hooks (all optional, all called by run.js):
   *   onBattleEnd(run, context)      after a won encounter
   *   onNodeEnter(run, node)
   *   onActStart(run, act)
   *   onShopStock(run, stock)        mutate the generated shop stock
   *   modifiers                      declarative numeric adjustments
   */
  const RELICS = [
    {
      id: 'fieldmedic', name: 'Field Medic Kit', rarity: 'common',
      description: 'Recover an extra 15% of max HP after every ordinary battle.',
      modifiers: {battleHealBonus: 0.15},
    },
    {
      id: 'eliteinsurance', name: 'Elite Insurance', rarity: 'uncommon',
      description: 'Fully restore HP and status after defeating an Elite encounter.',
      modifiers: {eliteFullHeal: true},
    },
    {
      id: 'bargainchip', name: 'Bargain Chip', rarity: 'common',
      description: 'Shops stock one extra item and charge 15% less.',
      modifiers: {shopSlots: 1, priceMultiplier: 0.85},
    },
    {
      id: 'scoutdrone', name: 'Scout Drone', rarity: 'common',
      description: 'Reveals the opposing team composition during Team Preview for every encounter.',
      modifiers: {revealOpponent: true},
    },
    {
      id: 'talentscout', name: 'Talent Scout', rarity: 'uncommon',
      description: 'Recruitment offers show one extra candidate, and the first reroll each Act is free.',
      modifiers: {recruitOptions: 1, freeRerollPerAct: 1},
    },
    {
      id: 'trainerslicence', name: "Trainer's Licence", rarity: 'uncommon',
      description: 'Rest Sites can also teach a Pokémon any move it can legally learn.',
      modifiers: {restTeachesMove: true},
    },
    {
      id: 'riskledger', name: 'Risk Ledger', rarity: 'uncommon',
      description: 'Elite encounters and Act bosses pay 60% more credits.',
      modifiers: {hardEncounterCredits: 1.6},
    },
    {
      id: 'gemcutter', name: 'Gem Cutter', rarity: 'rare',
      description: 'Reward screens offer one extra choice.',
      modifiers: {rewardOptions: 1},
    },
    {
      id: 'evolutionstone', name: 'Resonant Stone', rarity: 'rare',
      description: 'Pokémon that evolve by item can evolve at a Rest Site for free.',
      modifiers: {freeItemEvolution: true},
    },
    {
      id: 'expshare', name: 'Shared Experience', rarity: 'uncommon',
      description: 'The team gains one extra level for every Act boss defeated.',
      modifiers: {bossLevelBonus: 1},
    },
    {
      id: 'hazardkit', name: 'Hazard Kit', rarity: 'common',
      description: 'Your side starts every battle with entry hazards already cleared and immune to Sticky Web on the first switch.',
      modifiers: {hazardImmunityFirstTurn: true},
    },
    {
      id: 'quartermaster', name: 'Quartermaster', rarity: 'rare',
      description: 'Start each Act with two Super Potions and one Full Restore.',
      modifiers: {actSupplies: {superpotion: 2, fullrestore: 1}},
    },
    {
      id: 'typechart', name: 'Annotated Type Chart', rarity: 'common',
      description: 'Move buttons show exact expected damage against the active opponent.',
      modifiers: {showDamagePreview: true},
    },
    {
      id: 'secondwind', name: 'Second Wind', rarity: 'rare',
      description: 'The first Pokémon to faint in each battle is revived at 50% HP after the battle ends.',
      modifiers: {reviveFirstFaint: true},
    },
    {
      id: 'emergencybeacon', name: 'Spare Beacon Array', rarity: 'rare',
      description: 'Gain one extra Rescue Beacon at the start of every Act.',
      modifiers: {beaconsPerAct: 1},
    },
    {
      id: 'sponsorship', name: 'Corporate Sponsorship', rarity: 'common',
      description: 'Gain 40 extra credits for every node cleared.',
      modifiers: {creditsPerNode: 40},
    },
    {
      id: 'movetutorpass', name: 'Move Tutor Pass', rarity: 'uncommon',
      description: 'TM rewards offer four moves instead of three.',
      modifiers: {tmOptions: 1},
    },
    {
      /*
       * The only stackable relic. Rerolls otherwise refill once per Act and
       * nothing in a run can raise the allowance, so a long run has exactly as
       * many rerolls as a short one — `maxStack` makes this the one relic worth
       * seeing twice. `grantRelic` applies the extra reroll immediately as well as
       * raising the per-Act refill, because "for the rest of the run" starts on
       * pickup, not at the next Act.
       */
      id: 'scoutstally', name: "Scout's Tally", rarity: 'uncommon',
      description: 'Permanently gain one extra reroll, now and at the start of every Act. Stacks up to three times.',
      modifiers: {bonusRerolls: 1},
      maxStack: 3,
    },
    {
      id: 'itemsatchel', name: 'Deep Satchel', rarity: 'uncommon',
      description: 'Treasure nodes always contain a held item in addition to their normal reward.',
      modifiers: {treasureBonusItem: true},
    },
    {
      id: 'trailmap', name: 'Annotated Trail Map', rarity: 'common',
      description: 'Reveals the reward attached to every node on the current Act map.',
      modifiers: {revealNodeRewards: true},
    },
    /*
     * Unlockable relics. These are not in the ordinary reward pool until the
     * profile has earned them (see UNLOCKS); `unlockedBy` is what gates them,
     * and `randomRelic` filters on it. They are deliberately utility rather
     * than raw power, in keeping with the rest of the table.
     */
    {
      id: 'ascendantsigil', name: 'Ascendant Sigil', rarity: 'rare', unlockedBy: 'relicascendant',
      description: 'One extra reroll every Act, and 40 extra credits from every node.',
      modifiers: {freeRerollPerAct: 1, creditsPerNode: 40},
    },
    {
      id: 'unbrokenwill', name: 'Unbroken Will', rarity: 'rare', unlockedBy: 'relicunbroken',
      description: 'One extra Rescue Beacon each Act, and the first Pokémon to faint each battle revives.',
      modifiers: {beaconsPerAct: 1, reviveFirstFaint: true},
    },
    {
      id: 'pathfindersmap', name: "Pathfinder's Map", rarity: 'uncommon', unlockedBy: 'relicpathfinder',
      description: 'Reveals every node reward on the Act map, and the opposing team before each battle.',
      modifiers: {revealNodeRewards: true, revealOpponent: true},
    },
    {
      id: 'marathonrations', name: 'Marathon Rations', rarity: 'uncommon', unlockedBy: 'relicmarathon',
      description: 'Recover an extra 20% after every battle, and start each Act with extra supplies.',
      modifiers: {battleHealBonus: 0.2, actSupplies: {hyperpotion: 1, maxether: 1}},
    },
    {
      id: 'scoutsnetwork', name: "Scout's Network", rarity: 'uncommon', unlockedBy: 'relicscoutnet',
      description: 'Recruit offers and reward screens each show one extra option.',
      modifiers: {recruitOptions: 1, rewardOptions: 1},
    },
    {
      id: 'fullhouse', name: 'Full House', rarity: 'rare', unlockedBy: 'relicfullhouse',
      description: 'Releasing a Pokémon refunds 200 credits.',
      modifiers: {releaseRefund: 200},
    },
  ];

  /* ================================================================ *
   * Events
   * ================================================================ */

  /**
   * Event definitions. `requires(run)` gates availability; each choice has a
   * `label`, optional `detail`, an optional `enabled(run)` predicate and an
   * `apply(run, api)` that returns a result message. `api` exposes the safe
   * mutation helpers from run.js.
   */
  const EVENTS = [
    {
      id: 'healingspring', title: 'The Healing Spring', weight: 10,
      sprite: 'HIKER GEN 1 RB.png', background: 'Waterfall.png',
      text: 'A spring bubbles up through cracked stone, faintly luminous. Your Pokémon edge toward it, then hesitate. Something metallic glints at the bottom.',
      choices: [
        {
          label: 'Rest in the spring', detail: 'Fully restore the team.',
          apply: (run, api) => { api.healTeam(1); return 'The whole team surfaces refreshed. Every scrape closes over.'; },
        },
        {
          label: 'Retrieve the object', detail: 'Take a held item, heal nothing.',
          apply: (run, api) => {
            const item = api.grantRandomHeldItem();
            return item ? `You fish out a ${item}. The water clouds and stops glowing.` : 'You find nothing but silt.';
          },
        },
        {
          label: 'Investigate the source', detail: 'Risk: fight a guardian. Reward: credits and healing.',
          apply: (run, api) => {
            api.queueBattle({kind: 'wild', theme: 'Water', levelOffset: 1, reward: {credits: 220, heal: 1}});
            return 'Something enormous uncoils beneath the surface.';
          },
        },
      ],
    },
    {
      id: 'researcher', title: 'The Field Researcher', weight: 10,
      sprite: 'SCIENTIST FEMALE GEN 6.png', background: 'Library.png',
      text: '"Fascinating team," she says, already taking notes. "I can adjust exactly one of them. Free of charge — the data is payment enough."',
      choices: [
        {
          label: 'Change an Ability', detail: 'Swap one Pokémon to another of its legal abilities.',
          apply: (run, api) => api.openAbilitySwap(),
        },
        {
          label: 'Teach an unusual move', detail: 'Teach one Pokémon any move it can legally learn.',
          apply: (run, api) => api.openMoveTutor({free: true}),
        },
        {
          label: 'Decline politely', detail: 'Gain 150 credits for the interview.',
          apply: (run, api) => { api.addCredits(150); return 'She pays you for twenty minutes of your time instead.'; },
        },
      ],
    },
    {
      id: 'abandonedgym', title: 'The Abandoned Gym', weight: 9,
      sprite: 'BLACK BELT GEN 1 RB.png', background: 'Dark City.jpg',
      text: 'The lights still work. The scoreboard still works. Someone has left a training regimen taped to the wall, and a locker hanging open.',
      choices: [
        {
          label: 'Run the regimen', detail: 'Gain a team level. Costs 25% of current HP.',
          apply: (run, api) => { api.damageTeam(0.25); api.addLevels(1); return 'Brutal, but effective. The whole team is visibly sharper.'; },
        },
        {
          label: 'Search the locker', detail: 'Take whatever is inside.',
          apply: (run, api) => {
            const item = api.grantRandomConsumable(2);
            return `Inside: ${item}. Someone left in a hurry.`;
          },
        },
        {
          label: 'Leave it alone', detail: 'Nothing happens.',
          apply: () => 'You close the door behind you and move on.',
        },
      ],
    },
    {
      id: 'blackmarket', title: 'The Back Room', weight: 8,
      sprite: 'BURGLAR GEN 1 RB.png', background: 'Damp Cave.jpg',
      text: 'The dealer never quite looks at you. "Sealed goods. No refunds, no inspections. Cheaper than the shops for a reason."',
      choices: [
        {
          label: 'Buy a sealed crate', detail: 'Costs 200 credits. Contains a random held item.',
          enabled: run => run.credits >= 200,
          apply: (run, api) => {
            api.spendCredits(200);
            const item = api.grantRandomHeldItem({rarityBoost: 1});
            return `The crate contains a ${item}. Not bad, actually.`;
          },
        },
        {
          label: 'Sell a held item', detail: 'Trade a bagged held item for 180 credits.',
          enabled: run => Object.keys(run.bag.held || {}).length > 0,
          apply: (run, api) => api.openItemSale(180),
        },
        {
          label: 'Report the operation', detail: 'Gain a Trainer Relic. The dealer disappears.',
          apply: (run, api) => {
            const relic = api.grantRelic();
            return relic ? `A grateful official hands you a ${relic}.` : 'The authorities thank you, but have nothing to give.';
          },
        },
      ],
    },
    {
      id: 'strandedtrainer', title: 'The Stranded Trainer', weight: 9,
      sprite: 'CAMPER GEN 2.png', background: 'Forest.jpg',
      text: 'A young trainer sits on a rock beside a fainted Pokémon. "I can\'t get it to a centre in time," they say. "Please."',
      choices: [
        {
          label: 'Give up supplies', detail: 'Spend 120 credits. They join you.',
          enabled: run => run.credits >= 120,
          apply: (run, api) => {
            api.spendCredits(120);
            return api.offerRecruit({count: 2, quality: 'good', reason: 'The trainer insists you take their partner.'});
          },
        },
        {
          label: 'Battle them for it', detail: 'They recover their nerve. Win to recruit.',
          apply: (run, api) => {
            api.queueBattle({kind: 'trainer', theme: null, levelOffset: 0, reward: {credits: 120, recruit: {count: 2, quality: 'good'}}});
            return '"Fine. If you can beat me, I\'ll believe you can look after it."';
          },
        },
        {
          label: 'Walk on', detail: 'Nothing happens.',
          apply: () => 'You keep walking. It sits with you for a while.',
        },
      ],
    },
    {
      id: 'ancientshrine', title: 'The Ancient Shrine', weight: 7,
      sprite: 'CHANNELER GEN 1 RB.png', background: 'Sky Pillar.jpg',
      text: 'Offerings sit on cracked stone: coins, berries, a single unopened container. The air is very still.',
      choices: [
        {
          label: 'Make an offering', detail: 'Spend 250 credits for a Trainer Relic.',
          enabled: run => run.credits >= 250,
          apply: (run, api) => {
            api.spendCredits(250);
            const relic = api.grantRelic();
            return relic ? `The air warms. You leave carrying a ${relic}.` : 'The shrine accepts your coins and gives nothing.';
          },
        },
        {
          label: 'Take the container', detail: 'Gain an evolution item. Lose 20% of team HP.',
          apply: (run, api) => {
            api.damageTeam(0.2);
            const item = api.grantEvolutionItem();
            return `Something objects, loudly. You leave with a ${item} and a headache.`;
          },
        },
        {
          label: 'Pray', detail: 'Restore 50% HP to the team.',
          apply: (run, api) => { api.healTeam(0.5); return 'Nothing visible happens, but everyone stands a little straighter.'; },
        },
      ],
    },
    {
      id: 'movecoach', title: 'The Move Coach', weight: 8,
      sprite: 'VETERAN FEMALE GEN 6.png', background: 'Meadow.jpg',
      text: '"Most trainers never audit their own movesets," she says. "Show me one of yours and I\'ll fix it."',
      choices: [
        {
          label: 'Accept the audit', detail: 'Teach one Pokémon any legal move.',
          apply: (run, api) => api.openMoveTutor({free: true}),
        },
        {
          label: 'Ask about held items', detail: 'Rearrange held items and take one from her stock.',
          apply: (run, api) => {
            const item = api.grantRandomHeldItem();
            return `She hands over a spare ${item} and talks you through your item spread.`;
          },
        },
        {
          label: 'Spar instead', detail: 'A battle. Winning grants a team level.',
          apply: (run, api) => {
            api.queueBattle({kind: 'elite', theme: null, levelOffset: 1, reward: {credits: 200, levels: 1}});
            return 'She is already sending out her lead.';
          },
        },
      ],
    },
    {
      id: 'wildherd', title: 'The Herd', weight: 8,
      sprite: 'PICNICKER GEN 2.png', background: 'Meadow.jpg',
      text: 'A dozen Pokémon graze in the open. Most ignore you. One is watching very carefully.',
      choices: [
        {
          label: 'Approach carefully', detail: 'Recruit one of three candidates.',
          apply: (run, api) => api.offerRecruit({count: 3, quality: 'normal', reason: 'Three of them are willing to come along.'}),
        },
        {
          label: 'Set a trap', detail: 'Costs 100 credits. Recruit from a stronger pool.',
          enabled: run => run.credits >= 100,
          apply: (run, api) => {
            api.spendCredits(100);
            return api.offerRecruit({count: 2, quality: 'good', reason: 'The bait works better than expected.'});
          },
        },
        {
          label: 'Gather berries instead', detail: 'Gain consumables.',
          apply: (run, api) => {
            const item = api.grantRandomConsumable(3);
            return `You leave the herd alone and forage instead: ${item}.`;
          },
        },
      ],
    },
    {
      id: 'brokenmachine', title: 'The Broken Machine', weight: 6,
      sprite: 'SUPER NERD GEN 1 RB.png', background: 'Library.png',
      text: 'A stat-tuning machine, clearly out of service, clearly still powered. The interface accepts input.',
      choices: [
        {
          label: 'Retune a Pokémon', detail: 'Change one Pokémon\'s nature.',
          apply: (run, api) => api.openNatureChange(),
        },
        {
          label: 'Strip it for parts', detail: 'Gain 200 credits.',
          apply: (run, api) => { api.addCredits(200); return 'The copper alone is worth the trip.'; },
        },
        {
          label: 'Overclock it', detail: 'Gain a team level, but the whole team is left at 60% HP.',
          apply: (run, api) => {
            api.addLevels(1);
            api.setTeamHpCeiling(0.6);
            return 'It works. It also throws sparks for a full minute afterwards.';
          },
        },
      ],
    },
    {
      id: 'rivalcheck', title: 'The Rival', weight: 7,
      sprite: 'BLUE GEN 1 RB.png', background: 'City.jpg',
      text: '"Still going?" They look over your roster with an expression you can\'t read. "Let\'s see where you actually are."',
      choices: [
        {
          label: 'Accept the battle', detail: 'A tough fight for a large reward.',
          apply: (run, api) => {
            api.queueBattle({kind: 'elite', theme: null, levelOffset: 2, reward: {credits: 320, relic: true}});
            return 'They send out their lead before you finish answering.';
          },
        },
        {
          label: 'Trade information', detail: 'Reveal every node on the rest of the Act.',
          apply: (run, api) => { api.revealMap(); return 'They sketch the route ahead on the back of a receipt.'; },
        },
        {
          label: 'Ask for supplies', detail: 'Gain 2 Hyper Potions and a Full Restore.',
          apply: (run, api) => {
            api.addConsumable('hyperpotion', 2);
            api.addConsumable('fullrestore', 1);
            return '"Don\'t say I never gave you anything."';
          },
        },
      ],
    },
  ];

  /* ================================================================ *
   * Opponent archetypes
   * ================================================================ */

  /** Ordinary and Elite Trainers: a type theme plus a sprite and a name. */
  const TRAINER_ARCHETYPES = [
    {name: 'Bug Catcher', sprite: 'BUG CATCHER GEN 1 RB.png', theme: 'Bug', tier: 'trainer'},
    {name: 'Youngster', sprite: 'YOUNGSTER GEN 1 RB.png', theme: 'Normal', tier: 'trainer'},
    {name: 'Lass', sprite: 'LASS GEN 1 RB.png', theme: 'Fairy', tier: 'trainer'},
    {name: 'Hiker', sprite: 'HIKER GEN 1 RB.png', theme: 'Rock', tier: 'trainer'},
    {name: 'Swimmer', sprite: 'SWIMMER FEMALE 2 GEN 6.png', theme: 'Water', tier: 'trainer'},
    {name: 'Firebreather', sprite: 'FIREBREATHER.png', theme: 'Fire', tier: 'trainer'},
    {name: 'Psychic', sprite: 'PSYCHIC FEMALE GEN 3 RS.png', theme: 'Psychic', tier: 'trainer'},
    {name: 'Black Belt', sprite: 'BLACK BELT GEN 1 RB.png', theme: 'Fighting', tier: 'trainer'},
    {name: 'Channeler', sprite: 'CHANNELER GEN 1 RB.png', theme: 'Ghost', tier: 'trainer'},
    {name: 'Biker', sprite: 'BIKER GEN 1 RB.png', theme: 'Poison', tier: 'trainer'},
    {name: 'Engineer', sprite: 'ENGINEER GEN 1 RB.png', theme: 'Electric', tier: 'trainer'},
    {name: 'Gardener', sprite: 'AROMA LADY GEN 3.png', theme: 'Grass', tier: 'trainer'},
    {name: 'Skier', sprite: 'ACE TRAINER SNOW.png', theme: 'Ice', tier: 'trainer'},
    {name: 'Ruin Maniac', sprite: 'RUIN MANIAC GEN 3.png', theme: 'Ground', tier: 'trainer'},
    {name: 'Bird Keeper', sprite: 'BIRD KEEPER GEN 1 RB.png', theme: 'Flying', tier: 'trainer'},
    {name: 'Collector', sprite: 'COLLECTOR GEN 3.png', theme: 'Dragon', tier: 'trainer'},
    {name: 'Burglar', sprite: 'BURGLAR GEN 1 RB.png', theme: 'Dark', tier: 'trainer'},
    {name: 'Machinist', sprite: 'WORKER 2 GEN 6.png', theme: 'Steel', tier: 'trainer'},

    {name: 'Ace Trainer', sprite: 'ACE TRAINER.png', theme: null, tier: 'elite'},
    {name: 'Veteran', sprite: 'VETERAN FEMALE GEN 6.png', theme: null, tier: 'elite'},
    {name: 'Tower Duelist', sprite: 'ANABEL GEN 3.png', theme: null, tier: 'elite'},
    {name: 'Arena Champion', sprite: 'ARGENTA.png', theme: null, tier: 'elite'},
    {name: 'Circuit Ace', sprite: 'DAHLIA.png', theme: null, tier: 'elite'},
    {name: 'League Scout', sprite: 'PALMER.png', theme: null, tier: 'elite'},
    {name: 'Syndicate Enforcer', sprite: 'TEAM ROCKET EXECUTIVE FEMALE GEN 2.png', theme: 'Dark', tier: 'elite'},
    {name: 'Grand Duelist', sprite: 'DARACH CAITLIN.png', theme: null, tier: 'elite'},
  ];

  /* ================================================================ *
   * Act bosses
   * ================================================================ */

  /**
   * Each boss is a constructed team with a stated plan. `members` lists species
   * with the item, ability and preferred moves that make the plan work.
   *
   * Two fields describe the strategy and they are not the same thing. `plan` is
   * the prose name shown to the player ("Rain Offence"); **`teamPlan` is the
   * `TEAM_PLANS` id** the team is actually built around. Until this existed the
   * bosses named `raincaller` and `trickroom` only *implied* their theme through
   * their movesets, so nothing in the code could act on it. It now decides the
   * boss's Rebirth Mode doctrine and which species the Ascension "Hardened
   * Bosses" filler member is drawn from.
   */
  const BOSSES = [
    {
      id: 'galewarden', name: 'Gale Warden Aeris', act: 1, sprite: 'BIRD KEEPER GEN 1 RB.png',
      background: 'Sky Pillar.jpg',
      plan: 'Priority Flying Offence', teamPlan: 'hyperoffense',
      description: 'Fast Flying attackers backed by Gale Wings priority and pivoting; punishes slow, passive teams.',
      intro: '"Nothing you own is faster than what I brought," she says.',
      members: [
        {species: 'talonflame', ability: 'Gale Wings', item: 'heavydutyboots', nature: 'jolly', role: 'sweeper',
          moves: ['bravebird', 'flareblitz', 'uturn', 'roost'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'staraptor', ability: 'Reckless', item: 'choicescarf', nature: 'jolly', role: 'sweeper',
          moves: ['bravebird', 'closecombat', 'uturn', 'doubleedge'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'crobat', ability: 'Infiltrator', item: 'blacksludge', nature: 'jolly', role: 'bulkyattacker',
          moves: ['bravebird', 'crosspoison', 'roost', 'defog'], evs: {hp: 252, atk: 128, spe: 128}},
        {species: 'altaria', ability: 'Natural Cure', item: 'leftovers', nature: 'adamant', role: 'setup',
          moves: ['dragondance', 'dragonclaw', 'earthquake', 'roost'], evs: {hp: 252, atk: 128, spe: 128}},
        {species: 'gyarados', ability: 'Intimidate', item: 'lumberry', nature: 'jolly', role: 'setup',
          moves: ['dragondance', 'waterfall', 'crunch', 'earthquake'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'noivern', ability: 'Infiltrator', item: 'lifeorb', nature: 'timid', role: 'sweeper',
          moves: ['hurricane', 'dracometeor', 'flamethrower', 'uturn'], evs: {spa: 252, spe: 252, hp: 4}},
      ],
    },
    {
      id: 'embercircle', name: 'Ember Circle Adept Fen', act: 1, sprite: 'FIREBREATHER.png',
      background: 'Desert.jpg',
      plan: 'Sun Pressure', teamPlan: 'sun',
      description: 'Sets sun with Drought, burns physical attackers and grinds through with Lava Plume and recovery.',
      intro: '"Warm up," he says, entirely without warmth.',
      members: [
        {species: 'torkoal', ability: 'Drought', item: 'heatrock', nature: 'bold', role: 'wall',
          moves: ['lavaplume', 'bodypress', 'rapidspin', 'yawn'], evs: {hp: 252, def: 252, spa: 4}},
        {species: 'arcanine', ability: 'Intimidate', item: 'lifeorb', nature: 'adamant', role: 'bulkyattacker',
          moves: ['flareblitz', 'extremespeed', 'wildcharge', 'morningsun'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'camerupt', ability: 'Solid Rock', item: 'leftovers', nature: 'modest', role: 'bulkyattacker',
          moves: ['earthpower', 'lavaplume', 'stealthrock', 'yawn'], evs: {hp: 252, spa: 252, def: 4}},
        {species: 'ninetales', ability: 'Drought', item: 'heavydutyboots', nature: 'timid', role: 'setup',
          moves: ['fireblast', 'solarbeam', 'nastyplot', 'willowisp'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'houndoom', ability: 'Flash Fire', item: 'choicespecs', nature: 'timid', role: 'sweeper',
          moves: ['fireblast', 'darkpulse', 'sludgebomb', 'suckerpunch'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'magcargo', ability: 'Flame Body', item: 'rockyhelmet', nature: 'bold', role: 'wall',
          moves: ['lavaplume', 'powergem', 'stealthrock', 'recover'], evs: {hp: 252, def: 252, spa: 4}},
      ],
    },
    {
      id: 'raincaller', name: 'Tidecaller Nerissa', act: 2, sprite: 'NESSA MASTERS.png',
      background: 'Deep Sea.jpg',
      plan: 'Rain Offence', teamPlan: 'rain',
      description: 'Sets permanent rain, then attacks with Swift Swim sweepers and perfect-accuracy Thunder.',
      intro: '"Everything here runs downhill," she says, "and you are downhill."',
      members: [
        {species: 'pelipper', ability: 'Drizzle', item: 'damprock', nature: 'bold', role: 'support',
          moves: ['hurricane', 'surf', 'uturn', 'roost'], evs: {hp: 252, def: 252, spd: 4}},
        {species: 'barraskewda', ability: 'Swift Swim', item: 'choiceband', nature: 'adamant', role: 'sweeper',
          moves: ['liquidation', 'closecombat', 'psychicfangs', 'flipturn'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'kingdra', ability: 'Swift Swim', item: 'choicespecs', nature: 'modest', role: 'sweeper',
          moves: ['hydropump', 'dracometeor', 'surf', 'flipturn'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'ludicolo', ability: 'Swift Swim', item: 'lifeorb', nature: 'modest', role: 'sweeper',
          moves: ['hydropump', 'gigadrain', 'icebeam', 'raindance'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'seismitoad', ability: 'Swift Swim', item: 'leftovers', nature: 'adamant', role: 'bulkyattacker',
          moves: ['earthquake', 'liquidation', 'stealthrock', 'knockoff'], evs: {hp: 252, atk: 252, spe: 4}},
        {species: 'zapdos', ability: 'Static', item: 'heavydutyboots', nature: 'timid', role: 'bulkyattacker',
          moves: ['thunder', 'hurricane', 'heatwave', 'roost'], evs: {hp: 252, spa: 128, spe: 128}},
      ],
    },
    {
      id: 'sandlord', name: 'Duneshaper Kasim', act: 2, sprite: 'MAXIE GEN 3.png',
      background: 'Rocky Desert.jpg',
      plan: 'Sandstorm Grind', teamPlan: 'sand',
      description: 'Permanent sand, Rock/Ground/Steel synergy and Sand Rush cleanup once your walls are chipped.',
      intro: '"Erosion is patient," he says. "I am not. But it is."',
      members: [
        {species: 'tyranitar', ability: 'Sand Stream', item: 'smoothrock', nature: 'adamant', role: 'bulkyattacker',
          moves: ['stoneedge', 'crunch', 'earthquake', 'stealthrock'], evs: {hp: 252, atk: 252, spd: 4}},
        {species: 'excadrill', ability: 'Sand Rush', item: 'lifeorb', nature: 'adamant', role: 'sweeper',
          moves: ['earthquake', 'ironhead', 'rockslide', 'rapidspin'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'hippowdon', ability: 'Sand Stream', item: 'leftovers', nature: 'impish', role: 'wall',
          moves: ['earthquake', 'slackoff', 'whirlwind', 'stealthrock'], evs: {hp: 252, def: 252, spd: 4}},
        {species: 'garchomp', ability: 'Rough Skin', item: 'rockyhelmet', nature: 'jolly', role: 'setup',
          moves: ['earthquake', 'dragonclaw', 'stoneedge', 'swordsdance'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'ferrothorn', ability: 'Iron Barbs', item: 'leftovers', nature: 'relaxed', role: 'wall',
          moves: ['gyroball', 'powerwhip', 'spikes', 'leechseed'], evs: {hp: 252, def: 252, spd: 4}},
        {species: 'gigalith', ability: 'Sand Stream', item: 'assaultvest', nature: 'adamant', role: 'bulkyattacker',
          moves: ['stoneedge', 'earthquake', 'heavyslam', 'bodypress'], evs: {hp: 252, atk: 252, def: 4}},
      ],
    },
    {
      id: 'trickroom', name: 'Warden Solveig', act: 2, sprite: 'MELONY.png',
      background: 'Ice Cave.jpg',
      plan: 'Trick Room', teamPlan: 'trickroom',
      description: 'Inverts the Speed order, then attacks with enormously slow, enormously strong Pokémon.',
      intro: '"You are very fast," she says. "For the next five turns, that is a liability."',
      members: [
        {species: 'porygon2', ability: 'Download', item: 'eviolite', nature: 'quiet', role: 'support',
          moves: ['trickroom', 'triattack', 'icebeam', 'recover'], evs: {hp: 252, spa: 252, def: 4}},
        {species: 'hatterene', ability: 'Magic Bounce', item: 'leftovers', nature: 'quiet', role: 'bulkyattacker',
          moves: ['trickroom', 'psychic', 'dazzlinggleam', 'mysticalfire'], evs: {hp: 252, spa: 252, def: 4}},
        {species: 'rhyperior', ability: 'Solid Rock', item: 'lifeorb', nature: 'brave', role: 'bulkyattacker',
          moves: ['earthquake', 'stoneedge', 'megahorn', 'icepunch'], evs: {hp: 252, atk: 252, def: 4}},
        {species: 'conkeldurr', ability: 'Guts', item: 'flameorb', nature: 'brave', role: 'bulkyattacker',
          moves: ['drainpunch', 'knockoff', 'facade', 'machpunch'], evs: {hp: 252, atk: 252, def: 4}},
        {species: 'torkoal', ability: 'Drought', item: 'charcoal', nature: 'quiet', role: 'bulkyattacker',
          moves: ['eruption', 'solarbeam', 'earthpower', 'yawn'], evs: {hp: 252, spa: 252, def: 4}},
        {species: 'melmetal', ability: 'Iron Fist', item: 'leftovers', nature: 'brave', role: 'bulkyattacker',
          moves: ['doubleironbash', 'earthquake', 'thunderpunch', 'protect'], evs: {hp: 252, atk: 252, def: 4}},
      ],
    },
    {
      id: 'hazardlock', name: 'Quartermaster Vey', act: 3, sprite: 'GRIMSLEY GEN 7.png',
      background: 'Dark City.jpg',
      plan: 'Hazard Lock', teamPlan: 'stall',
      description: 'Stacks Stealth Rock, Spikes and Toxic Spikes, then forces switches until your team is worn to nothing.',
      intro: '"I do not need to beat your Pokémon," he says. "I need to beat your switches."',
      members: [
        {species: 'skarmory', ability: 'Sturdy', item: 'rockyhelmet', nature: 'impish', role: 'wall',
          moves: ['spikes', 'stealthrock', 'bodypress', 'roost'], evs: {hp: 252, def: 252, spd: 4}},
        {species: 'toxapex', ability: 'Regenerator', item: 'blacksludge', nature: 'bold', role: 'wall',
          moves: ['toxicspikes', 'recover', 'surf', 'haze'], evs: {hp: 252, def: 252, spd: 4}},
        {species: 'corviknight', ability: 'Mirror Armor', item: 'leftovers', nature: 'impish', role: 'wall',
          moves: ['bravebird', 'bodypress', 'roost', 'defog'], evs: {hp: 252, def: 252, spd: 4}},
        {species: 'gliscor', ability: 'Poison Heal', item: 'toxicorb', nature: 'impish', role: 'wall',
          moves: ['earthquake', 'toxic', 'roost', 'knockoff'], evs: {hp: 252, def: 252, spe: 4}},
        {species: 'blissey', ability: 'Natural Cure', item: 'leftovers', nature: 'calm', role: 'wall',
          moves: ['softboiled', 'seismictoss', 'stealthrock', 'thunderwave'], evs: {hp: 252, spd: 252, def: 4}},
        {species: 'dragapult', ability: 'Infiltrator', item: 'choiceband', nature: 'jolly', role: 'sweeper',
          moves: ['dragondarts', 'phantomforce', 'uturn', 'suckerpunch'], evs: {atk: 252, spe: 252, hp: 4}},
      ],
    },
    {
      id: 'sunburst', name: 'Solar Priest Ignaz', act: 3, sprite: 'KABU.png',
      background: 'Desert.jpg',
      plan: 'Sun Offence', teamPlan: 'sun',
      description: 'Permanent sun, Chlorophyll sweepers and Fire attacks that stop being resisted once anything is burned.',
      intro: '"You are welcome to hide," he says. "There is no shade."',
      members: [
        {species: 'torkoal', ability: 'Drought', item: 'heatrock', nature: 'bold', role: 'support',
          moves: ['eruption', 'lavaplume', 'stealthrock', 'rapidspin'], evs: {hp: 252, def: 252, spa: 4}},
        {species: 'venusaur', ability: 'Chlorophyll', item: 'lifeorb', nature: 'modest', role: 'sweeper',
          moves: ['gigadrain', 'sludgebomb', 'weatherball', 'growth'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'lilligant', ability: 'Chlorophyll', item: 'focussash', nature: 'timid', role: 'setup',
          moves: ['quiverdance', 'petaldance', 'sleeppowder', 'gigadrain'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'chandelure', ability: 'Flash Fire', item: 'choicescarf', nature: 'timid', role: 'sweeper',
          moves: ['fireblast', 'shadowball', 'energyball', 'trick'], evs: {spa: 252, spe: 252, hp: 4}},
        {species: 'garchomp', ability: 'Rough Skin', item: 'lifeorb', nature: 'jolly', role: 'sweeper',
          moves: ['earthquake', 'outrage', 'firefang', 'swordsdance'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'volcarona', ability: 'Flame Body', item: 'heavydutyboots', nature: 'timid', role: 'setup',
          moves: ['quiverdance', 'fierydance', 'bugbuzz', 'gigadrain'], evs: {spa: 252, spe: 252, hp: 4}},
      ],
    },
    {
      id: 'setupwarden', name: 'Ascendant Kora', act: 3, sprite: 'IRIS GEN 5 BW2.png',
      background: 'Sky Pillar.jpg',
      plan: 'Setup Sweep', teamPlan: 'screens',
      description: 'Builds one unstoppable win condition behind screens, hazards and priority insurance.',
      intro: '"One of my six only needs a single free turn," she says. "You have to stop all of them."',
      members: [
        {species: 'grimmsnarl', ability: 'Prankster', item: 'lightclay', nature: 'careful', role: 'support',
          moves: ['reflect', 'lightscreen', 'spiritbreak', 'thunderwave'], evs: {hp: 252, spd: 252, def: 4}},
        {species: 'dragonite', ability: 'Multiscale', item: 'lumberry', nature: 'adamant', role: 'setup',
          moves: ['dragondance', 'outrage', 'earthquake', 'extremespeed'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'volcarona', ability: 'Flame Body', item: 'heavydutyboots', nature: 'timid', role: 'setup',
          moves: ['quiverdance', 'fierydance', 'bugbuzz', 'roost'], evs: {hp: 252, spa: 128, spe: 128}},
        {species: 'cloyster', ability: 'Skill Link', item: 'focussash', nature: 'jolly', role: 'setup',
          moves: ['shellsmash', 'iciclespear', 'rockblast', 'liquidation'], evs: {atk: 252, spe: 252, hp: 4}},
        {species: 'gliscor', ability: 'Poison Heal', item: 'toxicorb', nature: 'jolly', role: 'setup',
          moves: ['swordsdance', 'earthquake', 'facade', 'roost'], evs: {hp: 252, spe: 252, atk: 4}},
        {species: 'kingambit', ability: 'Defiant', item: 'leftovers', nature: 'adamant', role: 'setup',
          moves: ['swordsdance', 'kowtowcleave', 'suckerpunch', 'ironhead'], evs: {hp: 252, atk: 252, spe: 4}},
      ],
    },
  ];

  const FINAL_BOSS = {
    id: 'championsyn', name: 'Champion Sylvaine', act: 4, sprite: 'CYNTHIA ANIME 2.png',
    background: 'Elite Four.png',
    plan: 'Balanced Championship Team', teamPlan: 'balance',
    description: 'No gimmick to exploit: hazard control, a defensive backbone, two win conditions and Expert decision-making.',
    intro: '"You have beaten specialists," she says. "I do not specialise."',
    members: [
      {species: 'garchomp', ability: 'Rough Skin', item: 'rockyhelmet', nature: 'jolly', role: 'bulkyattacker',
        moves: ['earthquake', 'dragonclaw', 'stealthrock', 'swordsdance'], evs: {hp: 128, atk: 128, spe: 252}},
      {species: 'toxapex', ability: 'Regenerator', item: 'blacksludge', nature: 'bold', role: 'wall',
        moves: ['surf', 'toxic', 'recover', 'haze'], evs: {hp: 252, def: 252, spd: 4}},
      {species: 'corviknight', ability: 'Pressure', item: 'leftovers', nature: 'impish', role: 'wall',
        moves: ['bravebird', 'bodypress', 'roost', 'uturn'], evs: {hp: 252, def: 252, spd: 4}},
      {species: 'hydreigon', ability: 'Levitate', item: 'choicespecs', nature: 'timid', role: 'sweeper',
        moves: ['darkpulse', 'dracometeor', 'flashcannon', 'uturn'], evs: {spa: 252, spe: 252, hp: 4}},
      {species: 'volcarona', ability: 'Flame Body', item: 'heavydutyboots', nature: 'timid', role: 'setup',
        moves: ['quiverdance', 'fierydance', 'bugbuzz', 'roost'], evs: {hp: 248, spa: 8, spe: 252}},
      {species: 'kingambit', ability: 'Supreme Overlord', item: 'leftovers', nature: 'adamant', role: 'setup',
        moves: ['kowtowcleave', 'suckerpunch', 'ironhead', 'swordsdance'], evs: {hp: 252, atk: 252, spd: 4}},
    ],
  };

  /* ================================================================ *
   * Shops and rewards
   * ================================================================ */

  /** Consumables usable outside battle during a run. */
  const CONSUMABLES = {
    potion: {id: 'potion', name: 'Potion', price: 90, effect: 'heal', amount: 60, sprite: 'potion.png', description: 'Restores 60 HP to one Pokémon.'},
    superpotion: {id: 'superpotion', name: 'Super Potion', price: 180, effect: 'heal', amount: 140, sprite: 'super-potion.png', description: 'Restores 140 HP to one Pokémon.'},
    hyperpotion: {id: 'hyperpotion', name: 'Hyper Potion', price: 320, effect: 'heal', amount: 260, sprite: 'hyper-potion.png', description: 'Restores 260 HP to one Pokémon.'},
    fullrestore: {id: 'fullrestore', name: 'Full Restore', price: 520, effect: 'fullheal', sprite: 'full-restore.png', description: 'Fully restores HP, status and PP for one Pokémon.'},
    fullheal: {id: 'fullheal', name: 'Full Heal', price: 150, effect: 'status', sprite: 'full-heal.png', description: 'Cures any status condition.'},
    revive: {id: 'revive', name: 'Revive', price: 400, effect: 'revive', amount: 0.5, sprite: 'revive.png', description: 'Revives a fainted Pokémon with half HP.'},
    maxrevive: {id: 'maxrevive', name: 'Max Revive', price: 800, effect: 'revive', amount: 1, sprite: 'max-revive.png', description: 'Revives a fainted Pokémon with full HP.'},
    ether: {id: 'ether', name: 'Ether', price: 160, effect: 'pp', amount: 10, sprite: 'ether.png', description: 'Restores 10 PP to every move of one Pokémon.'},
    maxether: {id: 'maxether', name: 'Max Ether', price: 340, effect: 'pp', amount: 999, sprite: 'max-ether.png', description: 'Fully restores PP for one Pokémon.'},
    teamrations: {id: 'teamrations', name: 'Team Rations', price: 600, effect: 'teamheal', amount: 0.5, sprite: 'lava-cookie.png', description: 'Restores 50% max HP to the entire party.'},
  };

  /**
   * Held items offered as rewards and shop stock, by rarity tier.
   * Every entry is implemented in src/core/items.js.
   */
  const HELD_ITEM_POOL = {
    common: ['leftovers', 'blacksludge', 'sitrusberry', 'lumberry', 'expertbelt', 'muscleband', 'wiseglasses',
      'silkscarf', 'charcoal', 'mysticwater', 'magnet', 'miracleseed', 'nevermeltice', 'blackbelt', 'poisonbarb',
      'softsand', 'sharpbeak', 'twistedspoon', 'silverpowder', 'hardstone', 'spelltag', 'dragonfang', 'blackglasses',
      'metalcoat', 'fairyfeather', 'oranberry', 'persimberry', 'chestoberry'],
    uncommon: ['focussash', 'lifeorb', 'rockyhelmet', 'assaultvest', 'heavydutyboots', 'lightclay', 'eviolite',
      'widelens', 'scopelens', 'kingsrock', 'shellbell', 'quickclaw', 'brightpowder', 'toxicorb', 'flameorb',
      'damprock', 'heatrock', 'smoothrock', 'icyrock', 'terrainextender', 'safetygoggles', 'protectivepads',
      'liechiberry', 'salacberry', 'petayaberry', 'occaberry', 'yacheberry', 'chopleberry', 'habanberry'],
    rare: ['choiceband', 'choicespecs', 'choicescarf', 'weaknesspolicy', 'throatspray', 'boosterenergy',
      'covertcloak', 'clearamulet', 'mirrorherb', 'loadeddice', 'punchingglove', 'airballoon', 'utilityumbrella',
      'roomservice', 'blunderpolicy', 'powerherb', 'whiteherb', 'ejectbutton', 'redcard', 'metronome', 'bigroot'],
  };

  /** Evolution items purchasable in shops. */
  const EVOLUTION_ITEMS = ['firestone', 'waterstone', 'thunderstone', 'leafstone', 'moonstone', 'sunstone',
    'shinystone', 'duskstone', 'dawnstone', 'icestone', 'razorclaw', 'razorfang', 'protector', 'electirizer',
    'magmarizer', 'dubiousdisc', 'reapercloth', 'upgrade', 'prismscale', 'sachet', 'whippeddream',
    'metalcoat', 'kingsrock', 'dragonscale', 'deepseascale', 'deepseatooth', 'ovalstone', 'auspiciousarmor', 'maliciousarmor', 'syrupyapple',
    'unremarkableteacup', 'metalalloy'];

  /** Node-type background artwork. */
  /* ================================================================ *
   * Rare Encounter nodes
   * ================================================================ */

  /*
   * Ultra Beasts and Paradox Pokémon carry **no flag in the packaged data** —
   * `legendary` and `mythical` exist, `powerClass` distinguishes restricted
   * species, but there is nothing marking these two families, so they are listed
   * by id. Pseudo-legendaries are derived instead (600 BST with a pre-evolution),
   * which is exactly the ten-or-so lines that definition is meant to describe.
   *
   * `tests/data-validation.js` asserts every id here resolves, so a rename in
   * upstream data cannot silently empty one of these lists — which would quietly
   * make Rare Encounters stop producing the family without any error.
   */
  const ULTRA_BEASTS = ['nihilego', 'buzzwole', 'pheromosa', 'xurkitree', 'celesteela',
    'kartana', 'guzzlord', 'poipole', 'naganadel', 'stakataka', 'blacephalon'];

  const PARADOX_POKEMON = ['greattusk', 'screamtail', 'brutebonnet', 'fluttermane',
    'slitherwing', 'sandyshocks', 'irontreads', 'ironbundle', 'ironhands', 'ironjugulis',
    'ironmoth', 'ironthorns', 'roaringmoon', 'ironvaliant', 'walkingwake', 'ironleaves',
    'gougingfire', 'ragingbolt', 'ironboulder', 'ironcrown'];

  const RARE_ENCOUNTER = {
    /*
     * Chance the encounter is a marquee species rather than a fully-trained
     * ordinary one. Deliberately a minority: the node's floor — a lower-tier
     * Pokémon with perfect IVs, a competitive moveset, a held item, an ability, a
     * nature and a Tera type — is already better than a Wild Encounter, so the
     * legendary is the upside, not the point. At 30% a three-Act run that routes
     * through two or three of these expects roughly one.
     */
    marqueeChance: 0.3,
    /*
     * Chance that defeating the encounter lets the player recruit it.
     *
     * **Guaranteed, by project decision (2026-08-13).** Beating a Rare Encounter
     * always offers the Pokémon that was fought. There is no `recruitChance`
     * dial any more and no roll in `resolveBattle` — the fight *is* the price.
     *
     * This replaces a flat one-in-three chance. The reasoning for the roll was
     * that a Rare Encounter may offer a legendary or a mythical, which ordinary
     * recruitment refuses outright (§5), so a win should buy a *chance* rather
     * than the Pokémon itself. In play that made the node feel arbitrary: it has
     * to be found, routed to, and beaten at or above the player's own level with
     * a Beacon on the line, and then two times in three it gave nothing.
     *
     * What still limits it, and is why guaranteeing the offer is not the same as
     * handing out legendaries:
     *   - the node has to appear at all (weight 5, below every other type, and
     *     barred from rows 0-1);
     *   - legendary and mythical *appearance* is gated out of the first 35% of a
     *     run, so this cannot happen in Act 1 of a three-Act run;
     *   - it is one fully-built Pokémon against a party, so it can be lost.
     *
     * `shouldOfferRecruit` is still deliberately bypassed here: it declines 55%
     * of the time once the party is full, which would quietly reintroduce a
     * refusal rate for exactly the players who have earned a settled team. A full
     * party gets the release prompt instead, and can always decline.
     */
    ultraBeasts: ULTRA_BEASTS,
    paradox: PARADOX_POKEMON,
  };

  /* ================================================================ *
   * Rebirth Mode
   * ================================================================ */

  /**
   * Rebirth Mode: a second run started *inside* a cleared one.
   *
   * The party and the relics carry over; the level, Act, map, credits, Beacons
   * and bag all reset. What changes is the opposition: every Trainer, Elite and
   * boss fields a **complete six**, built around a declared `TEAM_PLANS` row,
   * played at **Expert** whatever the difficulty says, and opening with that
   * plan's doctrine already on the field (`plan.rebirth.effect`).
   *
   * `depth` is the number of rebirths deep the run is, so a rebirth of a
   * rebirth is a real thing and can escalate.
   */
  const REBIRTH = {
    /**
     * Which plans an ordinary Rebirth Trainer or Elite can be built from.
     *
     * `balance` is deliberately absent: a Rebirth opponent is supposed to read
     * as a specialist, and "no specialisation" is the one row that cannot. It
     * is still reachable — the Champion declares it (`teamPlan: 'balance'`) and
     * brings its Warded Field — it is simply never *rolled*.
     */
    trainerPlans: ['hyperoffense', 'stall', 'rain', 'sun', 'trickroom', 'stickyweb', 'screens', 'sand'],
    /** Trainers, Elites and bosses all bring six. That is the mode. */
    teamSize: 6,
    aiTier: 'expert',
    /**
     * How many of the six are drafted for plan fit before the rest are filled on
     * general quality. Six plan-fitted members produces a team of near-clones on
     * the narrower plans (every Sand pick is a Rock/Ground wall); leaving two
     * slots open keeps coverage honest and the fight interesting.
     */
    themedMembers: 4,
    /**
     * Where a Rebirth run's opponent power curve *starts*, as a `runProgress`
     * value.
     *
     * A rebirth resets the Act to 1, and `powerBand` is a function of progress —
     * so without this the opening nodes drew from the opening band and a party
     * of six fully-evolved carry-overs met Geodude and Dwebble. Measured on the
     * first build: a Sand trainer at node one fielded Onix, Hippopotas, Dwebble,
     * Geodude and Dratini. The curve still climbs from here to the same 1.0 at
     * the final boss; only its floor moves.
     */
    progressFloor: 0.55,
    /** BST added to both ends of the band per rebirth beyond the first. */
    depthLift: 25,
    /**
     * Extra levels off every opponent, on top of the difficulty's own offset.
     *
     * **This is the mode's only difficulty dial**, and it is the whole reason
     * the mode is playable. Rebirth's promise is that opposition is *complete* —
     * six built Pokémon, a declared strategy, Expert play — not that it is
     * overlevelled, and the base game already pays for quality with levels
     * (`enemyLevelOffset` is -2 on all three difficulties). Without this, an
     * ordinary Trainer node stops being attrition and becomes a coin flip, and
     * a ~30-node run cannot pay for thirty coin flips.
     *
     * Measured on Normal (`node tools/balance-probe.js 60 normal advisor rebirth`):
     *
     *   handicap  clear   trainer  elite  boss   note
     *      0       0%      44%     11%    38%    unclearable
     *     -4      50%      69%     59%    61%    with +2 Beacons — easier than base
     *     -4      26%      67%     56%    62%    shipped; base Normal is 42%
     *
     * Extra Beacons were tried and dropped: they took the mode *above* the base
     * game's clear rate, and §6's own rule is that the Beacon count is what pays
     * for the boss line — Rebirth's bosses land at 68%, better than base, so it
     * needs no help there. The difficulty lives in the Trainer nodes, which is
     * exactly the "every fight is a real fight" promise.
     */
    enemyLevelOffset: -4,
    /** Better rewards, per the design. */
    rewardOptions: 1,
    rarityBoost: 0.9,
    creditMultiplier: 1.4,
    /** Extra weight given to a recruit that fits the theme the player picked. */
    recruitThemeWeight: 6,
  };

  const NODE_BACKGROUNDS = {
    trainer: ['Meadow.jpg', 'City.jpg', 'Forest.jpg', 'Town.png', 'Beach.jpg'],
    elite: ['Dark City.jpg', 'Dark Meadow.jpg', 'Elite Four.png', 'Library.png'],
    wild: ['Forest.jpg', 'Damp Cave.jpg', 'Earthy Cave.jpg', 'Sea.png', 'Desert.jpg'],
    rare: ['Sky Pillar.jpg', 'Ice Cave.jpg', 'Dark Meadow.jpg', 'Sea.png'],
    boss: ['Elite Four.png', 'Sky Pillar.jpg'],
    event: ['Town.png', 'Library.png', 'Dark Beach.jpg'],
    shop: ['City.jpg', 'Town.png'],
    rest: ['Meadow.jpg', 'Beach.jpg'],
    treasure: ['Earthy Cave.jpg', 'Ice Cave.jpg'],
    specialist: ['Library.png', 'City.jpg'],
  };

  const NODE_TYPES = {
    trainer: {id: 'trainer', name: 'Trainer Battle', icon: '⚔', description: 'A standard Trainer battle. Rewards credits and a choice of reward.'},
    elite: {id: 'elite', name: 'Elite Battle', icon: '★', description: 'A harder team with better AI. Guarantees a strong reward.'},
    wild: {id: 'wild', name: 'Wild Encounter', icon: '❋', description: 'Defeat a wild Pokémon for a chance to recruit it.'},
    rare: {id: 'rare', name: 'Rare Encounter', icon: '✧', description: 'A single exceptional Pokémon, fully trained. Sometimes something legendary.'},
    event: {id: 'event', name: 'Mystery Event', icon: '?', description: 'A choice-driven encounter with costs and rewards.'},
    shop: {id: 'shop', name: 'Shop', icon: '$', description: 'Spend credits on items, healing, moves and recruits.'},
    battleshop: {
      id: 'battleshop', name: 'Battle Shop', icon: '◈',
      /*
       * The map label otherwise takes the first word of the name, which turns
       * "Battle Shop" into "Battle" — indistinguishable at a glance from the
       * three node types that really are battles. `short` overrides it.
       */
      short: 'Items',
      description: 'A specialist held-item dealer. Stocks only items your party can actually use — but you may buy one thing.',
    },
    rest: {id: 'rest', name: 'Rest Site', icon: '✚', description: 'Fully restore the team, or use the site for something else.'},
    treasure: {id: 'treasure', name: 'Treasure', icon: '◆', description: 'A free held item or a pile of credits.'},
    specialist: {id: 'specialist', name: 'Specialist', icon: '✦', description: 'Move tutoring, ability swaps and evolution services.'},
    boss: {id: 'boss', name: 'Act Boss', icon: '☠', description: 'A constructed team built around a specific strategy.'},
  };

  global.RedGPT.CampaignContent = {
    DIFFICULTIES, ASCENSIONS, STARTER_POOLS, RELICS, EVENTS, UNLOCKS, unlockSatisfied,
    TEAM_PLANS, teamPlan,
    RARE_ENCOUNTER, ULTRA_BEASTS, PARADOX_POKEMON,
    TRAINER_ARCHETYPES, BOSSES, FINAL_BOSS,
    CONSUMABLES, HELD_ITEM_POOL, EVOLUTION_ITEMS,
    NODE_BACKGROUNDS, NODE_TYPES, REBIRTH,
    difficulty: id => DIFFICULTIES.find(d => d.id === id) || DIFFICULTIES[0],
    relic: id => RELICS.find(r => r.id === id) || null,
    event: id => EVENTS.find(e => e.id === id) || null,
    boss: id => (FINAL_BOSS.id === id ? FINAL_BOSS : BOSSES.find(b => b.id === id)) || null,
  };
})(typeof window !== 'undefined' ? window : globalThis);
