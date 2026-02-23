<!-- Last updated: 2026-02-22 -->

# Creating Questions

Questions are the core of the Questerix learning experience. Every question belongs to a **Skill**, which belongs to a **Domain**. This page explains how to create, edit, and publish questions effectively.

::: tip This section will grow
As new question types and authoring tools are released, this page will expand. Check back regularly.
:::

---

## Before You Create Questions

Make sure your curriculum structure is in place first. Questions cannot exist without a Skill, and Skills cannot exist without a Domain.

**Required order:**

```text
1. Create Domain(s)
2. Create Skill(s) inside each Domain
3. Create Question(s) inside each Skill
```

If you haven't set up Domains and Skills yet, see [School Onboarding](./) first.

---

## Question Types

Questerix currently supports two question types, with more planned:

| Type                           | Description                                                  | Best For                                                 |
| ------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------- |
| **Multiple Choice (MCQ)**      | Student picks one correct answer from 4 options              | Factual recall, definitions, identifying correct methods |
| **Short Answer**               | Student types a word, number, or short phrase                | Calculations, fill-in-the-blank, exact answers           |
| _AI-Generated_ _(coming soon)_ | Questions drafted by AI, reviewed by admin before publishing | Rapid content creation at scale                          |

---

## Creating a Question Manually

**Problem:** You want to add a single question to a specific Skill.

**Solution:**

1. In the left sidebar, click **Questions**.
2. Use the **Domain** and **Skill** filters to find the right skill.
3. Click **New Question**.
4. Fill in the question form (see field reference below).
5. Click **Save as Draft** to review later, or **Publish** to make it live immediately.

**Verification:** The question appears in the skill's question list with either a **Draft** or **Live** badge.

---

## Multiple Choice Question (MCQ)

MCQ questions present four answer options. Exactly one must be correct.

### Field Reference

| Field              | Required       | Description                                                                        |
| ------------------ | -------------- | ---------------------------------------------------------------------------------- |
| **Question Text**  | ✅             | The question as shown to the student. Be clear and unambiguous.                    |
| **Option A**       | ✅             | First answer choice                                                                |
| **Option B**       | ✅             | Second answer choice                                                               |
| **Option C**       | ✅             | Third answer choice                                                                |
| **Option D**       | ✅             | Fourth answer choice                                                               |
| **Correct Answer** | ✅             | Which option is correct: A, B, C, or D                                             |
| **Difficulty**     | ✅             | `Easy`, `Medium`, or `Hard` (see [Difficulty Guidelines](#difficulty-guidelines))  |
| **Explanation**    | ☑️ Recommended | Shown to the student after they answer. Explain _why_ the correct answer is right. |

### Writing Good MCQ Options

**Do:**

- Make all four options plausible. Obvious wrong answers teach students nothing.
- Keep options roughly the same length. Students pattern-match on length.
- Use parallel grammatical structure across all options.

**Avoid:**

- "All of the above" / "None of the above" — unreliable distractors.
- Trick wording that confuses, rather than tests understanding.
- Two options that mean the same thing.

### MCQ Example

> **Question:** What is the value of x if 3x + 6 = 18?
>
> A. 2  
> B. 4 ✅  
> C. 6  
> D. 8
>
> **Explanation:** Subtract 6 from both sides to get 3x = 12, then divide both sides by 3 to get x = 4.

---

## Short Answer Question

Short answer questions require the student to type their answer. The system checks it against the expected answer you provide.

### Short Answer Field Reference

| Field                   | Required       | Description                                                       |
| ----------------------- | -------------- | ----------------------------------------------------------------- |
| **Question Text**       | ✅             | The question as shown to the student                              |
| **Expected Answer**     | ✅             | The exact answer the student must type. See matching rules below. |
| **Acceptable Variants** | ☑️ Optional    | Alternative correct spellings or forms (e.g., `2/3` and `0.67`)   |
| **Difficulty**          | ✅             | Easy, Medium, or Hard                                             |
| **Explanation**         | ☑️ Recommended | Shown after the student answers                                   |

### Answer Matching Rules

The system applies these rules when checking short answers:

| Rule                 | Behaviour                                                |
| -------------------- | -------------------------------------------------------- |
| **Case-insensitive** | `Triangle` and `triangle` are both accepted              |
| **Trim whitespace**  | Leading/trailing spaces are ignored                      |
| **Exact match**      | Beyond the above, the answer must match exactly          |
| **Variants**         | Any text listed in "Acceptable Variants" is also correct |

::: warning Numbers and fractions
For maths answers, always add common variants. For example, if the answer is `2/3`, also add `0.67` and `0.667` as acceptable variants.
:::

### Short Answer Example

> **Question:** Simplify the fraction 8/12.
>
> **Expected answer:** `2/3`  
> **Acceptable variants:** `0.67`, `0.667`, `two thirds`
>
> **Explanation:** Both the numerator (8) and denominator (12) are divisible by 4, giving 2/3.

---

## Difficulty Guidelines

Setting the right difficulty level ensures students get an appropriate challenge.

| Level      | Description                                               | Example                                                                      |
| ---------- | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Easy**   | Direct application of a single concept. One step.         | "Solve x + 3 = 7"                                                            |
| **Medium** | Two or more steps, or requires selecting the right method | "Solve 2x + 5 = 13"                                                          |
| **Hard**   | Multi-step reasoning, word problems, or abstract concepts | "A rectangle has area 36cm². Its length is twice its width. Find the width." |

Aim for a mix of roughly **30% Easy, 50% Medium, 20% Hard** per skill.

---

## Editing a Question

**Problem:** You need to fix a typo or update an answer in a published question.

**Solution:**

1. Go to **Questions** and find the question.
2. Click the question to open it.
3. Make your changes.
4. Click **Save**.

Changes take effect immediately — even for published questions. Students currently in a session will see the updated question on their next attempt.

::: warning Edit carefully
There is no draft mode for edits to published questions. Changes go live immediately.
:::

---

## Draft vs Published

| Status        | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| **Draft**     | Saved but not live. Students cannot see it. Safe for review and editing. |
| **Published** | Live and active. Students will encounter it in their next session.       |

**Publishing a draft:**

1. Open the question.
2. Click **Publish**.

**Unpublishing a question:**

1. Open the question.
2. Click **Revert to Draft**.

---

## Archiving a Question

If a question is no longer needed but you want to keep a record:

1. Open the question.
2. Click the three-dot menu (⋮) in the top right.
3. Click **Archive**.

Archived questions are hidden from students and excluded from reports. They can be restored at any time.

---

## Bulk Import

To add many questions at once using a spreadsheet, see the **[Bulk Question Import](./bulk-import)** guide.

---

## AI-Assisted Question Generation _(Preview)_

The AI Question Generator creates draft questions for any skill based on the curriculum level. It uses the skill name and domain as context.

::: info Coming soon for all schools
AI generation is currently in preview. It will be available to all schools in an upcoming release.
:::

**How it works (preview):**

1. Go to **Questions** and select a Skill.
2. Click **Generate with AI**.
3. Choose question type and difficulty.
4. The AI generates 5–10 draft questions.
5. Review each one — edit, approve to publish, or discard.

**Important:** AI-generated questions are always drafts. Nothing is published without your review. You are responsible for the final quality of all published content.

---

## Quality Checklist

Before publishing a batch of questions, run through this checklist:

- [ ] Question text is unambiguous — one clear reading
- [ ] For MCQ: all four options are plausible
- [ ] Correct answer is definitely correct
- [ ] Explanation is clear and educational
- [ ] Difficulty level is appropriate
- [ ] No spelling or grammatical errors
- [ ] For short answer: common answer variants are listed
