---
title: Total Probability Theorem and Bayes' Theorem
description: >-
  Explore the Total Probability Theorem and Bayes' Theorem with BeingWise. Learn
  how these fundamental concepts help calculate and update probabilities in
  complex scen
tags: []
related:
  - cat-2025-result-out-iimcat-ac-in-check-overall-and-sectional-cutoff
  - cat-exam-pattern-2026-sectional-time-limit-marking-scheme-and-total-marks
  - cmat-exam-pattern-2026-check-total-marks-marking-scheme-paper-pattern
  - ibsat-exam-pattern-2026-marking-scheme-total-marks-and-exam-duration
  - mat-exam-pattern-2026-latest-total-marks-sections-and-marking-scheme
  - out-of-600-i-got-488-and-total-802-ts-eamcet-14k-any-chance-in-bpt-st-cat
topic: study-guides
rewritten: true
faqs:
  - q: >-
      What is the main difference between the Total Probability Theorem and
      Bayes' Theorem?
    a: >-
      The Total Probability Theorem helps calculate the overall probability of
      an event when it can occur through several mutually exclusive scenarios.
      Bayes' Theorem, on the other hand, helps determine the probability of a
      specific scenario or cause, given that an event has already occurred. It's
      about updating our beliefs based on new evidence.
  - q: When should I use the Total Probability Theorem?
    a: >-
      You should use the Total Probability Theorem when you need to find the
      unconditional probability of an event 'A', and you know the conditional
      probabilities of 'A' given various mutually exclusive and exhaustive prior
      events ($A_i$), along with the probabilities of those prior events
      themselves.
  - q: When is Bayes' Theorem most useful in real life?
    a: >-
      Bayes' Theorem is incredibly useful in situations where you want to update
      your belief about a hypothesis based on new data. Examples include medical
      diagnostics (probability of a disease given a positive test), spam
      filtering (probability an email is spam given certain keywords), and even
      in legal proceedings.
  - q: Are these theorems part of the JEE Main or Advanced syllabus?
    a: >-
      Yes, concepts related to probability, including conditional probability,
      the Total Probability Theorem, and Bayes' Theorem, are an important part
      of the mathematics syllabus for competitive exams like JEE Main and JEE
      Advanced, as outlined by NTA.
  - q: What are 'mutually exclusive and exhaustive events'?
    a: >-
      Mutually exclusive events are those that cannot happen at the same time
      (e.g., flipping a coin results in either heads OR tails, not both).
      Exhaustive events mean that the set of all possible events covers every
      outcome (e.g., heads and tails are exhaustive outcomes for a coin flip).
      These conditions are crucial for applying both theorems correctly.
---

# Total Probability Theorem and Bayes' Theorem

Probability is a fascinating branch of mathematics that helps us understand the likelihood of different events occurring. It's a powerful tool for making predictions and informed decisions in various real-world scenarios. Within probability, two foundational concepts, the Total Probability Theorem and Bayes' Theorem, are particularly useful for analyzing complex situations involving multiple events.

## Key takeaways

*   The Total Probability Theorem helps calculate the overall probability of an event when there are several possible preceding conditions.
*   Bayes' Theorem allows us to update our beliefs about the probability of an event based on new evidence or information.
*   Both theorems are crucial for conditional probability, where the likelihood of one event depends on another.
*   Understanding these concepts is vital for fields like data science, artificial intelligence, and risk assessment.

## Understanding the Theorem of Total Probability

Imagine you want to find the probability of a specific event happening, but this event can occur under several different circumstances. The Total Probability Theorem provides a systematic way to calculate this overall probability.

Let's say we have a set of distinct situations, $A_1, A_2, \ldots, A_n$, which cover all possibilities and cannot happen at the same time. Each of these situations has a non-zero chance of occurring. Now, let 'A' be the event we are interested in. The Total Probability Theorem states that the probability of event 'A' can be found by summing up the probabilities of 'A' happening within each of those situations, weighted by the probability of each situation itself.

Mathematically, it looks like this:

$P(A) = P(A_1)P(A|A_1) + P(A_2)P(A|A_2) + \ldots + P(A_n)P(A|A_n)$

In simpler terms, $P(A|A_i)$ means "the probability of event A happening, given that situation $A_i$ has already occurred." We multiply this conditional probability by the probability of situation $A_i$ itself, and then add these products for all possible situations.

### A Simple Illustration

Consider three bags, each containing marbles. 
*   Bag 1 has 6 red and 4 blue marbles.
*   Bag 2 has 5 red and 5 blue marbles.
*   Bag 3 has 2 red and 8 blue marbles.

If you randomly choose one of the bags and then randomly draw a marble from it, what is the probability of drawing a red marble?

Here, the 'situations' are choosing Bag 1, Bag 2, or Bag 3. Since there are three bags and you choose one randomly, the probability of choosing any specific bag is $1/3$.

*   $P(\text{Bag 1}) = 1/3$
*   $P(\text{Bag 2}) = 1/3$
*   $P(\text{Bag 3}) = 1/3$

Now, let 'R' be the event of drawing a red marble. The conditional probabilities are:

*   $P(R|\text{Bag 1}) = 6/10$ (6 red out of 10 in Bag 1)
*   $P(R|\text{Bag 2}) = 5/10$ (5 red out of 10 in Bag 2)
*   $P(R|\text{Bag 3}) = 2/10$ (2 red out of 10 in Bag 3)

Using the Total Probability Theorem:

$P(R) = P(\text{Bag 1})P(R|\text{Bag 1}) + P(\text{Bag 2})P(R|\text{Bag 2}) + P(\text{Bag 3})P(R|\text{Bag 3})$

$P(R) = (1/3)(6/10) + (1/3)(5/10) + (1/3)(2/10)$

$P(R) = 6/30 + 5/30 + 2/30 = 13/30$

So, the probability of drawing a red marble is 13/30.

## Demystifying Bayes' Theorem

Bayes' Theorem takes conditional probability a step further. While the Total Probability Theorem helps us find the probability of an event (A) given various conditions ($A_i$), Bayes' Theorem allows us to reverse this. It helps us find the probability of a specific condition ($A_i$) being true, given that event 'A' has already occurred.

This is incredibly powerful because it allows us to update our initial beliefs (prior probabilities) about a situation based on new evidence. It's often used in diagnostic testing, spam filtering, and even in artificial intelligence to make decisions.

The formula for Bayes' Theorem is:

$P(A_i|A) = \frac{P(A_i)P(A|A_i)}{\sum_{j=1}^n P(A_j)P(A|A_j)}$

Notice that the denominator in Bayes' Theorem is precisely the Total Probability of event 'A', which we just discussed. This means Bayes' Theorem essentially tells us: "The probability of condition $A_i$ given event A, is proportional to the probability of condition $A_i$ multiplied by the probability of A given $A_i$, scaled by the total probability of A."

### Applying Bayes' Theorem

Let's use our marble example again. Suppose you've already drawn a red marble. Now, what is the probability that it came from Bag 1?

We want to find $P(\text{Bag 1}|R)$. Using Bayes' Theorem:

$P(\text{Bag 1}|R) = \frac{P(\text{Bag 1})P(R|\text{Bag 1})}{P(R)}$

We already calculated $P(R) = 13/30$ using the Total Probability Theorem.

$P(\text{Bag 1}|R) = \frac{(1/3)(6/10)}{13/30}$

$P(\text{Bag 1}|R) = \frac{6/30}{13/30} = 6/13$

So, if you draw a red marble, there's a 6/13 chance it came from Bag 1. Similarly, we could find the probability it came from Bag 2 or Bag 3 given that a red marble was drawn.

These theorems are fundamental tools for anyone delving into the world of probability and statistics, offering clear pathways to analyze and understand uncertain events.
