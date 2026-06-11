---
title: 'Differentiation in Calculus (Derivative Rules, Formulas'
description: >-
  Explore differentiation in calculus, including its definition, key rules like
  Power, Product, and Chain Rules, and essential formulas for Class 12 students.
tags: []
related:
  - differentiation-of-implicit-function-theorem-and-examples
  - derivative-of-inverse-trigonometric-functions
  - cross-product-definition-formula-rules-and-examples
  - electron-configuration-meaning-definition-rules-table-faqs
  - functions-transformations-graphing-rules-tricks
  - rules-and-regulations-for-girls-to-go-out
topic: study-guides
rewritten: true
faqs:
  - q: What is the main purpose of differentiation in calculus?
    a: >-
      The main purpose of differentiation is to find the instantaneous rate of
      change of a function. This means determining how quickly a function's
      output changes with respect to its input at a specific point, which is
      also represented by the slope of the tangent line to the function's graph.
  - q: How is the derivative different from average rate of change?
    a: >-
      The average rate of change measures the change in a function over an
      interval, like average speed during a trip. The derivative, however,
      measures the instantaneous rate of change at a single point, similar to
      the exact speed shown on a speedometer at a particular moment.
  - q: >-
      Are differentiation rules like the Product Rule and Chain Rule important
      for JEE?
    a: >-
      Yes, differentiation rules such as the Product Rule, Quotient Rule, and
      especially the Chain Rule are critically important for competitive exams
      like JEE and CUET. A strong grasp of these rules is fundamental for
      solving complex calculus problems that frequently appear in these tests.
  - q: What is the Power Rule in differentiation?
    a: >-
      The Power Rule is a basic differentiation rule for functions of the form
      `xⁿ`. It states that the derivative of `xⁿ` is `n*xⁿ⁻¹`. For example, the
      derivative of `x³` is `3x²`.
  - q: Can I find NCERT resources for differentiation?
    a: >-
      Yes, NCERT textbooks for Class 12 Mathematics are an official and
      excellent resource for understanding differentiation, including
      definitions, rules, formulas, and practice problems. They are designed to
      build a strong foundational understanding for students.
  - q: What are the different notations for a derivative?
    a: >-
      Common notations for a derivative include `f'(x)`, `dy/dx`, `y'`, `d/dx
      [f(x)]`, `Dₓ[y]`, `Dy`, and `y₁`. Each of these represents the same
      concept of the derivative of a function.
---

# Differentiation in Calculus (Derivative Rules, Formulas)

Differentiation is a fundamental concept in calculus that helps us understand how things change. It allows us to find the exact rate of change of a function at any given moment, rather than just an average over a period.

## Key Takeaways

*   Differentiation calculates the instantaneous rate of change of a function, which can be visualized as the slope of a curve at a specific point.
*   The process involves finding the derivative, often using a limit definition to define this rate of change precisely.
*   Mastering differentiation rules like the Power, Sum, Difference, Product, Quotient, and Chain Rules is crucial for Class 12 board exams and competitive tests like JEE and CUET.
*   Understanding different notations for derivatives is important for interpreting and solving calculus problems.

## What is Differentiation?

At its core, differentiation is the mathematical method for determining the derivative of a function. Think of it as finding the precise speed of an object at a particular instant, not its average speed over a journey. Mathematically, if you have a function `f(x)`, its derivative at a point `x₀` is defined by a limit:

`f'(x₀) = lim (Δx → 0) [f(x₀ + Δx) - f(x₀)] / Δx`

This formula essentially measures the change in `f(x)` (`Δy`) divided by a very small change in `x` (`Δx`), as `Δx` approaches zero. When this limit exists, the function `f` is considered differentiable at `x₀`. For all `x` where this limit exists, we get a new function, `f'(x)`, which is the derivative of `f(x)`.

This derivative `f'(x)` provides the instantaneous rate of change of `f(x)` with respect to `x`. It also represents the slope of the tangent line to the graph of `y = f(x)` at any point `x`.

Derivatives can be expressed in various notations, all meaning the same thing:

*   `f'(x)`
*   `dy/dx`
*   `y'`
*   `d/dx [f(x)]`
*   `Dₓ[y]`
*   `Dy`
*   `y₁`

Here, `d/dx` or `D` acts as the differential operator, indicating that we are taking the derivative with respect to `x`.

## Essential Rules of Differentiation

To effectively differentiate various functions, a set of rules has been developed. These are indispensable for Class 12 students preparing for exams. Let `f(x)` and `g(x)` be differentiable functions, and let `k` be a constant. The key rules are:

### Sum and Difference Rules

These rules simplify differentiation when functions are added or subtracted:

*   **Sum Rule:** The derivative of a sum of functions is the sum of their individual derivatives.
    `d/dx [f(x) + g(x)] = d/dx [f(x)] + d/dx [g(x)]`

*   **Difference Rule:** Similarly, the derivative of a difference of functions is the difference of their individual derivatives.
    `d/dx [f(x) - g(x)] = d/dx [f(x)] - d/dx [g(x)]`

### Constant Multiple Rule

If a function is multiplied by a constant, the constant remains outside the differentiation process:

*   `d/dx [k * f(x)] = k * d/dx [f(x)]`

### Product Rule

When two functions are multiplied together, their derivative is found using the Product Rule:

*   `d/dx [f(x) * g(x)] = f(x) * d/dx [g(x)] + g(x) * d/dx [f(x)]`

For three functions, say `k(x) = f(x) * g(x) * h(x)`, the rule extends to:

*   `k'(x) = f'(x) * g(x) * h(x) + f(x) * g'(x) * h(x) + f(x) * g(x) * h'(x)`

### Quotient Rule

For functions that are divided, the Quotient Rule is applied:

*   `d/dx [f(x) / g(x)] = [g(x) * d/dx [f(x)] - f(x) * d/dx [g(x)]] / [g(x)]²`

It's important to remember that the derivative of a quotient is not simply the quotient of the derivatives.

### Chain Rule

The Chain Rule is used for differentiating composite functions (functions within functions). If `y = f(u)` and `u = g(x)`, then:

*   `dy/dx = dy/du * du/dx`

This rule is incredibly versatile and applies when one function's output serves as the input for another function.

## Important Differentiation Formulas List

Beyond the rules, there are specific formulas for common types of functions:

| Function `f(x)` | Derivative `f'(x)` |
| :-------------- | :------------------ |
| `c` (constant)  | `0`                 |
| `xⁿ`            | `n*xⁿ⁻¹`            |
| `eˣ`            | `eˣ`                |
| `aˣ`            | `aˣ * ln(a)`        |
| `ln|x|`         | `1/x`               |
| `logₐ|x|`       | `1/(x * ln(a))`     |
| `sin(x)`        | `cos(x)`            |
| `cos(x)`        | `-sin(x)`           |
| `tan(x)`        | `sec²(x)`           |
| `cot(x)`        | `-cosec²(x)`        |
| `sec(x)`        | `sec(x)tan(x)`      |
| `cosec(x)`      | `-cosec(x)cot(x)`   |
| `sin⁻¹(x)`      | `1/√(1-x²)`         |
| `cos⁻¹(x)`      | `-1/√(1-x²)`        |
| `tan⁻¹(x)`      | `1/(1+x²)`          |

## Solved Examples Based on Rules of Differentiation

Let's apply these rules with a few examples:

**Example 1: Using the Power Rule and Constant Multiple Rule**

Find the derivative of `y = 5x³`.

Applying the Constant Multiple Rule and Power Rule:
`dy/dx = 5 * d/dx (x³)`
`dy/dx = 5 * (3x³⁻¹)`
`dy/dx = 15x²`

**Example 2: Using the Sum and Difference Rules**

Find the derivative of `f(x) = 4x² + sin(x) - 7`.

Applying the Sum and Difference Rules:
`f'(x) = d/dx (4x²) + d/dx (sin(x)) - d/dx (7)`
`f'(x) = 4 * (2x¹) + cos(x) - 0`
`f'(x) = 8x + cos(x)`

**Example 3: Using the Product Rule**

Find the derivative of `y = x² * eˣ`.

Let `f(x) = x²` and `g(x) = eˣ`. Then `f'(x) = 2x` and `g'(x) = eˣ`.
Using the Product Rule `f(x)g'(x) + g(x)f'(x)`:
`dy/dx = x² * eˣ + eˣ * 2x`
`dy/dx = x * eˣ * (x + 2)`

**Example 4: Using the Quotient Rule**

Find the derivative of `h(x) = sin(x) / x`.

Let `f(x) = sin(x)` and `g(x) = x`. Then `f'(x) = cos(x)` and `g'(x) = 1`.
Using the Quotient Rule `[g(x)f'(x) - f(x)g'(x)] / [g(x)]²`:
`h'(x) = [x * cos(x) - sin(x) * 1] / x²`
`h'(x) = (x cos(x) - sin(x)) / x²`

**Example 5: Using the Chain Rule**

Find the derivative of `y = sin(x²)`.

Let `u = x²`, so `y = sin(u)`. Then `dy/du = cos(u)` and `du/dx = 2x`.
Using the Chain Rule `dy/dx = dy/du * du/dx`:
`dy/dx = cos(u) * 2x`
Substitute `u` back:
`dy/dx = cos(x²) * 2x`
`dy/dx = 2x cos(x²)`

Mastering these concepts and rules is key to excelling in calculus and its applications in various fields of science and engineering.
