# Beyond the Lessons — Requirements

## 1. Overview

Beyond the Lessons is a platform connecting English-speaking volunteers with Thai schools for live English conversation sessions.

The initial pilot focuses on Thai classrooms and English-speaking volunteers, primarily in Canada.

The platform is designed around **classroom sessions**, not individual students.

A typical session:
- Takes place during Thai school hours (8:30 AM–3:30 PM Thailand time)
- Is 30 minutes or 1 hour
- Has approximately 20–30 students
- Has a Thai teacher present
- Is conducted remotely through a video meeting
- Uses conversation topics provided by the school/teacher

The MVP should prioritize simplicity, reliability, and testing the real-world workflow.

---

## 2. User Roles

### Volunteer
Volunteers:
- Create an account
- Complete an application
- Accept volunteer rules/code of conduct
- Provide availability
- View eligible open sessions
- Claim available sessions
- View upcoming/past sessions
- Receive email notifications
- Submit post-session feedback
- Track completed volunteer hours

### School
Schools:
- Apply/register
- Have a designated coordinator
- Create one-time or recurring classroom sessions
- Choose 30-minute or 1-hour sessions
- Provide session topics/notes
- View claimed/upcoming sessions
- Receive notifications
- Submit post-session feedback

### Admin
Admins:
- Approve/reject volunteer applications
- Approve/reject school applications
- View users, schools, volunteers, and sessions
- Monitor scheduling/cancellation issues
- View feedback
- Manage basic platform operations

---

## 3. Session Model

A session represents **one classroom opportunity**.

A school with 700 students does NOT create one session for all students.

Example:

School:
- Class A → Session 1 → Volunteer A
- Class B → Session 2 → Volunteer B
- Class C → Session 3 → Volunteer C

Each classroom is treated as a separate session.

Student accounts are NOT required for the MVP.

---

## 4. Session Creation

Schools can create:

### One-time session
A single classroom session.

### Recurring session
A repeating series of classroom sessions.

Recurring sessions must allow:
- Start date
- End date
- Day(s) of week
- Start time
- Duration
- Topic(s)
- Teacher notes

Each occurrence should ultimately behave as an individual claimable session.

---

## 5. Session Fields

Each session should contain:

- ID
- School ID
- Session series ID (optional)
- Classroom/group name
- Date
- Start time
- End time
- Timezone
- Duration: 30 or 60 minutes
- Approximate student count
- Topics
- Teacher notes
- Meeting URL
- Volunteer ID (optional)
- Status
- Created timestamp
- Updated timestamp

Optional school-provided information:
- Age/grade
- General English level
- Special classroom considerations

Age and English level should NOT be required for the MVP.

---

## 6. Volunteer Matching

Matching should be automated.

Admins should NOT manually assign volunteers.

Workflow:

1. School creates a session.
2. System identifies approved volunteers who are available.
3. Eligible volunteers receive an email notification.
4. Volunteers can claim the session.
5. The first volunteer to successfully claim it receives the assignment.
6. Other volunteers can no longer claim it.
7. School and volunteer receive confirmation.

The system must prevent two volunteers from claiming the same session.

---

## 7. Recurring Sessions

For recurring sessions:

- A volunteer should be able to commit to the entire series.
- The volunteer should be clearly informed that they are committing to multiple sessions.
- If a volunteer backs out, the school should be notified.
- If the school cancels/changes a series, the volunteer should be notified.
- The system should reopen affected sessions for volunteers when appropriate.

A volunteer may also claim individual one-time sessions.

---

## 8. Volunteer Availability

Volunteers provide:
- Timezone
- General availability
- Optional recurring availability
- Availability dates/times

The matching system uses availability to determine who should be notified.

For the MVP, do not build complicated scheduling optimization.

---

## 9. Notifications

Email notifications are required.

Notify volunteers when:
- A new eligible session becomes available
- They successfully claim a session
- A session is changed
- A session is cancelled
- A recurring series changes
- A recurring commitment is affected

Notify schools when:
- A session is claimed
- A volunteer backs out
- A session is cancelled
- A session has no volunteer
- A recurring commitment changes

---

## 10. Session Statuses

Use:

- DRAFT
- OPEN
- CLAIMED
- CONFIRMED
- COMPLETED
- CANCELLED
- NO_VOLUNTEER
- NO_SHOW
- DISPUTED

---

## 11. Video Calls

The MVP should NOT build its own video calling system.

Use an external meeting platform such as Google Meet or Zoom.

The platform stores and displays the meeting URL.

---

## 12. Feedback

Both volunteers and schools should receive a post-session feedback prompt.

Feedback should be simple enough to complete in under 2 minutes.

Include:
- Overall rating
- What went well?
- What could be improved?
- Optional comments
- Optional technical issues

Feedback should be associated with the specific session.

A general feedback form should also exist for broader MVP feedback.

---

## 13. Volunteer Hours

After a completed session:
- Record session duration
- Record volunteer participation
- Add completed hours to the volunteer's total

Example:
- 30-minute session = 0.5 hours
- 60-minute session = 1 hour

Admins should be able to review/edit hours if necessary.

---

## 14. Volunteer Application

Required fields:

- First name
- Last name
- Email
- Age
- Location
- Timezone
- Languages
- English proficiency
- Previous relevant experience
- Motivation
- Availability
- Agreement to volunteer rules/code of conduct

Applications require admin approval before volunteers can claim sessions.

---

## 15. School Application

Required fields:

- School name
- Location
- Coordinator name
- Coordinator email
- Approximate student count
- Available technology
- Preferred session times
- Additional notes

Schools require approval before creating sessions.

---

## 16. Volunteer Rules

Volunteers must agree to basic conduct requirements before participating.

Examples:
- Appropriate clothing
- No foul/inappropriate language
- Respect students and teachers
- No inappropriate private communication with students
- Follow school instructions
- Remain professional during sessions

Exact rules can be expanded later.

---

## 17. Student Privacy

The MVP should avoid collecting unnecessary student information.

Do NOT create:
- Student accounts
- Student profiles
- Parent accounts
- Student messaging
- Student personal data collection

The school/teacher manages the students.

---

## 18. MVP Exclusions

Do NOT build:

- Student accounts
- Parent accounts
- In-app messaging
- Built-in video calling
- AI tutoring
- AI matching
- Payments
- Complex curriculum management
- Student progress tracking
- Certificates
- Calendar integrations
- Advanced analytics
- Complex scheduling optimization

---

## 19. MVP Success Criteria

The MVP should successfully support:

School applies
→ Admin approves school
→ School creates classroom session
→ Approved volunteers are notified
→ Volunteer claims session
→ School and volunteer receive confirmation
→ Session occurs through external video platform
→ Session is marked completed
→ Volunteer hours are recorded
→ School and volunteer submit feedback