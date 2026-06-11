---
title: 'Bijective Function: Definition & Differences'
description: >-
  Explore bijective functions: what they are, how they differ from injective and
  surjective functions, and their importance in mathematics for competitive
  exams.
tags: []
related:
  - algebraic-function-definition-examples-types
  - even-and-odd-function-definition-graph-properties-and-examples
  - inverse-function-definition-and-examples
  - one-to-one-function-graph-examples-definition
  - onto-function-or-surjective-definition-properties-examples
  - periodic-function-definition-examples-formula-equations
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary definition of a bijective function?
    a: >-
      A bijective function is a function that is both 'one-to-one' (injective)
      and 'onto' (surjective). This means every element in the domain maps to a
      unique element in the codomain, and every element in the codomain has a
      unique pre-image in the domain.
  - q: Why are bijective functions important in competitive exams like JEE Main?
    a: >-
      Bijective functions are a core concept in Class 11 Mathematics,
      particularly in the chapter on sets, relations, and functions. They form
      the basis for many higher-level topics and are frequently tested in
      competitive exams like JEE Main, as evidenced by questions asked by NTA in
      recent years.
  - q: Can a function be one-to-one but not onto?
    a: >-
      Yes, a function can be one-to-one (injective) without being onto
      (surjective). This happens when distinct elements in the domain map to
      distinct elements in the codomain, but there are still some elements in
      the codomain that are not mapped to by any element from the domain.
  - q: Can a function be onto but not one-to-one?
    a: >-
      Yes, a function can be onto (surjective) without being one-to-one
      (injective). This occurs when every element in the codomain is mapped to
      by at least one element from the domain, but some distinct elements in the
      domain map to the same element in the codomain.
  - q: >-
      How do you determine the number of bijective functions between two finite
      sets?
    a: >-
      If a function is bijective between two finite sets, say Set A and Set B,
      then both sets must have the same number of elements. If both sets have
      'm' elements, the number of possible bijective functions between them is
      'm!' (m factorial).
---

# Bijective Function: Definition & Differences

In mathematics, functions describe specific relationships between sets of values. Understanding different types of functions, like bijective functions, is crucial for students pursuing higher education in science, technology, engineering, and mathematics. This concept is a fundamental building block in calculus, physics, and various engineering disciplines.

## Key Takeaways

*   A bijective function is a special type of function that is both 'one-to-one' (injective) and 'onto' (surjective).
*   For a function to be bijective, every element in the first set (domain) must map to a unique element in the second set (codomain), and every element in the codomain must have a corresponding element in the domain.
*   This topic is a key part of Class 11 Mathematics and frequently appears in competitive examinations like JEE Main, with multiple questions asked over the past decade.
*   If two finite sets have the same number of elements, the number of possible bijective functions between them can be calculated using factorials.

## What is a Function?

A function establishes a specific relationship between two non-empty sets, let's call them Set A and Set B. For a relationship to be considered a function, every element 'x' in Set A must be assigned to exactly one unique element, 'f(x)', in Set B. This is commonly written as `f: A → B`, meaning 'f' maps elements from A to B.

### Domain of a Function

The domain refers to all the possible input values (elements of Set A) for which the function `f(x)` is defined and produces a real number output. If a function is defined as `f: A → B`, then all the elements within Set A collectively form the domain of that function.

### Codomain of a Function

When a function is defined as `f: A → B`, Set B is known as the codomain. It represents all the potential output values for the function.

### Range of a Function

The range of a function consists of all the actual output values that the function `f(x)` produces. These are the specific elements in the codomain that are 'hit' by the function. It's also sometimes called the 'image set' of the function.

## Injective Function (One-to-One Function)

An injective function, also known as a one-to-one function, is one where every distinct element in the domain (Set A) maps to a distinct element in the codomain (Set B). In simpler terms, no two different elements from Set A will ever map to the same element in Set B. Each input has a unique output.

## Surjective Function (Onto Function)

A surjective function, or an onto function, is characterized by its range being equal to its codomain. This means that every single element in Set B (the codomain) has at least one corresponding element in Set A (the domain) that maps to it. There are no 'unmapped' elements left in the codomain.

## Understanding Bijective Functions

A function is called a bijective function if it satisfies the conditions for both an injective (one-to-one) function and a surjective (onto) function simultaneously. This means:

1.  **One-to-one:** Every distinct element in the domain maps to a distinct element in the codomain.
2.  **Onto:** Every element in the codomain has at least one pre-image in the domain.

Essentially, a bijective function creates a perfect pairing between the elements of Set A and Set B. Each element in A is paired with exactly one element in B, and each element in B is paired with exactly one element in A. If Set A and Set B are finite and have the same number of elements (let's say 'm' elements each), then the total number of possible bijective functions between them is `m!`, which is 'm' factorial.

### Key Characteristics of a Bijective Mapping:

*   Every element in the domain (Set A) must be paired with one and only one element in the codomain (Set B).
*   Every element in the codomain (Set B) must be paired with one and only one element in the domain (Set A).

## Differences Between Injective, Surjective, and Bijective Functions

Here's a quick comparison of these three important types of functions:

| Feature             | Injective Function (One-to-One)                                  | Surjective Function (Onto)                                         | Bijective Function                                                  |
| :------------------ | :--------------------------------------------------------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Mapping Property** | Distinct inputs map to distinct outputs.                         | Every element in the codomain has a pre-image in the domain.       | Both one-to-one and onto. A perfect, unique pairing.                |
| **Range vs. Codomain** | Range is a subset of the codomain, but not necessarily equal.    | Range is equal to the codomain.                                    | Range is equal to the codomain.                                     |
| **Element Usage**   | Elements in the codomain might not be used.                      | All elements in the codomain must be used.                         | All elements in both sets are used exactly once in the mapping.     |
| **Invertibility**   | Not necessarily invertible unless it's also surjective.          | Not necessarily invertible unless it's also injective.             | Always invertible; an inverse function exists.                      |

Understanding bijective functions is fundamental for advanced mathematical concepts and for tackling challenging problems in competitive exams like JEE Main, as highlighted by NTA's past question trends. Continue practicing these concepts to build a strong foundation for your academic journey.
