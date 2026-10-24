# Data sources and reproducibility

All battle-facing data is generated, never hand-written. `data/game-data.js`
records the build timestamp and the counts it produced.

## Sources

| Source | Supplies |
| --- | --- |
| `@pkmn/dex` and `@pkmn/data` 0.10.11 | species, formes, types, base stats, abilities, learnsets, evolution methods, moves and their effect metadata, items, natures, the type chart, and the tier snapshot used for `powerClass` |
| PokeAPI CSV snapshots in `tools/` | height, weight, catch rate, growth group, base experience, EV yield, gender ratio, legendary and mythical flags |
| `Assets/Sprites/Pokemon Sprites/{Front,Back}` | the sprite pair every playable species must have |

The CSV snapshots are committed so a rebuild never requires network access at
play time.

## Generation rules

**Species are enabled only when all of the following hold:**

1. `@pkmn/dex` has valid data (types, six base stats, at least one ability);
2. a front sprite exists;
3. a back sprite exists;
4. a learnset resolves to at least one packaged move.

**Sprite matching is explicit.** The lookup key is the compacted base species
name plus the spaced forme name — `Charizard-Mega-X` → `CHARIZARD MEGA X`,
`Mr. Mime-Galar` → `MRMIME GALAR`, `Ho-Oh` → `HOOH`. A small alias table covers
names the artwork spells differently (`Nidoran-F` → `NIDORAN FEMALE`,
`Oricorio-Pom-Pom` → `ORICORIO POMPOM`, Ogerpon's masked formes). The generator
never falls back to a different forme's artwork: if the exact pair is missing,
the species is skipped and listed in the report.

**Learnsets are resolved up the chain.** A forme without its own learnset
inherits from `changesFrom`/`baseSpecies` including level-up timing, since
alternate formes share their base's progression. Pre-evolutions contribute
legality but not level timing, matching normal transfer rules. Level-up
requirements come from the most recent generation that teaches the move by level.

**Evolution methods with no solo meaning are converted in data.** Trade, trade
with a held item, friendship, time of day, location and move-based evolutions all
become level or item requirements, recorded on the rule as `adapted` so the UI
can say so. This is a data decision in one place, not scattered exceptions.

**Items are packaged even without artwork.** The asset library predates most
Generation 6+ items, so roughly half of the item icons are missing. Item data is
battle data — dropping Assault Vest because there is no PNG would be worse than
rendering a lettered chip in its place. Only *Pokémon* are gated on sprites.

## Output

| File | Contents |
| --- | --- |
| `data/game-data.js` | the single object the app loads |
| `data/pokemon.json` | species array, for tests |
| `data/moves.json`, `data/abilities.json`, `data/items.json`, `data/natures.json`, `data/type-chart.json` | individual tables, for tests |
| `docs/DATA_REPORT.md` | enabled counts, every skipped Dex entry with its reason, unused sprite artwork, and items rendered as chips |

## Rebuilding

```bash
npm run build:data
```

The same package versions and asset library produce the same dataset. The report
is regenerated alongside it, so any change in what is enabled is visible in the
diff.
