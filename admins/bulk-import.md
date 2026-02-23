<!-- Last updated: 2026-02-22 -->

# Bulk Question Import

Bulk Import lets you add hundreds of questions at once using a spreadsheet. This is the fastest way to populate your curriculum.

---

## When to Use Bulk Import

Use Bulk Import when:

- You're setting up the curriculum for the first time
- You have a large set of questions from an existing question bank
- You want to add multiple question types (MCQ, Short Answer) at once

For adding a few questions individually, the **Questions** page is easier.

---

## Step 1: Download the Template

1. Go to **Import** in the left sidebar.
2. Click **Download Template**.
3. Open the file in Excel or Google Sheets.

The template has these columns:

| Column           | Required | Description                                                           |
| ---------------- | -------- | --------------------------------------------------------------------- |
| `domain`         | Yes      | Name of the Domain (must match exactly)                               |
| `skill`          | Yes      | Name of the Skill (must match exactly)                                |
| `question_type`  | Yes      | `mcq` or `short_answer`                                               |
| `question_text`  | Yes      | The question as shown to students                                     |
| `option_a`       | MCQ only | First answer option                                                   |
| `option_b`       | MCQ only | Second answer option                                                  |
| `option_c`       | MCQ only | Third answer option                                                   |
| `option_d`       | MCQ only | Fourth answer option                                                  |
| `correct_answer` | Yes      | For MCQ: `a`, `b`, `c`, or `d`. For short answer: the expected answer |
| `difficulty`     | No       | `easy`, `medium`, or `hard` (defaults to `medium`)                    |
| `explanation`    | No       | Shown to students after they answer                                   |

---

## Step 2: Fill In Your Questions

::: warning Domain and Skill names must match exactly
If your template says `"Number"` and Questerix has `"Number and Algebra"`, the import will fail for those rows. Check the exact names in the **Domains** and **Skills** sections first.
:::

**Example MCQ row:**

| domain  | skill            | question_type | question_text        | option_a | option_b | option_c | option_d | correct_answer | difficulty |
| ------- | ---------------- | ------------- | -------------------- | -------- | -------- | -------- | -------- | -------------- | ---------- |
| Algebra | Linear Equations | mcq           | What is x if 2x = 8? | 2        | 4        | 6        | 8        | b              | easy       |

**Example Short Answer row:**

| domain | skill     | question_type | question_text | correct_answer | difficulty |
| ------ | --------- | ------------- | ------------- | -------------- | ---------- |
| Number | Fractions | short_answer  | Simplify 6/9  | 2/3            | medium     |

---

## Step 3: Upload the File

1. Go to **Import** in the sidebar.
2. Click **Upload File**.
3. Select your completed CSV or Excel file.
4. A preview shows the first 10 rows.
5. Review the preview for errors.
6. Click **Import All** to proceed.

---

## Step 4: Review the Results

After the import, you'll see a summary:

- ✅ **Imported successfully**: X questions added
- ⚠️ **Skipped**: Rows that had missing required fields
- ❌ **Failed**: Rows with unrecognised Domain or Skill names

Download the **Error Report** to see exactly which rows failed and why.

---

## Common Errors and Fixes

| Error                    | Cause                             | Fix                                             |
| ------------------------ | --------------------------------- | ----------------------------------------------- |
| `Domain not found`       | Domain name in file doesn't match | Copy/paste the exact name from the Domains page |
| `Skill not found`        | Skill name doesn't match          | Copy/paste the exact name from the Skills page  |
| `Missing correct_answer` | No answer provided                | Add the correct answer to every row             |
| `Invalid question_type`  | Typo in the type column           | Use exactly `mcq` or `short_answer`             |

---

## AI-Assisted Question Generation

If you find question writing time-consuming, Questerix has an **AI Question Generator**. It can generate draft questions for any skill based on the curriculum level.

1. Go to **Questions**.
2. Click on a skill.
3. Click **Generate with AI**.
4. Review and edit the generated questions before publishing.

AI-generated questions are never published automatically — you always review first.
