---
title: 'Composition of function: Conditions and Properties'
description: >-
  Explore function composition in mathematics: understand conditions for
  combining functions, key properties, and how to determine composite functions
  for JEE.
tags: []
related:
  - even-and-odd-function-definition-graph-properties-and-examples
  - modulus-function-properties-of-modulus-function-overview-structure
  - onto-function-or-surjective-definition-properties-examples
  - algebraic-function-definition-examples-types
  - bijective-function-definition-and-differences
  - differentiation-of-implicit-function-theorem-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What does 'composition of functions' mean?
    a: >-
      Composition of functions means combining two functions where the output of
      one function becomes the input for the other, forming a new, single
      function. It's often denoted by `f(g(x))` or `(f ∘ g)(x)`.
  - q: What is the primary condition for composing two functions?
    a: >-
      For a composition `gof` to exist, the range of the inner function `f` must
      be a subset of the domain of the outer function `g`. This ensures that
      every output from `f` is a valid input for `g`.
  - q: Is function composition commutative?
    a: >-
      No, in general, function composition is not commutative. This means that
      `fog(x)` is usually not equal to `gof(x)`. The order in which functions
      are composed matters significantly.
  - q: What is the symbol used for function composition?
    a: >-
      The symbol used for function composition is `∘`. So, `(f ∘ g)(x)` is read
      as 'f of g of x', meaning `f(g(x))`.
  - q: Why is function composition important for competitive exams like JEE Main?
    a: >-
      Function composition is a fundamental topic that tests conceptual
      understanding of functions. It frequently appears in competitive exams
      such as JEE Main, with numerous questions asked over the past decade,
      making it a high-weightage topic for aspirants.
---

# Composition of function: Conditions and Properties

Composition of functions is a core mathematical concept where two functions are combined to create a new one. Essentially, the output of one function becomes the input for another, allowing us to build more complex relationships from simpler ones.

## Key takeaways

*   A composition of functions, like `gof(x) = g(f(x))`, combines two functions.
*   For composition `gof` to exist, the range of the inner function `f` must be a subset of the domain of the outer function `g`.
*   Function composition is generally not commutative (i.e., `fog ≠ gof`), but it is associative (`fo(goh) = (fog)oh`).
*   This topic is vital for competitive exams like JEE Main, with questions consistently appearing over the last decade.

## What is a Function?

A function establishes a specific kind of relationship between two sets, say set A and set B. For every single element in set A, there must be exactly one corresponding element in set B. If an element in set A has no partner in set B, or if it has more than one partner, then the relationship is not considered a function.

We typically write a function as `f: A → B`, which means 'f maps from A to B'. Here, `f(x)` represents the unique element in B that is assigned to an element `x` from A.

## Understanding Function Composition

When we have two functions, `f: A → B` and `g: B → C`, we can compose them to form a new function, `gof`. This new function maps directly from set A to set C. It's defined as `gof(x) = g(f(x))`. This means you first apply function `f` to `x`, and then you apply function `g` to the result of `f(x)`.

The symbol for composition is `∘`. So, `(f ∘ g)(x)` is another way to write `f(g(x))`. In `f(g(x))`, `g` is considered the 'inner' function because it operates first, and `f` is the 'outer' function.

## Properties of Function Composition

Function composition has several important properties:

*   **Not Commutative**: In most cases, `fog` is not the same as `gof`. The order in which you compose functions usually matters.
*   **Associative**: Composition is associative, meaning `fo(goh) = (fog)oh`. If you have three functions, it doesn't matter how you group them for composition, the final result will be the same.
*   **Bijective Functions**: If both `f` and `g` are bijections (meaning they are both one-to-one and onto), then their compositions `fog` and `gof` will also be bijections.
*   **Identity Function**: Composing any function with an identity function results in the original function itself. If `f: A → B`, then `f ∘ I_A = I_B ∘ f = f`, where `I_A` and `I_B` are identity functions on sets A and B, respectively.

## How to Determine a Composite Function

To find the expression for a composite function like `(f ∘ g)(x)`:

1.  **Substitute**: Replace the variable `x` in the outer function `f` with the entire expression for the inner function `g(x)`.
2.  **Simplify**: Work through the new expression algebraically to simplify it as much as possible.

### Domain of Composite Functions

For `gof` to be defined, a critical condition must be met: the range of the inner function `f` must be a subset of the domain of the outer function `g`. In simpler terms, all the outputs of `f` must be valid inputs for `g`.

If we have `f: A → B` and `g: B → C`, then the composite function `gof` will have a domain of A and a range that is a subset of C.

This foundational concept is covered in Class 11 Mathematics and is particularly significant for higher education entrance exams. For instance, the Joint Entrance Examination (JEE Main) has featured 21 questions on this topic between 2013 and 2023, underscoring its importance for aspirants.
