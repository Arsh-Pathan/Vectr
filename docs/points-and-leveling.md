# Vectr — Points, Leveling & Badges System

> Complete gamification system specification.

---

## Points System

Points are the currency of Vectr. You earn points by contributing to open source, and points accumulate to increase your level.

### How to Earn Points

| Action | Points |
|--------|--------|
| Solve a **beginner** issue | 10 pts |
| Solve a **moderate** issue | 25 pts |
| Solve an **advanced** issue | 50 pts |
| Complete a **daily challenge** | 15 pts |
| **Streak bonus** (per day of streak) | 5 pts |

### Initial Points (GitHub Seed)

When a developer connects their GitHub, the **Profile Agent** analyzes their profile and grants initial points based on activity. This is calculated using:

| Factor | Weight | Max Raw Value |
|--------|--------|---------------|
| Public repository count | 15% | 100 repos |
| Total commits (last year) | 25% | 1,000 commits |
| Language diversity | 15% | 10 languages |
| Contribution days (last year) | 20% | 365 days |
| PR + Issue activity | 15% | 200 interactions |
| Account age | 10% | 3,650 days (10 years) |

**Formula:**
```
normalized_score = (
    normalize(repos, 100)      * 0.15 +
    normalize(commits, 1000)   * 0.25 +
    normalize(languages, 10)   * 0.15 +
    normalize(contrib_days, 365) * 0.20 +
    normalize(pr_issues, 200)  * 0.15 +
    normalize(account_age, 3650) * 0.10
)

initial_points = int(normalized_score * 1500)  # Max ~1500 initial points
initial_level = points_to_level(initial_points)
```

`normalize(value, max)` = `min(value / max, 1.0)`

**Examples:**
- Brand new GitHub → 0 points → Level 0
- Casual user (10 repos, 50 commits) → ~150 points → Level 15
- Active developer (30 repos, 500 commits) → ~600 points → Level 30
- Very active (80 repos, 900 commits) → ~1200 points → Level 55

---

## Level System

Levels range from **0 to 99**. The points required per level increase as you progress.

### Tier Breakdown

| Level Range | Tier | Points Per Level | Total Points to Reach Tier Start |
|------------|------|-----------------|----------------------------------|
| 0 – 19 | 🌱 **Beginner** | 10 pts/level | 0 pts |
| 20 – 49 | 📈 **Moderate** | 25 pts/level | 200 pts |
| 50 – 79 | 🔥 **Advanced** | 50 pts/level | 950 pts |
| 80 – 99 | 👑 **Expert** | 100 pts/level | 2,450 pts |

### Points-to-Level Table

| Level | Cumulative Points Needed |
|-------|-------------------------|
| 0 | 0 |
| 5 | 50 |
| 10 | 100 |
| 15 | 150 |
| 20 | 200 |
| 25 | 325 |
| 30 | 450 |
| 40 | 700 |
| 50 | 950 |
| 60 | 1,450 |
| 70 | 1,950 |
| 80 | 2,450 |
| 90 | 3,450 |
| 99 | 4,350 |

### Level Calculation Function

```python
def points_to_level(points: int) -> int:
    """Convert total points to level (0-99)."""
    level = 0
    remaining = points
    
    # Beginner: levels 0-19, 10 pts each
    beginner_levels = min(20, remaining // 10)
    level += beginner_levels
    remaining -= beginner_levels * 10
    
    if level < 20:
        return level
    
    # Moderate: levels 20-49, 25 pts each
    moderate_levels = min(30, remaining // 25)
    level += moderate_levels
    remaining -= moderate_levels * 25
    
    if level < 50:
        return level
    
    # Advanced: levels 50-79, 50 pts each
    advanced_levels = min(30, remaining // 50)
    level += advanced_levels
    remaining -= advanced_levels * 50
    
    if level < 80:
        return level
    
    # Expert: levels 80-99, 100 pts each
    expert_levels = min(20, remaining // 100)
    level += expert_levels
    
    return min(level, 99)


def level_to_tier(level: int) -> str:
    """Convert level to tier name."""
    if level < 20:
        return "beginner"
    elif level < 50:
        return "moderate"
    elif level < 80:
        return "advanced"
    else:
        return "expert"
```

---

## Badge System

8 badges, each earned by meeting a specific condition. Badges are checked after every contribution.

### Badge Definitions

| ID | Icon | Name | Condition | Description |
|----|------|------|-----------|-------------|
| `first_step` | 🌱 | First Step | Solve 1 issue | "Every journey begins with a single step" |
| `on_fire` | 🔥 | On Fire | 3-day contribution streak | "You're on a roll!" |
| `unstoppable` | ⚡ | Unstoppable | 7-day contribution streak | "Nothing can stop you" |
| `sharpshooter` | 🎯 | Sharpshooter | Solve 10 issues | "Precision and consistency" |
| `veteran` | 💎 | Veteran | Solve 50 issues | "A seasoned contributor" |
| `daily_warrior` | 🌟 | Daily Warrior | Complete 5 daily challenges | "Challenge accepted, daily" |
| `level_up` | 🚀 | Level Up | Reach Level 25 | "Breaking through to Moderate" |
| `elite` | 👑 | Elite | Reach Level 75 | "Among the best" |

### Badge Check Logic

```python
def check_badges(user) -> list[str]:
    """Check which new badges the user has earned. Returns list of newly earned badge IDs."""
    new_badges = []
    
    badge_conditions = {
        "first_step":    user.issues_solved >= 1,
        "on_fire":       user.streak_days >= 3,
        "unstoppable":   user.streak_days >= 7,
        "sharpshooter":  user.issues_solved >= 10,
        "veteran":       user.issues_solved >= 50,
        "daily_warrior": user.daily_challenges_completed >= 5,
        "level_up":      user.level >= 25,
        "elite":         user.level >= 75,
    }
    
    for badge_id, condition in badge_conditions.items():
        if condition and badge_id not in user.earned_badges:
            new_badges.append(badge_id)
            user.earned_badges.append(badge_id)
    
    return new_badges
```

---

## Streak System

- A **streak** is the number of consecutive days a user has made at least one contribution (solved an issue).
- Streaks reset to 0 if a day is missed.
- Streak bonus: **5 points per day** of active streak, awarded when solving an issue.

### Streak Calculation

```python
from datetime import date, timedelta

def update_streak(user, contribution_date: date):
    """Update user's streak based on the contribution date."""
    if user.last_contribution_date is None:
        user.streak_days = 1
    elif contribution_date == user.last_contribution_date:
        pass  # Same day, no change
    elif contribution_date == user.last_contribution_date + timedelta(days=1):
        user.streak_days += 1  # Consecutive day
    else:
        user.streak_days = 1  # Streak broken, restart
    
    user.last_contribution_date = contribution_date
    user.longest_streak = max(user.longest_streak, user.streak_days)
```

---

## Daily Challenge

- One issue is featured as the **Daily Challenge** each day.
- The **Issue Scanner Agent** picks a beginner-friendly issue from the pool.
- Completing the daily challenge awards **15 points** (instead of the normal 10 for beginner).
- A counter tracks how many daily challenges a user has completed (for the Daily Warrior badge).

---

*This document is the definitive spec for the gamification system.*
