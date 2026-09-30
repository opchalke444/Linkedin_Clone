# LinkedIn Clone - Comprehensive Features Specification & Original Innovations

LinkedIn Clone is designed to demonstrate authentic full-stack engineering skills, combining essential professional networking paradigms with three distinctive original algorithms.

---

## 1. The Three Original Features

### Original Feature 1: Profile Completeness Engine
- **Objective**: Guide users toward building an all-star professional profile with transparent scoring and actionable feedback.
- **Implementation**: `server/src/services/user.service.ts` -> `calculateProfileCompleteness()`.
- **Scoring Breakdown (Total: 100%)**:
  | Criterion | Weight | Requirement |
  | :--- | :--- | :--- |
  | **Profile Photo** | 15% | Avatar URL is set and not default placeholder |
  | **Headline** | 15% | Length ≥ 10 characters |
  | **About / Bio** | 15% | Length ≥ 30 characters |
  | **Location & Industry** | 15% | Both location and industry specified |
  | **Experience** | 15% | At least 1 recorded work experience entry |
  | **Education** | 15% | At least 1 recorded degree/institution entry |
  | **Skills** | 10% | At least 3 verified technical or domain skills |

- **User Experience**:
  - Displays a visual progress ring and tier badge (`Beginner`, `Intermediate`, `Advanced`, `All-Star`).
  - Lists missing milestones with direct shortcut buttons to open edit modals.

---

### Original Feature 2: Skill-Based Network Discovery
- **Objective**: Suggest meaningful professional connections based on domain synergy rather than random user browsing.
- **Mathematical Model**: **Jaccard Similarity Index** over normalized skill sets:

$$\text{Similarity}(A, B) = \frac{|S_A \cap S_B|}{|S_A \cup S_B|}$$

- **Algorithm Steps**:
  1. Fetch active user skills $S_{\text{currentUser}}$.
  2. Query candidate users who are not yet connected (`status !== 'ACCEPTED'`) and have at least 1 overlapping skill.
  3. Compute intersection $|S_{\text{currentUser}} \cap S_{\text{candidate}}|$ (common skills) and union $|S_{\text{currentUser}} \cup S_{\text{candidate}}|$.
  4. Calculate similarity percentage: $\frac{\text{Common Skills}}{\text{Total Unique Skills}} \times 100$.
  5. Rank candidates in descending order of similarity score.
- **User Experience**:
  - Shows "People You May Know With Shared Skills" cards.
  - Highlights specific shared skills pills (e.g. `React`, `Node.js`, `PostgreSQL`).
  - Displays "3 skills in common (60% match)" with a one-click **Connect** button.

---

### Original Feature 3: Professional Opportunity Matching Engine
- **Objective**: Help students and graduates discover internships, graduate jobs, and freelance projects matched against their profile capabilities.
- **Mathematical Model**: **Rule-Based Skill Overlap Ratio**:

$$\text{Match Percentage} = \min\left(100, \left\lfloor \frac{|S_{\text{user}} \cap R_{\text{opportunity}}|}{|R_{\text{opportunity}}|} \times 100 \right\rfloor \right)$$

- **Algorithm Steps**:
  1. Retrieve required skills $R_{\text{opportunity}}$ for each active role.
  2. Compare against active user skills $S_{\text{user}}$ (case-insensitive string matching).
  3. Divide count of matched skills by total required skills.
  4. Segment skills into two distinct arrays: `matchingSkills` (skills the user already possesses) and `missingSkills` (skills the user can learn to qualify).
- **User Experience**:
  - Displays match badge (e.g. `83% Skill Match`, `5 of 6 requirements met`).
  - Color-codes matching skills in green and missing skills in slate-dashed outlines.
  - Allows immediate one-click **Apply** with real-time status update.

---

## 2. Core Professional Networking Features

### 1. Authentication & Security
- Secure registration with strict validation (Zod schema checking email formatting, minimum 8 characters, at least 1 uppercase letter, and 1 numeric digit).
- Password hashing using bcrypt with 12 salt rounds.
- JWT stored in HTTP-Only cookies to protect against XSS token harvesting.
- Centralized auth middleware guarding sensitive routes.

### 2. Profile Management
- Comprehensive profile customization: Avatar, Banner, Full Name, Headline, About, Location, Industry, Portfolio link, GitHub, LinkedIn.
- CRUD for Education (institution, degree, field of study, start/end years).
- CRUD for Experience (company, position, description, current role toggle).
- Skill repository with proficiency levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).

### 3. Connection State Machine
Users progress through 4 explicit connection states:
1. `NONE`: No connection exists. A "Connect" button is shown.
2. `PENDING_SENT`: Invitation dispatched. "Pending" button with option to cancel request.
3. `PENDING_RECEIVED`: Invitation received. "Accept" and "Ignore" actions available.
4. `CONNECTED`: Mutual connection established. "Message" and "Connected" actions shown.
- **Integrity**: Database unique constraints prevent duplicate invites. Self-connection requests are rejected at service level.

### 4. Deterministic Feed-Ranking Algorithm
The feed ranks posts using a multi-factor deterministic scoring function rather than basic timestamps:

$$\text{Feed Score} = S_{\text{connection}} + S_{\text{recency}} + S_{\text{engagement}} + S_{\text{interest}}$$

- **Connection Weight (40 pts)**: Direct connections receive 40 bonus points.
- **Recency Decay (30 pts)**: Scaled by hours elapsed since publication: $\max(0, 30 - (\text{hoursElapsed} \times 0.5))$.
- **Engagement Factor (20 pts)**: Based on reaction count ($\times 2$) and comment count ($\times 3$), capped at 20 points.
- **Interest / Skill Overlap (10 pts)**: Posts with tags matching user skills receive up to 10 bonus points.

### 5. Scalable Reaction System
- Five distinct emotional reactions: `LIKE` (👍), `CELEBRATE` (🎉), `SUPPORT` (🤝), `LOVE` (❤️), and `INSIGHTFUL` (💡).
- Active reaction highlight on user's selected choice.
- Toggling the same reaction removes it; choosing a different reaction updates the record in-place without page refresh.

### 6. Threaded Comments & Nested Replies
- Top-level comments with timestamp and author profile.
- Recursive nested replies allowing professional discussions and Q&A threads.
- Delete authorization: Users can only delete comments they authored, or post owners can moderate comments on their posts.

### 7. Real-Time Messaging with Presence
- Socket.IO rooms partitioned by user ID (`join(user.id)`).
- Persistent storage: Messages are stored in PostgreSQL before emission.
- Real-time online/offline green dot presence indicators.
- Live typing indicator (`"Sarah is typing..."`).

### 8. Notifications Hub
- Automatic triggers for:
  - Connection requests and acceptances.
  - Reactions and comments on user posts.
  - Replies to comments.
  - New direct messages.
- Real-time unread badge count in top navigation bar.

### 9. Professional Communities / Groups
- Explore domain-specific groups (Web Dev, AI & ML, Cyber Security, etc.).
- Join/leave groups with membership tracking.
- Group-scoped discussion board for targeted interactions.

### 10. Global Search & Filter
- Search across Users, Posts, and Groups with query strings.
- Filter users by Name, Location, Industry, and Skills.
- Filter posts by keywords and hashtags.
