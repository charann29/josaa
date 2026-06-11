---
title: 'Properties of Definite Integrals: Definition and Proof'
description: >-
  Explore the definition and core properties of definite integrals, including
  the King's Property, with clear explanations and proofs for students.
tags: []
related:
  - indefinite-integrals-definition-properties-formulas-and-examples
  - circles-in-maths-definition-formulas-properties-and-examples
  - electrons-meaning-definition-properties-faqs
  - even-and-odd-function-definition-graph-properties-and-examples
  - minors-and-cofactors-definition-properties-and-examples
  - modern-periodic-table-modern-periodic-law-definition-examples-properties
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary use of a definite integral?
    a: >-
      The primary use of a definite integral is to calculate the exact area
      under the curve of a function between two specified points on the x-axis.
      It also helps in finding total change, displacement, and volumes.
  - q: >-
      Why is the definite integral zero if the upper and lower limits are the
      same?
    a: >-
      If the upper and lower limits are identical, it means the interval of
      integration has no width. Conceptually, you are calculating the area under
      a curve over a single point, which results in zero area.
  - q: >-
      Does changing the variable of integration affect the definite integral's
      value?
    a: >-
      No, changing the variable of integration (e.g., from x to t or y) does not
      change the value of the definite integral, as long as the function and the
      limits of integration remain the same. This is a fundamental property of
      definite integrals.
  - q: What is the 'King's Property' and why is it important?
    a: >-
      The 'King's Property' states that ∫ab f(x)dx = ∫ab f(a+b-x)dx. It is
      crucial because it often simplifies complex integrals, allowing them to be
      solved more easily, especially in competitive exams.
  - q: Are definite integrals important for competitive exams?
    a: >-
      Yes, definite integrals are a very important topic for competitive exams
      such as JEE Main, BITSAT, and WBJEE. Questions based on their properties
      and applications appear regularly, making a strong understanding essential
      for good scores.
---

# Properties of Definite Integrals: Definition and Proof

Definite integrals are a fundamental concept in calculus, offering a powerful way to measure accumulation and change. They allow us to calculate the area under a curve between two specific points and have wide-ranging applications across mathematics, physics, engineering, economics, and biology.

## Key takeaways

*   Definite integrals calculate the area under a function's curve between a lower and an upper limit.
*   Understanding the properties of definite integrals is crucial for solving complex problems efficiently.
*   The 'King's Property' (Property 4) is particularly important for competitive exams like JEE Main.
*   Definite integrals are a significant topic in Class 12 Mathematics and frequently appear in various entrance examinations.

## What is a Definite Integral?

At its core, a definite integral computes the net area between a function's graph and the x-axis over a specified interval. If we have a function `f(x)` defined on a closed interval `[a, b]`, and `F(x)` is its antiderivative (meaning `d/dx(F(x)) = f(x)`), then the definite integral of `f(x)` from `a` to `b` is given by:

`∫ab f(x)dx = [F(x)]ab = F(b) - F(a)`

Here, `a` is known as the lower limit of integration, and `b` is the upper limit. The result `F(b) - F(a)` represents the exact value of the integral.

## Property 1: Identical Limits

If the lower and upper limits of a definite integral are the same, the value of the integral is zero. This makes intuitive sense because if the interval has no width, there's no area to calculate under the curve.

`∫aa f(x)dx = 0`

**Proof:**

Using the fundamental theorem of calculus, if `d/dx(F(x)) = f(x)`, then:

`∫aa f(x)dx = [F(x)]aa = F(a) - F(a) = 0`

## Property 2: Variable of Integration

The value of a definite integral depends only on the function itself and the integration interval, not on the specific variable used. You can change the variable of integration without altering the integral's result, as long as the limits remain the same.

`∫ab f(x)dx = ∫ab f(t)dt = ∫ab f(y)dy`

**Example:**

`∫02 x²dx = [x³/3]02 = (2³/3) - (0³/3) = 8/3`
`∫02 t²dt = [t³/3]02 = (2³/3) - (0³/3) = 8/3`

## Property 3: Interchanging Limits

If you swap the upper and lower limits of integration, the value of the definite integral changes its sign. The magnitude remains the same, but the direction of integration is reversed.

`∫ab f(x)dx = -∫ba f(x)dx`

**Proof:**

Given `d/dx(F(x)) = f(x)`:

`∫ab f(x)dx = [F(x)]ab = F(b) - F(a)`

And:

`∫ba f(x)dx = [F(x)]ba = F(a) - F(b)`

Notice that `F(a) - F(b)` is simply `-(F(b) - F(a))`. Therefore, `∫ab f(x)dx = -∫ba f(x)dx`.

## Property 4: King's Property

Often referred to as the 'King's Property', this is one of the most useful properties for solving definite integral problems, especially in competitive examinations. It states:

`∫ab f(x)dx = ∫ab f(a+b-x)dx`

**Proof:**

Let's start with the right-hand side (RHS) of the equation: `∫ab f(a+b-x)dx`.

Perform a substitution: Let `t = a + b - x`.

Differentiating with respect to `x`, we get `dt/dx = -1`, which means `dx = -dt`.

Now, we need to change the limits of integration according to our substitution:
*   When `x = a`, then `t = a + b - a = b`.
*   When `x = b`, then `t = a + b - b = a`.

Substitute these into the RHS integral:

RHS = `∫ba f(t)(-dt)`

Using Property 3 (interchanging limits changes the sign):

RHS = `-∫ba f(t)dt = -(-∫ab f(t)dt) = ∫ab f(t)dt`

Since the variable of integration does not affect the value (Property 2), we can replace `t` with `x`:

RHS = `∫ab f(x)dx`

This is equal to the left-hand side (LHS), thus proving the property.

**Corollary of King's Property:**

A common special case of this property, often used when the lower limit is zero, is:

`∫0a f(x)dx = ∫0a f(a-x)dx`

Understanding and applying these properties can significantly simplify the process of evaluating definite integrals, a skill that is frequently tested in exams like JEE Main, where questions on this topic have appeared consistently, as noted by NTA's past exam patterns.
