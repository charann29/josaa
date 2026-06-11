---
title: Sum and Difference of Inverse Trigonometric Functions
description: >-
  Explore the sum and difference formulas for inverse trigonometric functions
  like arctan and arcsin. Essential for Class 12 Maths and JEE Main.
tags: []
related:
  - derivative-of-inverse-trigonometric-functions
  - inverse-trigonometric-functions-notes-topics-formulas-equations-books
  - graphs-of-general-trigonometric-functions
  - trigonometric-functions-notes-topics-formulas-equations-books-question
  - arithmetic-progression-definition-nth-term-formulas-sum-and-examples
  - question-two-numbers-are-in-the-ratio-of-2-3-if-their-sum-is-125-find
topic: study-guides
rewritten: true
faqs:
  - q: What is an inverse trigonometric function?
    a: >-
      An inverse trigonometric function helps us find an angle when we know the
      value of a trigonometric ratio. For example, if $\sin(\theta) = 0.5$, then
      $\arcsin(0.5)$ tells us that $\theta = 30^{\circ}$ or $\pi/6$ radians.
  - q: Why do inverse trigonometric functions have restricted domains?
    a: >-
      Standard trigonometric functions are periodic, meaning they repeat their
      values. To ensure that an inverse function gives a unique output (angle)
      for each input, their domains are restricted to specific principal value
      branches where they are one-to-one.
  - q: Are these formulas important for JEE Main?
    a: >-
      Yes, these formulas are very important for JEE Main and other competitive
      engineering entrance exams. Questions on inverse trigonometric functions,
      including their sum and difference identities, appear regularly in these
      tests, as seen in past JEE Main papers.
  - q: >-
      What is the primary use of sum and difference formulas for inverse
      trigonometric functions?
    a: >-
      These formulas are primarily used to simplify expressions involving
      multiple inverse trigonometric terms into a single term. This
      simplification is crucial for solving equations, proving identities, and
      evaluating complex mathematical expressions.
  - q: Can these formulas be applied to all values of x and y?
    a: >-
      No, it's critical to observe the conditions on $x$ and $y$ that accompany
      each formula. These conditions determine which specific form of the
      formula applies and ensure the result is within the correct principal
      value branch.
  - q: Are there similar formulas for inverse cosine (arccos)?
    a: >-
      Yes, similar sum and difference formulas also exist for inverse cosine
      functions. While this article focused on arctan and arcsin, the principles
      of combining inverse trigonometric functions extend to arccos as well.
---

# Sum and Difference of Inverse Trigonometric Functions

Inverse trigonometric functions are essential mathematical tools that help us find angles when we know the ratios of sides in a right-angled triangle. Understanding how to add and subtract these functions is crucial for solving complex problems in higher mathematics.

## Key takeaways

*   Inverse trigonometric functions 'undo' the work of their standard trigonometric counterparts, helping us determine angles.
*   The domain and range swap between a function and its inverse; for inverse trigonometric functions, this means restricting the original function's domain to ensure a unique inverse.
*   Formulas for sums and differences of inverse tangent (arctan) and inverse sine (arcsin) are fundamental for simplifying expressions and solving equations.
*   This topic is a key part of Class 12 Mathematics and frequently appears in competitive exams like JEE Main and various state-level engineering entrance tests.

## Understanding Inverse Trigonometric Functions

Just as subtraction reverses addition, or division reverses multiplication, an inverse trigonometric function reverses a standard trigonometric function. For example, if $\sin(\theta) = x$, then $\arcsin(x) = \theta$. This allows us to find the angle $\theta$ when we know the value of $x$.

Since standard trigonometric functions (like sine, cosine, tangent) repeat their values over their full domain, they aren't one-to-one. To define a true inverse, we must limit their domains to specific principal value branches where they are one-to-one. This ensures that for every input, there's only one output angle.

In practical applications, inverse trigonometric functions are used in fields like engineering and physics to calculate angles of elevation, depths, or trajectories.

## Sum and Difference Formulas for Inverse Tangent (arctan)

These formulas allow us to combine two inverse tangent expressions into a single one, which can greatly simplify calculations. It's important to pay attention to the conditions on $x$ and $y$, as these determine the specific form of the result.

### Sum of arctan functions

$\tan^{-1} x + \tan^{-1} y = \begin{cases}
\tan^{-1}\left(\frac{x+y}{1-xy}\right), & \text{if } x>0, y>0, xy<1 \\
\pi+\tan^{-1}\left(\frac{x+y}{1-xy}\right), & \text{if } x>0, y>0 \text{ and } xy>1 \\
-\pi+\tan^{-1}\left(\frac{x+y}{1-xy}\right), & \text{if } x<0, y<0 \text{ and } xy>1
\end{cases}$

### Difference of arctan functions

$\tan^{-1} x - \tan^{-1} y = \begin{cases}
\tan^{-1}\left(\frac{x-y}{1+xy}\right), & \text{if } xy>-1 \\
\pi+\tan^{-1}\left(\frac{x-y}{1+xy}\right), & \text{if } x>0, y<0 \text{ and } xy<-1 \\
-\pi+\tan^{-1}\left(\frac{x-y}{1+xy}\right), & \text{if } x<0, y>0 \text{ and } xy<-1
\end{cases}$

## Sum and Difference Formulas for Inverse Sine (arcsin)

Similar to arctan, there are specific formulas for combining inverse sine functions. These are particularly useful when dealing with expressions involving square roots.

### Sum of arcsin functions

$\sin^{-1} x + \sin^{-1} y = \begin{cases}
\sin^{-1}\{x \sqrt{1-y^2}+y \sqrt{1-x^2}\} & \text{if } -1 \leq x, y \leq 1 \text{ and } x^2+y^2 \leq 1 \\
\pi-\sin^{-1}\{x \sqrt{1-y^2}+y \sqrt{1-x^2}\} & \text{or, if } xy<0 \text{ and } x^2+y^2>1 \\
& \text{if } 0<x, y \leq 1 \text{ and } x^2+y^2>1 \\
-\pi-\sin^{-1}\{x \sqrt{1-y^2}+y \sqrt{1-x^2}\} & \text{if } -1 \leq x, y<0 \text{ and } x^2+y^2>1
\end{cases}$

### Difference of arcsin functions

$\sin^{-1} x - \sin^{-1} y = \begin{cases}
\sin^{-1}\{x \sqrt{1-y^2}-y \sqrt{1-x^2}\} & \text{if } -1 \leq x, y \leq 1 \text{ and } x^2+y^2 \leq 1 \\
\pi-\sin^{-1}\{x \sqrt{1-y^2}-y \sqrt{1-x^2}\} & \text{if } 0<x \leq 1, -1 \leq y<0 \text{ and } x^2+y^2>1 \\
-\pi-\sin^{-1}\{x \sqrt{1-y^2}-y \sqrt{1-x^2}\} & \text{if } -1 \leq x<0, 0<y \leq 1 \text{ and } x^2+y^2>1
\end{cases}$

## Importance for Competitive Exams

Inverse trigonometric functions, especially their sum and difference identities, are a significant component of the Class 12 Mathematics syllabus. This topic is frequently tested in major engineering entrance examinations. For instance, the Joint Entrance Examination (JEE Main) has included fourteen questions on inverse trigonometric functions between 2013 and 2023, with a notable five questions in 2022 and two in 2023. Other competitive exams like SRMJEE, BITSAT, WBJEE, and BCECE also often feature questions from this area, making a thorough understanding essential for aspiring engineers.

Mastering these formulas and their conditions will provide a strong foundation for tackling advanced trigonometry problems and performing well in crucial entrance examinations.
