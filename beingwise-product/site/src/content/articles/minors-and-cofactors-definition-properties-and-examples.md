---
title: 'Minors And Cofactors: Definition, Properties and Examples'
description: >-
  Explore minors and cofactors in matrices: their definitions, how to calculate
  them, and their importance in finding determinants and matrix inverses.
tags: []
related:
  - circles-in-maths-definition-formulas-properties-and-examples
  - even-and-odd-function-definition-graph-properties-and-examples
  - indefinite-integrals-definition-properties-formulas-and-examples
  - modern-periodic-table-modern-periodic-law-definition-examples-properties
  - onto-function-or-surjective-definition-properties-examples
  - straight-lines-definition-equations-properties-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary difference between a minor and a cofactor?
    a: >-
      A minor (Mij) is the determinant of the sub-matrix obtained by removing a
      specific row and column. A cofactor (Cij) is the minor multiplied by
      `(-1)^(i+j)`, meaning it includes an alternating sign based on its
      position in the matrix.
  - q: Why are minors and cofactors important in matrix algebra?
    a: >-
      Minors and cofactors are crucial for several advanced matrix operations.
      They are the building blocks for calculating the determinant of larger
      matrices (using cofactor expansion), finding the adjoint of a matrix, and
      ultimately determining the inverse of a matrix, which is essential for
      solving systems of linear equations.
  - q: Can minors and cofactors be calculated for any matrix?
    a: >-
      No, minors and cofactors are only defined for square matrices. This is
      because they involve calculating determinants of sub-matrices, and only
      square matrices have determinants.
  - q: How does the sign `(-1)^(i+j)` work in cofactor calculation?
    a: >-
      The `i` represents the row number and `j` represents the column number of
      the element. If `i+j` is an even number (e.g., 1+1=2, 1+3=4), the sign is
      positive (`+1`). If `i+j` is an odd number (e.g., 1+2=3, 2+3=5), the sign
      is negative (`-1`). This creates an alternating pattern of signs across
      the matrix.
  - q: Are minors and cofactors relevant for competitive exams like JEE Main?
    a: >-
      Yes, topics like minors and cofactors, along with determinants and
      matrices, are highly relevant for competitive engineering entrance exams.
      Analysis of past papers, such as JEE Main from 2013-2023, indicates that
      questions on these concepts are regularly featured.
---

When working with matrices, especially in higher mathematics, you'll often encounter terms like 'minors' and 'cofactors.' These concepts are fundamental building blocks for understanding more complex matrix operations, such as finding the adjoint or inverse of a matrix.

## Key Takeaways

*   **Determinants are essential:** A determinant is a single scalar value derived from a square matrix, indicating key properties like invertibility.
*   **Minors simplify:** A minor for a specific element in a matrix is the determinant of the smaller matrix left after removing that element's row and column.
*   **Cofactors add signs:** A cofactor is closely related to a minor but includes a specific sign (+ or -) based on the element's position.
*   **Crucial for inverses:** Both minors and cofactors are vital steps in calculating the adjoint and, subsequently, the inverse of a matrix.

## Understanding Determinants

A determinant is a unique number calculated from the elements of a square matrix. Only square matrices (those with an equal number of rows and columns) have determinants. It's usually written as `det(A)` or `|A|` for a matrix `A`.

For a `2x2` matrix, say:

```
A = |
a1 a2
b1 b2
|
```

The determinant is calculated as `(a1 * b2) - (a2 * b1)`.

For larger matrices, like a `3x3` matrix, the calculation becomes more involved, often using a process called 'expansion by cofactors' (which we'll explore shortly). The general idea involves multiplying elements by the determinants of smaller sub-matrices, alternating signs.

## What are Minors?

A minor for an element `aij` (the element in the `i`-th row and `j`-th column) of a square matrix `A` is the determinant of the sub-matrix formed by deleting the `i`-th row and `j`-th column from `A`. It's typically denoted as `Mij`.

Let's consider a `3x3` matrix:

```
A = |
a11 a12 a13
a21 a22 a23
a31 a32 a33
|
```

To find the minor `M11` (for the element `a11`), you would remove the first row and first column. The remaining `2x2` matrix is:

```
|
a22 a23
a32 a33
|
```

The minor `M11` would then be the determinant of this `2x2` matrix: `(a22 * a33) - (a23 * a32)`.

## What are Cofactors?

Cofactors build directly on minors by introducing a sign. The cofactor `Cij` for an element `aij` is defined as `(-1)^(i+j) * Mij`, where `Mij` is the minor we just discussed.

The `(-1)^(i+j)` part means that the sign of the cofactor depends on the position of the element:

*   If `(i+j)` is an even number, `(-1)^(i+j)` is `+1`, so the cofactor `Cij` is the same as the minor `Mij`.
*   If `(i+j)` is an odd number, `(-1)^(i+j)` is `-1`, so the cofactor `Cij` is the negative of the minor `Mij`.

This creates an alternating sign pattern across the matrix, often visualized as:

```
|
+ - +
- + -
+ - +
|
```

For our `3x3` example, the cofactor `C11` would be `(-1)^(1+1) * M11 = (+1) * M11 = M11`. However, `C12` would be `(-1)^(1+2) * M12 = (-1) * M12`.

## Solved Examples Based on Minors and Cofactors

Let's look at a concrete example to tie these concepts together. Suppose we have the matrix:

```
B = |
1 2 3
4 5 6
7 8 9
|
```

**1. Find the Minor M11:**

Remove row 1 and column 1:

```
|
5 6
8 9
|
```

`M11 = (5 * 9) - (6 * 8) = 45 - 48 = -3`

**2. Find the Cofactor C11:**

`C11 = (-1)^(1+1) * M11 = (+1) * (-3) = -3`

**3. Find the Minor M23:**

Remove row 2 and column 3 (the element is `6`):

```
|
1 2
7 8
|
```

`M23 = (1 * 8) - (2 * 7) = 8 - 14 = -6`

**4. Find the Cofactor C23:**

`C23 = (-1)^(2+3) * M23 = (-1) * (-6) = +6`

These concepts are fundamental in Class 12 Mathematics and are frequently tested in competitive exams like JEE Main and others such as BITSAT or WBJEE. According to analysis from 2013-2023, two questions related to this topic have appeared in JEE Main, highlighting its importance.

Understanding minors and cofactors is a stepping stone to mastering matrix algebra, which has wide applications in various fields of science and engineering.
