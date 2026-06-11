---
title: 'Derangement- Concepts, Definition & Solved Examples'
description: >-
  Explore derangement concepts, definitions, and solved examples for Indian
  higher education. Learn key formulas and quick values for competitive exams.
tags: []
related:
  - a-career-definition-examples-types
  - algebraic-function-definition-examples-types
  - animal-husbandry-definition-types-examples-role-challenges
  - arithmetic-progression-definition-nth-term-formulas-sum-and-examples
  - chemical-bonding-definition-types-questions-examples
  - circles-in-maths-definition-formulas-properties-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is the basic definition of derangement?
    a: >-
      Derangement is a type of permutation where none of the elements of a set
      appear in their original or designated positions. It's an arrangement
      where no item ends up in its correct place.
  - q: Why is derangement important for competitive exams like JEE Main?
    a: >-
      Derangement questions frequently appear in the permutations and
      combinations section of competitive exams. Understanding the concept and
      its formula, along with common values, can help students quickly solve
      these problems and score better.
  - q: How is derangement different from a regular permutation?
    a: >-
      A regular permutation is any arrangement of items. Derangement is a
      *specific type* of permutation where the additional condition is that *no*
      item occupies its initial position. All derangements are permutations, but
      not all permutations are derangements.
  - q: Are there any real-world applications of derangement?
    a: >-
      Yes, derangement finds applications in various fields such as
      cryptography, statistical mechanics, and probability theory, particularly
      in scenarios involving matching or non-matching items, like the classic
      'letters in wrong envelopes' problem.
  - q: What are the derangement values for a small number of items?
    a: >-
      For a small number of items, the derangement values are: D(1)=0, D(2)=1,
      D(3)=2, D(4)=9, D(5)=44, and D(6)=265. Memorizing these can save time
      during exams.
---

# Derangement - Concepts, Definition & Solved Examples

Derangement is a fascinating concept within permutations and combinations, focusing on arrangements where no element ends up in its original or designated spot. It's a key topic for students preparing for Class 11 mathematics board exams and competitive entrance tests like JEE Main.

## Key Takeaways

*   Derangement refers to a specific type of permutation where no item occupies its initial position.
*   It's a crucial concept in probability, puzzles, and various mathematical fields.
*   Understanding derangement formulas and common values can significantly speed up problem-solving.
*   The topic is frequently tested in major engineering entrance exams across India.

## What is Derangement?

At its core, derangement is an arrangement of a set of items such that none of the items appear in their original, correct, or expected position. Think of it as mixing things up so thoroughly that nothing ends up where it started. A classic illustration involves 'n' letters and 'n' corresponding envelopes; a derangement occurs if *no* letter is placed into its correct envelope.

Mathematically, it's a permutation with no fixed points. If you have 'n' distinct objects and 'n' specific places, a derangement is any arrangement where none of the objects are in their assigned correct place.

The number of ways to derange 'n' objects is commonly denoted by D(n) or !n. The general formula for calculating D(n) is:

$D(n) = n! \left(1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!} + \ldots + (-1)^n \frac{1}{n!}\right)$

## Quick Values for Derangements

Memorizing the derangement values for small 'n' can be a real time-saver in exams. These are directly derived from the formula and are frequently used in problems:

*   D(1) = 0
*   D(2) = 1
*   D(3) = 2
*   D(4) = 9
*   D(5) = 44
*   D(6) = 265

Having these values at your fingertips allows for rapid solutions to questions involving a small number of items without needing to apply the full formula each time.

## Solved Example: The Dancing Couple Problem

Let's consider a practical application of derangement:

**Example:** Three boys (B1, B2, B3) and three girls (G1, G2, G3) are to form dancing couples. If B1 is usually paired with G1, B2 with G2, and B3 with G3, in how many ways can they form couples such that no boy dances with his usual partner (girlfriend)?

**Solution:**

This scenario is a classic derangement problem. We have 3 boys and 3 girls, and we want to arrange them so that none of the boys ends up with their original partner. This is a derangement of 3 items, which means we need to find D(3).

From our quick values list, we know that D(3) = 2.

Alternatively, using the formula for n=3:

$D(3) = 3! \left(1 - \frac{1}{1!} + \frac{1}{2!} - \frac{1}{3!}\right)$

$D(3) = 6 \left(1 - 1 + \frac{1}{2} - \frac{1}{6}\right)$

$D(3) = 6 \left(0 + \frac{3}{6} - \frac{1}{6}\right)$

$D(3) = 6 \left(\frac{2}{6}\right)$

$D(3) = 2$

So, there are **2 ways** for them to form dancing couples such that no boy dances with his usual partner.

Understanding derangements provides a powerful tool for solving complex permutation problems efficiently, proving invaluable for competitive exams.
