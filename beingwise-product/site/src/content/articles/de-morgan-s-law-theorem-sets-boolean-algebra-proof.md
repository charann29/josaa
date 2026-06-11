---
title: 'De Morgan''s Law (Theorem) - Sets, Boolean Algebra, Proof'
description: >-
  Explore De Morgan's Laws in set theory and Boolean algebra. Learn formulas,
  proofs, and applications for simplifying expressions effectively.
tags: []
related:
  - law-of-sines-definition-proof-formula-applications-and-example
  - administrative-law-subjects-course-fees-admission-2025-career-options
  - air-and-space-law-course-duration-admission-2025-fees-subjects
  - arbitration-law-subjects-course-fees-admission-2026-career-options
  - banking-law-courses-subjects-colleges-syllabus-scope-fees-eligibility
  - banking-law-subjects-course-fees-admission-2026-career-options
topic: law
rewritten: true
faqs:
  - q: What are De Morgan's Laws?
    a: >-
      De Morgan's Laws are two fundamental rules in mathematics that describe
      how to transform the negation of a conjunction (AND) or a disjunction (OR)
      into a different form. They relate the complement of a union or
      intersection of sets to the intersection or union of their individual
      complements.
  - q: What is the first De Morgan's Law (Law of Union)?
    a: >-
      The first law states that the complement of the union of two sets (A and
      B) is equal to the intersection of their individual complements.
      Mathematically, this is expressed as $(A \cup B)' = A' \cap B'$. This
      means 'not (A or B)' is equivalent to 'not A and not B'.
  - q: What is the second De Morgan's Law (Law of Intersection)?
    a: >-
      The second law states that the complement of the intersection of two sets
      (A and B) is equal to the union of their individual complements.
      Mathematically, this is expressed as $(A \cap B)' = A' \cup B'$. This
      means 'not (A and B)' is equivalent to 'not A or not B'.
  - q: Why are De Morgan's Laws important?
    a: >-
      De Morgan's Laws are crucial for simplifying expressions in set theory,
      Boolean algebra, and logic. They help in designing more efficient digital
      circuits, clarifying logical arguments, and solving problems in
      probability and computer science by allowing complex statements to be
      rewritten in simpler, equivalent forms.
  - q: Can De Morgan's Laws be applied to more than two sets?
    a: >-
      Yes, De Morgan's Laws can be generalized to any finite number of sets. For
      example, for three sets A, B, and C, $(A \cup B \cup C)' = A' \cap B' \cap
      C'$ and $(A \cap B \cap C)' = A' \cup B' \cup C'$. The principle remains
      the same.
  - q: Where can I find resources to practice De Morgan's Laws?
    a: >-
      You can find practice questions and examples on De Morgan's Laws in NCERT
      mathematics textbooks, particularly those covering set theory and logic.
      Many online educational platforms also offer exercises on these topics.
---

# De Morgan's Law (Theorem) - Sets, Boolean Algebra, Proof

De Morgan's Laws are fundamental principles in mathematics that help us understand how negation interacts with logical 'AND' and 'OR' operations, whether in set theory, Boolean algebra, or logic. These laws provide a powerful way to rewrite and simplify complex expressions.

## Key Takeaways

*   De Morgan's Laws establish a clear relationship between set complements, unions, and intersections.
*   They offer two main rules for transforming expressions involving 'NOT (A OR B)' and 'NOT (A AND B)'.
*   These laws are crucial for simplifying logical statements, optimizing digital circuits, and solving problems in set theory.
*   Understanding De Morgan's Laws is essential for various fields, including computer science, mathematics, and engineering.

## Understanding De Morgan's Laws in Sets

In set theory, De Morgan's Laws define how the complement of a set interacts with the union and intersection of other sets. Simply put, they show us how to distribute a 'NOT' operation across a 'UNION' or 'INTERSECTION'. These laws are also applied in Boolean algebra to simplify expressions involving variables and their complements, and in logic to negate compound statements.

According to De Morgan's Laws:

*   The complement of the union of two sets is the same as the intersection of their individual complements.
*   The complement of the intersection of two sets is the same as the union of their individual complements.

## De Morgan's Law Formulas

De Morgan's Laws are expressed through two key formulas that are vital for simplifying expressions in various mathematical contexts.

### First De Morgan's Law: The Law of Union

This law states that if you take the complement of the union of two sets, it is equivalent to finding the intersection of the complements of each individual set. This principle is widely used in problems involving Venn diagrams and in designing logic gate circuits.

For any two sets, A and B, the formula is:

$(A \cup B)' = A' \cap B'$

Here:

*   $\cup$ represents the union of sets (elements in A OR B).
*   $\cap$ represents the intersection of sets (elements in A AND B).
*   $'$ denotes the complement of a set (elements NOT in the set).

This is often referred to as De Morgan's Law of Union.

### Second De Morgan's Law: The Law of Intersection

This law states that the complement of the intersection of two sets is equal to the union of their individual complements. This rule is highly useful for transforming and simplifying logical and mathematical statements that involve negations.

For any two sets, A and B, the formula is:

$(A \cap B)' = A' \cup B'$

Here:

*   $\cap$ represents the intersection of sets.
*   $\cup$ represents the union of sets.
*   $'$ denotes the complement of a set.

This is also known as De Morgan's Law of Intersection.

## Proving De Morgan's Laws in Set Theory

De Morgan's Laws are fundamental identities that can be proven using basic set theory principles. We can demonstrate these laws by showing that elements belonging to one side of the equation also belong to the other side, and vice versa.

### Proof of De Morgan's Law for Union: $(A \cup B)' = A' \cap B'$

To prove this, we need to show two things:

1.  $(A \cup B)' \subseteq A' \cap B'$
2.  $A' \cap B' \subseteq (A \cup B)'$

**Part 1: Showing $(A \cup B)' \subseteq A' \cap B'$**

Let's assume an element $x$ is in $(A \cup B)'$.

*   If $x \in (A \cup B)'$, then $x$ is not in $(A \cup B)$.
*   If $x \notin (A \cup B)$, then $x$ is not in A AND $x$ is not in B.
*   This means $x \in A'$ AND $x \in B'$.
*   Therefore, $x \in A' \cap B'$.
*   So, $(A \cup B)' \subseteq A' \cap B'$.

**Part 2: Showing $A' \cap B' \subseteq (A \cup B)'$**

Now, assume an element $y$ is in $A' \cap B'$.

*   If $y \in A' \cap B'$, then $y \in A'$ AND $y \in B'$.
*   This means $y$ is not in A AND $y$ is not in B.
*   If $y$ is not in A and not in B, then $y$ is not in $(A \cup B)$.
*   Therefore, $y \in (A \cup B)'$.
*   So, $A' \cap B' \subseteq (A \cup B)'$.

Since both parts are true, we conclude that $(A \cup B)' = A' \cap B'$.

### Proof of De Morgan's Law for Intersection: $(A \cap B)' = A' \cup B'$

Similarly, we need to show:

1.  $(A \cap B)' \subseteq A' \cup B'$
2.  $A' \cup B' \subseteq (A \cap B)'$

**Part 1: Showing $(A \cap B)' \subseteq A' \cup B'$**

Assume an element $x$ is in $(A \cap B)'$.

*   If $x \in (A \cap B)'$, then $x$ is not in $(A \cap B)$.
*   If $x \notin (A \cap B)$, then $x$ is not in A OR $x$ is not in B (it cannot be in both).
*   This means $x \in A'$ OR $x \in B'$.
*   Therefore, $x \in A' \cup B'$.
*   So, $(A \cap B)' \subseteq A' \cup B'$.

**Part 2: Showing $A' \cup B' \subseteq (A \cap B)'$**

Now, assume an element $y$ is in $A' \cup B'$.

*   If $y \in A' \cup B'$, then $y \in A'$ OR $y \in B'$.
*   This means $y$ is not in A OR $y$ is not in B.
*   If $y$ is not in A or not in B, then $y$ cannot be in both A and B simultaneously. Thus, $y$ is not in $(A \cap B)$.
*   Therefore, $y \in (A \cap B)'$.
*   So, $A' \cup B' \subseteq (A \cap B)'$.

Since both parts hold, we conclude that $(A \cap B)' = A' \cup B'$.

## Importance of De Morgan's Laws

De Morgan's Laws are incredibly versatile and have significant applications across various disciplines:

*   **Simplifying Boolean Expressions:** In digital electronics and computer science, these laws are used to simplify Boolean algebra expressions, leading to more efficient and cost-effective circuit designs.
*   **Logic and Reasoning:** They provide a systematic way to negate complex logical statements, which is crucial for clear reasoning and problem-solving.
*   **Probability Theory:** In probability, De Morgan's Laws help in calculating the probability of complementary events.
*   **Database Queries:** Understanding these laws can help in formulating more precise and efficient database queries.

Mastering De Morgan's Laws will significantly enhance your ability to tackle problems in set theory, logic, and related mathematical fields.
