---
title: 'Combination in Math: Definition, Formula and Example'
description: >-
  Understand combinations in math: definition, formula, and how they differ from
  permutations. Essential for competitive exams like JEE Main.
tags: []
related:
  - argument-of-complex-numbers-definition-formula-example
  - atomic-number-mass-number-definition-example-formula-and-calculation-faqs
  - law-of-sines-definition-proof-formula-applications-and-example
  - unit-of-density-meaning-definition-example-unit-formula-faqs
  - permutation-vs-combination-definition-and-formulas
  - aufbau-principle-definition-example-features-configuration-faqs
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary difference between a combination and a permutation?
    a: >-
      The main difference is order. A combination is a selection of items where
      the order does not matter (e.g., picking 3 friends for a group). A
      permutation is an arrangement of items where the order is crucial (e.g.,
      arranging 3 friends in a line).
  - q: When should I use the combination formula?
    a: >-
      You should use the combination formula when you need to find the number of
      ways to select a subset of items from a larger set, and the sequence or
      order in which you pick those items does not change the outcome. Common
      examples include choosing committee members, lottery numbers, or cards in
      a hand.
  - q: Can 'r' be greater than 'n' in the combination formula?
    a: >-
      No, in the combination formula $^nC_r$, 'r' (the number of items to be
      selected) cannot be greater than 'n' (the total number of available
      items). You cannot select more items than you have. The condition $0 \le r
      \le n$ must always be met.
  - q: Why is 'r!' in the denominator of the combination formula?
    a: >-
      The 'r!' in the denominator accounts for the fact that in combinations,
      the order of selected items doesn't matter. For every unique combination
      of 'r' items, there are 'r!' ways to arrange those items. By dividing the
      number of permutations ($^nP_r$) by 'r!', we eliminate the overcounting
      caused by different orderings of the same set of items, leaving only the
      unique selections (combinations).
  - q: Are combinations important for entrance exams?
    a: >-
      Yes, combinations (along with permutations) are a very important topic for
      various competitive entrance exams in India. They frequently appear in the
      mathematics sections of exams like JEE Main, SRM Joint Engineering
      Entrance, BITSAT, WBJEE, and BCECE, as they test logical reasoning and
      problem-solving skills.
---

# Combination in Math: Definition, Formula and Example

In mathematics, a combination refers to the selection of items from a larger set where the order of selection does not matter. Unlike permutations, which focus on arrangements, combinations are solely about choosing a group of items.

## Key Takeaways

*   A combination is about selecting items, not arranging them.
*   The order in which items are chosen does not affect the combination.
*   Combinations are a fundamental concept in probability and discrete mathematics.
*   Understanding combinations is crucial for various competitive exams, including the Joint Entrance Examination (JEE) Main, as well as state-level engineering entrance tests like WBJEE and BCECE.

## What is a Combination?

Imagine you have a group of distinct objects, say 'A', 'B', 'C', and 'D'. If you need to select two objects from this group, a combination is simply one of the possible sets of two objects you could pick. The key here is that selecting 'A' then 'B' is considered the same combination as selecting 'B' then 'A'. Both result in the set {A, B}.

For instance, if we select two objects from 'A', 'B', 'C', and 'D', the possible combinations are:

*   {A, B}
*   {A, C}
*   {A, D}
*   {B, C}
*   {B, D}
*   {C, D}

As you can see, there are six unique ways to select two distinct objects from a set of four when the order doesn't matter.

## The Combination Formula

To generalize this concept for selecting 'r' objects from a total of 'n' distinct objects, we use the combination formula. This formula helps us calculate the number of possible combinations, denoted as $^nC_r$ or $\binom{n}{r}$.

The formula is derived from the relationship between combinations and permutations:

$^nC_r = \frac{n!}{r!(n-r)!}$

Where:

*   'n' is the total number of distinct items available for selection.
*   'r' is the number of items to be selected.
*   '!' denotes the factorial (e.g., n! = n × (n-1) × ... × 1).
*   The condition $0 \le r \le n$ must be met, and 'r' must be a whole number.

Let's apply this to our earlier example of selecting 2 objects from 4:

$^4C_2 = \frac{4!}{2!(4-2)!} = \frac{4!}{2!2!} = \frac{4 \times 3 \times 2 \times 1}{(2 \times 1)(2 \times 1)} = \frac{24}{4} = 6$

This matches our manual count, confirming the formula's accuracy.

## Relation Between Combinations and Permutations

Combinations and permutations are closely related, but distinct. A permutation considers the order of selection, while a combination does not. For every combination of 'r' objects chosen from 'n', there are 'r!' ways to arrange those 'r' objects. This means that the number of permutations will always be greater than or equal to the number of combinations for the same 'n' and 'r' values (unless r=0 or r=1).

The relationship is formally expressed as:

$^nP_r = ^nC_r \times r!$

Where $^nP_r$ represents the number of permutations of 'r' items chosen from 'n'. This equation shows that if you first choose 'r' items (a combination) and then arrange them in all possible ways, you get the total number of permutations.

## Solved Example: Cricket World Cup Matches

Let's consider a real-world scenario. In the league stage of a major cricket tournament, suppose 10 teams participate, and each team must play exactly one match against every other team. How many total league-stage matches will be played?

Here, the order of teams in a match doesn't matter (Team A vs. Team B is the same match as Team B vs. Team A). So, this is a combination problem.

*   Total number of teams (n) = 10
*   Number of teams needed for one match (r) = 2

Using the combination formula:

$^10C_2 = \frac{10!}{2!(10-2)!} = \frac{10!}{2!8!} = \frac{10 \times 9 \times 8!}{ (2 \times 1) \times 8!} = \frac{10 \times 9}{2} = \frac{90}{2} = 45$

Therefore, a total of 45 matches will be played in the league stage.

Mastering combinations is an essential skill for students, particularly those preparing for competitive examinations like JEE Main, conducted by NTA, where such questions frequently appear.
