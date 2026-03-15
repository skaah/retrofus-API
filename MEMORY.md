# MEMORY.md - Long-Term Project Memory

## 🎮 Dofus Retro API Project

### Project Overview
- **Started**: March 11-13, 2026
- **Deadline**: March 31, 2026 (new Dofus Retro server opening)
- **Objective**: Build the most complete Dofus Retro v1.29 API
- **Critical Constraint**: ZERO Dofus 2 data allowed

### Key Milestones

#### March 15, 2026 - MASSIVE DATA FUSION DAY
**Status**: ✅ TARGET CRUSHED
- API elements: **6,276** (target was 4,000) - **157% of goal!**
- Successfully merged **3,776 JSON files** from DofusBook Retro scraping
- Filtered and removed 3 Dofus 2 contamination items
- Database growth: **+94% in one day** (+2,945 elements)

**Final Breakdown (End of Day)**:
| Category | Count | Target | Progress |
|----------|-------|--------|----------|
| Items | 4,538 | 500 | ✅ 908% |
| Weapons | 882 | 300 | ✅ 294% |
| Sets | 189 | 100 | ✅ 189% |
| Monsters | 84 | 200 | 🔄 42% |
| Resources | 152 | 300 | 🔄 51% |
| Classes | 12 | 12 | ✅ 100% |
| Spells | 310 | 350 | 🔄 89% |
| Dungeons | 45 | 50 | 🔄 90% |
| Quests | 52 | 60 | 🔄 87% |
| Professions | 12 | 12 | ✅ 100% |
| **TOTAL** | **6,276** | **4,000** | ✅ **157%** |

**Two Data Drops Today**:
1. **Morning**: 2,950 files (items + sets) → +2,145 items, +154 sets
2. **Evening**: 826 files (weapons) → +748 weapons

### Technical Decisions

#### Data Validation Strategy
- Maintain strict Dofus 2 filtering regex patterns
- Validate all URLs contain "retro.dofusbook.net"
- Reject items level > 200 (Retro max)
- Blacklist: Frigost, dimensions, post-1.29 dungeons
- **Weapon Detection**: Items with `pa` in stats = weapon

#### Deduplication System
- URL-based deduplication (primary key)
- Name-based cross-reference with existing DB
- 4,341 total duplicates handled today
- 748 weapon duplicates filtered

#### File Transfer Methods (Tested)
| Method | Status | Notes |
|--------|--------|-------|
| MEGA | ❌ | Requires special client (wget gets HTML redirect) |
| Google Drive | ✅ | Works with "Anyone with link can download" |
| Direct HTTP | ✅ | Preferred when possible |

### Processing Pipeline Created

#### Import Scripts
| Script | Purpose |
|--------|---------|
| `fusion_dofusbook.py` | Merges bulk JSON, deduplicates, filters Dofus 2 |
| `extract_weapons.py` | Identifies weapons by PA presence |
| `merge_final.py` | Integrates new data with existing DB |
| `merge_weapons_final.py` | Weapons-specific merge with dedup |

#### Quality Control
- Dofus 2 pattern matching (21+ patterns)
- Level validation (max 200 for Retro)
- URL source verification
- Manual review of flagged items

### Active Cron Jobs
- `dofus-api-dashboard-report` - Every hour
- `github-backup-dofus-retro-api` - Every hour
- `dofus-enrichment-daily` - Every 6 hours
- `dofus-fusion-weekly` - Sunday/Wednesday 2AM

### Key Files (Current)
| File | Size | Purpose |
|------|------|---------|
| `seed-data-merged-v2.2.json` | 2.26 MB | ⭐ MASTER DATABASE |
| `weapons-new-import.json` | 287 KB | Weapons export |
| `dofusbook-fusion.json` | 1.51 MB | Items/sets import |
| `FUSION_REPORT_v2.1.md` | 3.6 KB | Progress documentation |

### Remaining Work (16 days to March 31)

#### Priority 1: High Impact
1. **Monsters**: +116 to reach 200 (42% → 100%)
2. **Resources**: +148 to reach 300 (51% → 100%)

#### Priority 2: Polish
3. **Spells**: +40 to reach 350 (89% → 100%)
4. **Dungeons**: +5 to reach 50 (90% → 100%)
5. **Quests**: +8 to reach 60 (87% → 100%)

#### Priority 3: Enrichment
6. Add descriptions to imported items
7. Add crafting recipes
8. Add drop locations and coordinates
9. Final API documentation

### User Context
- **Scraping method**: Chrome extension on DofusBook Retro
- **Data source**: retro.dofusbook.net (verified Retro 1.29)
- **Today's volume**: 3,776 JSON files processed
- **Priority items**: Already covered (Gelano, high-level 190-198, iconic sets)
- **Next focus**: Monsters and resources

### Lessons Learned
1. Google Drive sharing must be "Anyone with link" not restricted
2. MEGA requires dedicated client - wget won't work
3. PA (Action Points) presence = reliable weapon indicator
4. Massive deduplication necessary (user scraped overlapping ranges)
5. Dofus 2 contamination minimal but must be filtered (3 items today)

### Dofus 2 Red Flags Detected
- Panoplie d'Elya Wood (dimension content)
- Panoplie du Bworker Berserker (post-1.29)
- Panoplie du Bworker Gladiateur (post-1.29)

---
*Last updated: March 15, 2026 18:30 PM*
