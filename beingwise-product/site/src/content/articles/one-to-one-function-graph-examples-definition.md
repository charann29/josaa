---
title: 'One to One Function - Graph, Examples, Definition'
description: >-
  Explore one-to-one functions: definition, algebraic and graphical
  identification (horizontal line test), examples, and their importance in exams
  like JEE Main.
tags: []
related:
  - even-and-odd-function-definition-graph-properties-and-examples
  - algebraic-function-definition-examples-types
  - inverse-function-definition-and-examples
  - onto-function-or-surjective-definition-properties-examples
  - periodic-function-definition-examples-formula-equations
  - piecewise-function-definition-evaluation-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is the definition of a one-to-one function?
    a: >-
      A one-to-one function, or injective function, is a mathematical relation
      where each distinct element in the domain maps to a unique element in the
      codomain. This means no two different inputs will produce the same output.
  - q: How can I algebraically check if a function is one-to-one?
    a: >-
      To check algebraically, assume that `f(x1) = f(x2)` for any `x1` and `x2`
      in the domain. If this assumption logically leads to `x1 = x2`, then the
      function is one-to-one. If it leads to `x1 ≠ x2` or other possibilities,
      it's not.
  - q: What is the horizontal line test for one-to-one functions?
    a: >-
      The horizontal line test is a graphical method. If any horizontal line
      intersects the graph of a function at more than one point, the function is
      not one-to-one. If every horizontal line intersects the graph at most
      once, then it is a one-to-one function.
  - q: Can a parabola be a one-to-one function?
    a: >-
      No, a standard parabola like `f(x) = x^2` is not a one-to-one function
      over its entire domain. For example, both `x = -2` and `x = 2` map to `y =
      4`. It fails the horizontal line test because a horizontal line can
      intersect it at two points.
  - q: Why are one-to-one functions important for inverse functions?
    a: >-
      A function must be one-to-one to have a well-defined inverse function. If
      a function is not one-to-one, multiple inputs would map to the same
      output, making it impossible for the inverse to uniquely map that output
      back to a single original input.
  - q: Is the concept of one-to-one functions tested in competitive exams?
    a: >-
      Yes, this concept is frequently tested in competitive exams like JEE Main,
      SRMJEE, BITSAT, and WBJEE. Official NTA data from past JEE Main exams
      shows questions on this topic have appeared in recent years.
---

# One to One Function - Graph, Examples, Definition

A one-to-one function, also known as an injective function, is a fundamental concept in mathematics where each input from its domain maps to a unique output in its codomain. Understanding these functions is essential for various mathematical fields, including algebra and calculus, and is frequently tested in competitive exams.

## Key Takeaways

*   A one-to-one function ensures that every distinct input produces a distinct output.
*   It can be identified algebraically by proving that if `f(x1) = f(x2)`, then `x1` must equal `x2`.
*   Graphically, the horizontal line test is a quick way to determine if a function is one-to-one; if any horizontal line crosses the graph more than once, it's not one-to-one.
*   This concept is important for exams like JEE Main, with questions appearing in recent years, as noted by NTA's past exam patterns.

## What is a One-to-One Function?

In mathematics, a function establishes a relationship where every element in a starting set (the domain) is associated with exactly one element in an ending set (the codomain). A one-to-one function adds a specific condition: no two different elements from the domain can map to the same element in the codomain. Simply put, each input has its own unique output.

### Definition of a One-to-One Function

Formally, a function `f: X → Y` is called one-to-one (or injective) if for any two distinct elements `x1` and `x2` in set `X`, their images `f(x1)` and `f(x2)` in set `Y` are also distinct. Conversely, if `f(x1) = f(x2)`, then it must imply that `x1 = x2`.

For example, consider a function `f(x) = x` where the domain `X = {-2, 2, 4, 6}` and the codomain `Y = {-2, 2, 4, 6}`. Here, each element in `X` maps to a distinct element in `Y` (e.g., -2 maps to -2, 2 maps to 2, etc.), making it a one-to-one function.

## How to Identify a One-to-One Function

There are two primary methods to determine if a function is one-to-one: an algebraic test and a graphical test.

### Algebraic Test

To algebraically verify if a function `f(x)` is one-to-one, you assume that `f(x1) = f(x2)` for any two elements `x1` and `x2` in the domain. If this assumption logically leads to `x1 = x2`, then the function is one-to-one.

**Example:** Let's test `f(x) = 2x + 3`.

1.  Assume `f(x1) = f(x2)`.
2.  This means `2x1 + 3 = 2x2 + 3`.
3.  Subtract 3 from both sides: `2x1 = 2x2`.
4.  Divide by 2: `x1 = x2`.

Since `f(x1) = f(x2)` implies `x1 = x2`, the function `f(x) = 2x + 3` is indeed one-to-one.

### Horizontal Line Test (Graphical Method)

The horizontal line test is a simple visual method to check for injectivity using a function's graph. To apply it:

1.  Draw the graph of the function.
2.  Draw several horizontal lines across the graph.
3.  If *any* horizontal line intersects the graph at more than one point, the function is *not* one-to-one.
4.  If *every* horizontal line intersects the graph at most once (meaning zero or one time), then the function *is* one-to-one.

For instance, the graph of `f(x) = x^2` (a parabola) fails the horizontal line test because a horizontal line like `y = 4` would intersect it at `x = -2` and `x = 2`. Therefore, `f(x) = x^2` is not a one-to-one function over its standard domain.

## One-to-One vs. Many-One Functions

It's helpful to distinguish one-to-one functions from many-one functions. In a many-one function, two or more different elements from the domain can map to the same element in the codomain. The classic example is `f(x) = x^2`, where `f(-2) = 4` and `f(2) = 4`. Here, two distinct inputs (-2 and 2) lead to the same output (4), making it a many-one function.

## Inverse of One-to-One Functions

A significant property of one-to-one functions is that they always have an inverse function. If a function `f` is one-to-one, then its inverse `f⁻¹` exists. The inverse function essentially reverses the mapping: if `f(x) = y`, then `f⁻¹(y) = x`. This is possible only if `f` is one-to-one, because each output `y` must correspond to a unique input `x` for the inverse to be well-defined.

Understanding one-to-one functions is a stepping stone to mastering more advanced mathematical concepts and performing well in competitive examinations like JEE Main, SRMJEE, BITSAT, and WBJEE, where these topics are frequently assessed.
