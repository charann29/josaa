---
title: 'Left-Hand and Right-Hand Limits: Definition, Formula, Examples, Calculator'
description: >-
  Explore left-hand and right-hand limits in calculus: definitions, formulas,
  and examples. Learn how LHL and RHL determine if a function's limit exists.
tags: []
related:
  - limits-definition-equation-formula-examples-calculator
  - linear-differential-equation-definition-formula-examples-calculator
  - union-of-sets-definition-equation-formula-examples-calculator
  - universal-set-definition-equation-formula-examples-calculator
  - cross-product-definition-formula-rules-and-examples
  - functions-image-and-pre-image-definition-calculator-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is a left-hand limit?
    a: >-
      A left-hand limit (LHL) is the value a function approaches as its input
      variable gets closer to a specific point from values smaller than that
      point. It's denoted as $\lim_{x \to a^-} f(x)$.
  - q: What is a right-hand limit?
    a: >-
      A right-hand limit (RHL) is the value a function approaches as its input
      variable gets closer to a specific point from values larger than that
      point. It's denoted as $\lim_{x \to a^+} f(x)$.
  - q: When does a general limit exist at a point?
    a: >-
      A general limit of a function $f(x)$ at a point $x=a$ exists if and only
      if both the left-hand limit and the right-hand limit at $x=a$ exist and
      are equal to each other.
  - q: Why are one-sided limits important?
    a: >-
      One-sided limits are crucial for understanding the behavior of functions
      near points of discontinuity, especially for piecewise functions. They
      help determine if a function is continuous at a specific point or if
      there's a 'jump' or 'gap'.
  - q: Can I use a calculator for left-hand and right-hand limits?
    a: >-
      While a calculator can help evaluate function values for inputs very close
      to a point, understanding the algebraic methods and graphical
      interpretation is essential. Some advanced graphing calculators might show
      behavior near a point, but they don't directly 'calculate' the limit in a
      formal sense.
---

# Left-Hand and Right-Hand Limits: Definition, Formula, Examples, Calculator

In mathematics, especially calculus, understanding how a function behaves as it gets very close to a specific point is crucial. Left-hand limits (LHL) and right-hand limits (RHL) provide a way to examine this behavior by approaching the point from different directions.

## Key Takeaways

*   Left-hand limits (LHL) describe a function's behavior as it approaches a point from values smaller than that point.
*   Right-hand limits (RHL) describe a function's behavior as it approaches a point from values larger than that point.
*   For a general limit to exist at a point, the LHL and RHL at that point must be equal.
*   These concepts are fundamental for analyzing continuity and understanding functions with sudden changes, like piecewise functions.

## What Are One-Sided Limits?

When we talk about the limit of a function, we're asking what value the function's output, $f(x)$, gets closer and closer to as its input, $x$, approaches a certain value. One-sided limits refine this by specifying the direction of approach.

### Left-Hand Limit (LHL)

The left-hand limit is the value that $f(x)$ approaches as $x$ gets closer to a specific point, let's call it 'a', from values that are *less than* 'a'. Think of it as approaching 'a' from the left side on a number line.

Mathematically, the left-hand limit is written as:

$$\lim_{x \to a^-} f(x) = L$$ 

Here, $a^-$ indicates that $x$ is approaching 'a' from the negative side, or from values marginally smaller than 'a'. If the function approaches a value $L$, then $L$ is the left-hand limit.

### Right-Hand Limit (RHL)

The right-hand limit is the value that $f(x)$ approaches as $x$ gets closer to 'a' from values that are *greater than* 'a'. This is like approaching 'a' from the right side on a number line.

Mathematically, the right-hand limit is written as:

$$\lim_{x \to a^+} f(x) = R$$ 

Here, $a^+$ indicates that $x$ is approaching 'a' from the positive side, or from values marginally larger than 'a'. If the function approaches a value $R$, then $R$ is the right-hand limit.

## When Does a General Limit Exist?

For the overall limit of a function $f(x)$ at a point $x=a$ to exist, a very important condition must be met: the left-hand limit and the right-hand limit at that point must be equal. If they are not equal, the general limit does not exist, and the function is said to have a discontinuity at that point.

**Condition for Limit Existence:**

$$\lim_{x \to a} f(x) \text{ exists if and only if } \lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x)$$ 

If this condition holds, then the limit of $f(x)$ as $x$ approaches $a$ is equal to this common value.

## How to Calculate Left-Hand and Right-Hand Limits

Calculating one-sided limits often involves similar techniques to calculating general limits, but with careful attention to the direction of approach. Here's a general approach:

1.  **Substitute a Value Close to 'a':** For an LHL, pick a value slightly less than 'a' (e.g., $a - 0.001$). For an RHL, pick a value slightly greater than 'a' (e.g., $a + 0.001$).
2.  **Simplify the Function:** If direct substitution leads to an indeterminate form (like $0/0$), try to simplify the function by factoring, rationalizing, or using algebraic manipulation.
3.  **Evaluate the Limit:** After simplification, substitute 'a' into the modified function. The resulting value is your one-sided limit.

### Example

Consider a function defined as:

$f(x) = \begin{cases} x+2 & \text{if } x < 3 \\ x-1 & \text{if } x \ge 3 \end{cases}$

Let's find the LHL and RHL as $x$ approaches 3.

*   **Left-Hand Limit (LHL) at $x=3$:**
    Since we are approaching from values less than 3, we use the first part of the function: $f(x) = x+2$.
    $$\lim_{x \to 3^-} (x+2) = 3+2 = 5$$ 

*   **Right-Hand Limit (RHL) at $x=3$:**
    Since we are approaching from values greater than or equal to 3, we use the second part of the function: $f(x) = x-1$.
    $$\lim_{x \to 3^+} (x-1) = 3-1 = 2$$ 

In this example, the LHL (5) is not equal to the RHL (2). Therefore, the general limit of $f(x)$ as $x$ approaches 3 does not exist.

## Understanding Limits Using Graphs

Visualizing limits on a graph can make these concepts much clearer. When you look at a graph of a function $f(x)$:

*   **For the LHL at $x=a$:** Trace the graph with your finger from left to right, stopping just before $x=a$. The y-value your finger is approaching is the LHL.
*   **For the RHL at $x=a$:** Trace the graph with your finger from right to left, stopping just after $x=a$. The y-value your finger is approaching is the RHL.

If the graph 'meets' at $x=a$ from both sides, meaning your finger ends up at the same y-value whether you come from the left or the right, then the LHL and RHL are equal, and the general limit exists.

Understanding left-hand and right-hand limits is a stepping stone to mastering continuity, derivatives, and integrals in higher mathematics.
