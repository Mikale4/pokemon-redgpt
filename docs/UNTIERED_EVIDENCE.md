# RedGPT Untiered Roster — RESOLVED

**There are no untiered selectable species.** This document was the evidence
packet for the 473 that had no ladder tier; the audit was implemented on
2026-08-17 and the packet's subject is now empty, so it records the outcome
instead of restating a roster that no longer exists.

**Generated from the live project** by `tools/untiered-evidence.js`. It will
regenerate as a full evidence packet again if any selectable species ever loses
its tier — which is also asserted as an invariant in `tests/data-validation.js`.

---

## What was resolved

| | |
| --- | --- |
| Selectable species | 1138 |
| **Carrying no ladder tier** | **0** |
| Placed by this audit | 473 |

**The "NFE and LC are discarded" policy is superseded.** ZU is the floor now:
anything whose tier does not resolve to a rung lands in ZU with
`tierSource.from === 'redgpt-zu-floor'`, so a floored tier is never mistaken for
an imported one. Upstream ladder rankings still win — Chansey stays UU, Pikachu
stays ZU by import rather than by floor.

## The placements

| Destination | Count | Entries |
| --- | --- | --- |
| **RU** | 1 | Porygon2 |
| **NU** | 4 | Gligar, Magneton, Rhydon, Doublade |
| **PU** | 38 | Floette-Eternal, Type: Null, Scyther, Ursaring, Dipplin, Tangela, Dusclops, Corsola-Galar, Sliggoo-Hisui, Piloswine, Lairon, Crocalor, Gurdurr, Machoke, Meditite, Primeape, Sneasel-Hisui, Fraxure, Zweilous, Servine, Combusken, Raboot, Thwackey, Qwilfish-Hisui, Duosion, Kadabra, Roselia, Gothorita, Lampent, Slowpoke, Slowpoke-Galar, Naclstack, Togetic, Porygon, Vullaby, Clefairy, Golbat, Mienfoo |
| **ZU** | 430 | everything else, through the floor |

**Live ladder:** Ubers 63, OU 93, UU 91, RU 131, NU 67, PU 110, ZU 677 — 1232 ranked entries.

## Reviewed alongside it

- **Silvally stays ZU**, on the completed all-17-Memory evidence
  (`docs/SILVALLY_MEMORY_EVIDENCE.md`).
- **Floette-Mega OU, Meowstic-M-Mega RU, Tatsugiri-Curly-Mega RU** — reviewed and
  **pinned** as explicit overrides rather than left on estimates.
- **Delphox-Mega pinned back to UU.** It drifted UU → OU as a side effect of
  Floette-Mega becoming a resolved datapoint in `estimateFormeTier`'s model. It
  was never reviewed, so it was pinned rather than allowed to move.
- **Floette-Eternal is PU and only it can Mega Evolve** — plain Floette has no
  `formeItems` entry, verified through `reachableFormes`.
