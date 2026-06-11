---
title: 'Permutation vs Combination: Definition and Formulas'
description: >-
  Explore the core differences between permutation and combination with clear
  definitions, formulas, and practical examples for Indian students and parents.
tags: []
related:
  - combination-in-math-definition-formula-and-example
  - arithmetic-progression-definition-nth-term-formulas-sum-and-examples
  - circles-in-maths-definition-formulas-properties-and-examples
  - harmonic-progression-hp-definition-formulas-and-examples
  - indefinite-integrals-definition-properties-formulas-and-examples
  - trigonometric-ratios-definition-formulas-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is the main difference between permutation and combination?
    a: >-
      The main difference is that in permutations, the order of arrangement
      matters, while in combinations, the order of selection does not matter.
      Permutations are about 'arranging' items, and combinations are about
      'selecting' items.
  - q: When should I use the permutation formula?
    a: >-
      You should use the permutation formula when you are arranging items and
      the sequence or position of each item is important. Examples include
      arranging books on a shelf, forming a password, or determining the
      finishing order in a race.
  - q: When should I use the combination formula?
    a: >-
      You should use the combination formula when you are selecting items from a
      group and the order in which they are chosen is not important. Examples
      include choosing a committee, selecting lottery numbers, or picking a hand
      of cards.
  - q: Are permutations and combinations important for competitive exams?
    a: >-
      Yes, permutations and combinations are very important for competitive
      exams, including the Joint Entrance Examination (Main), BITSAT, and
      various other engineering and entrance tests. They often form a
      significant part of the mathematics syllabus.
  - q: Can you give an example of a permutation?
    a: >-
      If you have 5 different books and want to arrange 3 of them on a shelf,
      the number of ways to do this is a permutation. The order of the books on
      the shelf matters, so arranging Book A, then B, then C is different from
      C, then B, then A.
  - q: Can you give an example of a combination?
    a: >-
      If you have 5 different fruits and want to choose 3 of them to make a
      fruit salad, the number of ways to do this is a combination. Choosing an
      apple, then a banana, then an orange results in the same salad as choosing
      an orange, then a banana, then an apple – the order of selection doesn't
      change the final group of fruits.
---

# Permutation vs Combination: Definition and Formulas

Understanding permutations and combinations is essential for solving problems where you need to count the number of ways to arrange or select items from a larger group. This topic is a fundamental part of Class 11 Mathematics and frequently appears in competitive exams like the Joint Entrance Examination (Main), BITSAT, and others.

## Key takeaways

*   Permutations deal with arrangements where the order of items matters.
*   Combinations focus on selections where the order of items does not matter.
*   Both concepts involve choosing a subset of items from a larger set.
*   The formulas for permutations and combinations are closely related and can be derived from each other.

## What is a Permutation?

Permutation refers to the arrangement of objects where the sequence or order of those objects is important. Think of it as filling specific positions with available items; the way you place them makes a difference. For example, if you have three people (A, B, C) and two chairs, arranging them as A then B is different from B then A.

The formula for calculating the number of permutations of 'n' distinct objects taken 'r' at a time is given by:

$^n P_r = \frac{n!}{(n-r)!}$

Here, 'n' represents the total number of distinct objects available, and 'r' represents the number of objects being arranged.

## What is a Combination?

Combination, on the other hand, is about selecting objects from a group where the order of selection does not matter. It's simply about choosing a subset. Using the previous example, if you're just selecting two people out of A, B, C to form a pair, then selecting A and B is the same as selecting B and A.

The formula for calculating the number of combinations of 'n' distinct objects taken 'r' at a time is:

$^n C_r = \frac{n!}{r!(n-r)!}$

Here, 'n' is the total number of distinct objects, and 'r' is the number of objects being chosen.

## The Relationship Between Permutations and Combinations

There's a direct link between these two concepts. A combination is essentially a permutation where we divide out the arrangements that are considered identical because order doesn't matter. Specifically, for every 'r' objects selected, there are 'r!' ways to arrange them. Therefore, if you take the formula for permutations and divide it by the number of ways to arrange the selected items, you get the combination formula:

$^n P_r = \ ^n C_r \times r!$

This relationship highlights that once you've selected a group of 'r' items (combination), you can then arrange those 'r' items in 'r!' ways to get all possible permutations involving that specific group.

## Permutation vs. Combination: Key Differences

To help you distinguish between these two, consider the following table:

| Feature           | Permutation                                     | Combination                                     |
| :---------------- | :---------------------------------------------- | :---------------------------------------------- |
| **Order**         | Order matters                                   | Order does not matter                           |
| **Action**        | Arranging, ordering, sequencing                 | Selecting, choosing, grouping                   |
| **Example (Team)**| Picking a team captain, vice-captain, and player from a group | Picking three team members from a group         |
| **Example (Prizes)**| Awarding 1st, 2nd, and 3rd place prizes         | Picking three winners for identical prizes      |
| **Real-world Use**| Passwords, seating arrangements, race finishes  | Forming committees, choosing menu items, lottery selections |

## Practical Applications

Understanding permutations and combinations helps in various real-world scenarios:

*   **Security:** Password creation relies on permutations, as the order of characters is crucial for security. The more character options and positions, the more permutations, making passwords harder to guess.
*   **Planning:** Travel itineraries often involve permutations when the sequence of visiting cities or attractions impacts the overall experience or travel time.
*   **Sports:** A coach selecting a batting order for a cricket team is a permutation problem (order matters), while simply choosing the 11 players for the squad is a combination problem (order of selection doesn't matter).

This fundamental distinction is key to correctly approaching problems in probability and statistics, whether for academic purposes or practical decision-making.
