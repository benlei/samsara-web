Upgrading Artifact Guide - for DPS
==================================

I learned this method from fobm4ster, and think it's been fairly effective in helping decide what artifacts are/aren't worth upgrading further.

The general idea is to get at least 3 hits into crit by +20, if possible. And if it's not possible at +12/+16, then it's not worth upgrading.

Table of Contents
=================

  * [3 Substats Scenario](#3-substats-scenario)
  * [4 Substats Scenario](#4-substats-scenario)


3 Substats Scenario
-------------------

```mermaid
graph TD
    A[Main Stat matches] -->|yes| B(Has 3 substats)
    A -->|no| C(Trash, or keep if nothing better)
    B --> F{Has 1 crit substat}
    F -->|no| C
    F -->|yes| G(Upgrade to +4)
    G --> H{Has 2 crit substats}
    H -->|no| C
    H -->|yes| I(Upgrade to +12)
    I --> J{Hit crit at least 1x}
    J -->|no| C
    J -->|yes| K(Upgrade to +16)
    K --> L{Hit crit at least 2x}
    L -->|no| C
    L -->|yes| M(Upgrade to +20)
    M --> N{3-4 hits into crit total}
    N -->|no| C
    N -->|yes| O{Good! Keep!}
```


4 Substats Scenario
--------------------

```mermaid
graph TD
    A[Main Stat matches] -->|yes| B(Has 4 substats)
    A -->|no| C(Trash, or keep if nothing better)
    B --> F{Has 2 crit substat}
    F -->|no| C
    F -->|yes| G(Upgrade to +12)
    G --> H{Hit crit at least 1x}
    H -->|no| C
    H -->|yes| I(Upgrade to +16)
    I --> J{Hit crit at least 2x}
    J -->|no| C
    J -->|yes| K(Upgrade to +20)
    K --> L{3-5 hits into crit total}
    L -->|no| C
    L -->|yes| M{Good! Keep!}
```
