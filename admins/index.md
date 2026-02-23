<!-- Last updated: 2026-02-22 -->

# Admins — Onboarding Your School

This guide walks you through setting up Questerix for your school from scratch.

---

## Your Role as Admin

As a school admin, you control everything at the school level:

- **Create and manage teacher accounts**
- **Create and manage student accounts**
- **Set up the curriculum** (Domains, Skills, Questions)
- **Import questions in bulk** using the Bulk Import tool
- **Monitor usage** across all teachers and students
- **Manage the school's grade app** (e.g., Math 7th Grade)

You work in the **Admin Panel** — a separate web application from the student app.

---

## Step 1: Log In to the Admin Panel

1. Go to `admin.questerix.com`.
2. Enter your admin email and password.
3. You'll land on the **Dashboard** showing your school's overall activity.

::: tip First time logging in?
Use the **Forgot password?** link on the login page. An email will be sent to your registered address.
:::

---

## Step 2: Understand the Admin Panel Layout

The left sidebar has these main sections:

| Section       | Purpose                                                |
| ------------- | ------------------------------------------------------ |
| **Dashboard** | School-wide overview — active users, recent sessions   |
| **Domains**   | Top-level curriculum areas (e.g., "Number", "Algebra") |
| **Skills**    | Skills within each domain (e.g., "Adding fractions")   |
| **Questions** | Individual practice questions for each skill           |
| **Import**    | Bulk import questions from CSV/Excel                   |
| **Users**     | Manage teachers, students, and parent accounts         |
| **Settings**  | School profile, app configuration                      |

---

## Step 3: Set Up Your Curriculum

The curriculum is organised in three levels:

```
Domain → Skill → Questions
```

**Example:**

```
Domain: Number and Algebra
  Skill: Solving linear equations
    Question: Solve 2x + 3 = 11
    Question: Solve 5x - 7 = 13
```

### Add a Domain

1. Click **Domains** in the sidebar.
2. Click **New Domain**.
3. Enter a name and optional description.
4. Click **Save**.

### Add a Skill

1. Click **Skills** in the sidebar.
2. Click **New Skill**.
3. Select the parent **Domain**.
4. Enter a skill name and difficulty level.
5. Click **Save**.

### Add Questions

You can add questions one at a time or in bulk. See **[Bulk Import](./bulk-import)** for the faster method.

---

## Step 4: Create Teacher and Student Accounts

### Create a Teacher Account

1. Go to **Users → Teachers**.
2. Click **Invite Teacher**.
3. Enter their email address.
4. Click **Send Invite**.

The teacher receives an email with a link to set their password.

### Create a Student Account

1. Go to **Users → Students**.
2. Click **New Student**.
3. Enter the student's name and email (a school-issued email or parent email is fine).
4. The student receives an invitation to set their password.

::: tip Bulk create students
You can add multiple students at once using the **Import Students** feature. Prepare a CSV with columns: `first_name`, `last_name`, `email`.
:::

---

## Step 5: Assign Students to a Grade App

Every student must be assigned to a **Grade App** (e.g., "Math 7th Grade"). This determines which curriculum they practice.

1. Go to **Users → Students**.
2. Click on a student's name.
3. In their profile, find **Enrolled App**.
4. Select the correct Grade App from the dropdown.
5. Click **Save**.

Students can only be enrolled in one Grade App at a time.

---

## Frequently Asked Questions

### How do I reset a student's password?

You cannot reset it for them directly (passwords are encrypted). Instead:

1. Go to **Users → Students**.
2. Find the student and click on their name.
3. Click **Resend Invitation** to send them a fresh password-setup link.

### Can I see what questions individual students answered?

Yes. Go to **Users → Students**, click the student, then click **Session History**. You'll see every session with question-level detail.

### What's the difference between a Domain and a Skill?

- A **Domain** is a broad topic area (e.g., "Geometry").
- A **Skill** is a specific capability within that area (e.g., "Area of triangles").
- **Questions** test individual skills.

### Can a student be in multiple schools?

No. Each student account belongs to one school. If a student transfers schools, their data stays with the original school.
