---
title: 'Onto Function or Surjective: Definition, Properties, Examples'
description: >-
  Explore onto functions (surjective functions) in mathematics. Learn
  definitions, key properties, how to identify them, and methods to count them
  for exams.
tags: []
related:
  - even-and-odd-function-definition-graph-properties-and-examples
  - algebraic-function-definition-examples-types
  - inverse-function-definition-and-examples
  - one-to-one-function-graph-examples-definition
  - periodic-function-definition-examples-formula-equations
  - piecewise-function-definition-evaluation-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary characteristic of an onto function?
    a: >-
      The primary characteristic of an onto function is that every element in
      its co-domain must be mapped to by at least one element from its domain.
      This means the range of the function is identical to its co-domain.
  - q: >-
      Can a function be onto if the domain has fewer elements than the
      co-domain?
    a: >-
      No, if the domain has fewer elements than the co-domain, it is impossible
      for every element in the co-domain to have a pre-image. Therefore, an onto
      function cannot exist in such a case.
  - q: How is an onto function different from a one-to-one function?
    a: >-
      An onto function (surjective) ensures that all possible output values in
      the co-domain are hit. A one-to-one function (injective) ensures that each
      distinct input value maps to a distinct output value, meaning no two
      different inputs share the same output. A function that is both one-to-one
      and onto is called a bijective function.
  - q: Why is understanding onto functions important for JEE Main?
    a: >-
      Onto functions are a core topic within 'Relations and Functions' in Class
      12 Mathematics, which is a high-weightage chapter for JEE Main. Questions
      on this concept have appeared in recent JEE Main exams, making it
      essential for strong preparation.
  - q: What is the 'range' and 'co-domain' in the context of onto functions?
    a: >-
      The co-domain is the set of all *possible* output values for a function.
      The range is the set of all *actual* output values that the function
      produces. For an onto function, the range must be exactly equal to the
      co-domain.
---

Functions are a fundamental concept in mathematics, describing how one set of values relates to another. Among the various types, an 'onto' function, also known as a surjective function, plays a crucial role by ensuring every possible output value is actually achieved.

## Key Takeaways

*   An onto function maps every element in its co-domain to at least one element in its domain.
*   For a function to be onto, its range must be identical to its co-domain.
*   If the number of elements in the domain is less than the number of elements in the co-domain, an onto function is not possible.
*   Understanding onto functions is vital for Class 12 mathematics and competitive entrance exams like JEE Main.

## What is an Onto Function?

A function $f: X \rightarrow Y$ is defined as onto (or surjective) if, for every element $y$ in the set $Y$ (the co-domain), there is at least one corresponding element $x$ in the set $X$ (the domain) such that $f(x) = y$. In simpler terms, this means that every element in the co-domain `Y` has at least one 'pre-image' in the domain `X`.

Consider an example where `X` = {x₁, x₂, x₃, x₄} and `Y` = {y₁, y₂, y₃}. If a function `f` maps elements from `X` to `Y` such that:

*   f(x₁) = y₁
*   f(x₂) = y₂
*   f(x₃) = y₃
*   f(x₄) = y₁

Here, every element in `Y` (y₁, y₂, y₃) has at least one corresponding element in `X`. Therefore, this function is an onto function. A key indicator for an onto function is that its range (the set of all actual output values) is equal to its co-domain (the set of all possible output values).

## Properties of Onto Functions

Onto functions possess distinct characteristics that set them apart:

*   **Complete Coverage**: Every single element in the co-domain `Y` must be the image of at least one element from the domain `X`. No element in `Y` is left unmapped.
*   **Range Equals Co-domain**: The set of all output values (the range) produced by the function must be exactly the same as the co-domain. If there's any element in the co-domain that isn't an output, the function isn't onto.
*   **Right Inverse**: An onto function allows for a 'right inverse'. This means there exists another function, say `g: Y \rightarrow X`, such that applying `f` then `g` (i.e., `f(g(y))`) returns `y` for every `y` in `Y`.

## Calculating the Number of Onto Functions

Determining the total count of onto functions between two sets depends on the number of elements in each set. Let's say set `A` has `m` elements, and set `B` has `n` elements. We're looking for functions $f: A \rightarrow B$.

*   **Case 1: `m < n`**
    If the domain `A` has fewer elements than the co-domain `B`, it's impossible for every element in `B` to have a pre-image in `A`. In this scenario, the number of onto functions is **0**.

*   **Case 2: `m = n`**
    If both sets have the same number of elements, the number of onto functions is simply `m!` (m factorial).

*   **Case 3: `m > n`**
    When the domain `A` has more elements than the co-domain `B`, the number of onto functions can be calculated using the formula:

    $\sum_{r=1}^{n}(-1)^{n-r} \binom{n}{r} r^m$

    This can also be written as:

    $n^m - \binom{n}{1}(n-1)^m + \binom{n}{2}(n-2)^m - \dots + (-1)^{n-1}\binom{n}{n-1} 1^m$

    **Example**: If set `A` has `m` elements and set `B` has `2` elements, the total number of functions from `A` to `B` is $2^m$. However, two of these functions are not onto: one where all elements map to the first element of `B`, and another where all elements map to the second element of `B`. Therefore, the number of onto functions is $2^m - 2$.

## Onto Functions and Competitive Exams

The concept of onto functions is a significant part of the 'Relations and Functions' chapter in Class 12 Mathematics. It is frequently tested in competitive examinations like JEE Main. For instance, according to an analysis of past papers, JEE Main has included questions on onto functions in 2013, 2015, 2019, 2022, and 2023, highlighting its importance for aspiring engineering students.

Understanding onto functions is a crucial step towards mastering the broader topic of functions, which forms a bedrock for advanced mathematical concepts.
