<!-- Last updated: 2026-02-22 -->

# Managing Users

This page covers everything you need to manage teacher, student, and parent accounts.

---

## Managing Teachers

### Invite a Teacher

1. Go to **Users → Teachers**.
2. Click **Invite Teacher**.
3. Enter the teacher's email address.
4. Click **Send Invite**.

The teacher receives an email with a link to set up their account. The link expires after 24 hours — if it expires, resend the invite.

### Resend an Invitation

1. Go to **Users → Teachers**.
2. Find the teacher — their status will show **Pending**.
3. Click the three-dot menu (⋮) next to their name.
4. Click **Resend Invite**.

### Deactivate a Teacher

When a teacher leaves your school:

1. Go to **Users → Teachers**.
2. Click on the teacher's name.
3. Click **Deactivate Account**.
4. Confirm the action.

Their account is deactivated — not deleted. Their historical data (groups, student progress under their supervision) is preserved.

---

## Managing Students

### Create a Student Account

1. Go to **Users → Students**.
2. Click **New Student**.
3. Fill in:
   - First name
   - Last name
   - Email address (use a school-issued email or parent email)
4. Click **Create Student**.

The student receives an invitation email to set their password.

### Bulk Import Students

If you need to add many students at once:

1. Go to **Import** in the sidebar.
2. Download the **Student Import Template** (CSV/Excel).
3. Fill in the template with: `first_name`, `last_name`, `email`.
4. Upload the completed file.
5. Review the preview and click **Import**.

![Bulk import screen](../public/screenshots/admin-bulk-import.png)

::: tip Validation errors
If some rows fail, the rest still import. Download the error report to see which rows need fixing.
:::

### Reset a Student's Access

If a student is locked out:

1. Go to **Users → Students**.
2. Click on the student.
3. Click **Resend Invitation** to send them a new password-setup link.

### Deactivate a Student

When a student leaves your school:

1. Go to **Users → Students**.
2. Click on the student's name.
3. Click **Deactivate Account**.

Their data is preserved. If they return, you can reactivate the account.

---

## Managing Parent Accounts

Parents are linked to students. When a parent account is created, they can see their child's progress.

### Link a Parent to a Student

1. Go to **Users → Students**.
2. Click on the student's name.
3. Find the **Linked Parent** section.
4. Click **Add Parent**.
5. Enter the parent's email address.
6. Click **Send Invite**.

The parent receives an invitation to set their password. Once set up, they can log in and view their child's progress.

### Remove a Parent Link

1. Go to **Users → Students → [Student Name]**.
2. Find the parent in the **Linked Parent** section.
3. Click **Remove**.

The parent account continues to exist but can no longer view that student's data.

---

## User Roles Summary

| Role        | What They Can Do                                         |
| ----------- | -------------------------------------------------------- |
| **Admin**   | Full access — curriculum, users, reports, settings       |
| **Teacher** | Create groups, view student progress within their groups |
| **Student** | Practise questions in the student app                    |
| **Parent**  | View their linked child's progress only                  |
