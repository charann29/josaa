---
title: 'Matrix Multiplication: How to Multiply Matrices, Formula and Examples'
description: >-
  Learn how to multiply matrices with a clear definition, formula, and
  step-by-step examples. Understand conditions for valid multiplication and
  scalar types.
tags: []
related:
  - types-of-matrices-definition-examples-properties-formula
  - binomial-theorem-and-its-simple-applications-notes-formula-examples
  - cross-product-definition-formula-rules-and-examples
  - derivation-of-law-of-conservation-of-momentum-examples-formula-faqs
  - frictional-force-formula-examples-types-faqs
  - left-hand-and-right-hand-limits-definition-formula-examples-calculator
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary condition for multiplying two matrices?
    a: >-
      The primary condition is that the number of columns in the first matrix
      must be exactly equal to the number of rows in the second matrix. If this
      condition isn't met, the multiplication is not possible.
  - q: How do you determine the order (dimensions) of the product matrix?
    a: >-
      If the first matrix is of order $m \times n$ and the second matrix is of
      order $n \times p$, then their product matrix will have an order of $m
      \times p$. The inner dimensions ($n$) must match, and the outer dimensions
      ($m$ and $p$) define the new matrix's size.
  - q: >-
      What is the difference between matrix multiplication and scalar
      multiplication?
    a: >-
      Matrix multiplication involves combining two matrices using a
      row-by-column method, which is complex. Scalar multiplication, on the
      other hand, involves multiplying a matrix by a single number (scalar),
      where every element of the matrix is simply multiplied by that number.
  - q: Can you multiply any two matrices together?
    a: >-
      No, you cannot multiply any two matrices. The specific condition that the
      number of columns in the first matrix must equal the number of rows in the
      second matrix must be satisfied for the product to be defined.
  - q: How is each element of the product matrix calculated?
    a: >-
      Each element in the product matrix (let's say $c_{ij}$) is calculated by
      taking the $i$-th row of the first matrix and the $j$-th column of the
      second matrix. You multiply corresponding elements from that row and
      column, and then sum up all those products.
---

# Matrix Multiplication: How to Multiply Matrices, Formula and Examples

Matrix multiplication is a fundamental operation in mathematics where elements from two matrices are combined using a specific row-by-column approach. Unlike simple arithmetic multiplication, this process has its own set of rules and conditions. Understanding matrix multiplication is crucial for various fields, from computer graphics to physics.

## Key takeaways

*   Matrix multiplication combines two matrices by pairing rows from the first with columns from the second.
*   For matrices A and B, the product AB is only possible if the number of columns in A matches the number of rows in B.
*   The resulting product matrix will have the number of rows from the first matrix and the number of columns from the second.
*   Each element in the product matrix is found by summing the products of corresponding elements from a row and a column.

## Understanding Matrix Multiplication

Matrix multiplication is a method of creating a new matrix from two existing ones. If you have matrix A, with dimensions $m \times n$ (m rows, n columns), and matrix B, with dimensions $n \times p$ (n rows, p columns), their product, C = AB, will be a matrix of dimensions $m \times p$.

The crucial rule here is that the number of columns in the first matrix ($n$) *must* be equal to the number of rows in the second matrix ($n$). If this condition isn't met, the multiplication cannot be performed.

To find each element $c_{ij}$ in the product matrix C (meaning the element in the $i$-th row and $j$-th column), you follow a specific formula:

$c_{ij} = \sum_{k=1}^{n} a_{ik} \cdot b_{kj}$

In simpler terms, you take the elements of the $i$-th row of matrix A and multiply them, one by one, with the corresponding elements of the $j$-th column of matrix B. Then, you add all these products together. This sum gives you a single element for the product matrix.

### Order of the Product Matrix

As mentioned, if matrix A has an order of $m \times n$ and matrix B has an order of $n \times p$, then their product AB will have an order of $m \times p$.

**Example:**

Let's consider two simple matrices:

$A = \begin{bmatrix} 1 & 2 & 3 \end{bmatrix}$ (a $1 \times 3$ matrix)

$B = \begin{bmatrix} 4 \\ 5 \\ 6 \end{bmatrix}$ (a $3 \times 1$ matrix)

Here, the number of columns in A (3) matches the number of rows in B (3). So, multiplication is possible, and the resulting matrix AB will be of order $1 \times 1$.

To find the single element in AB:

$AB = [ (1 \cdot 4) + (2 \cdot 5) + (3 \cdot 6) ]$
$AB = [ 4 + 10 + 18 ]$
$AB = [ 32 ]$

This shows that multiplying a row matrix by a column matrix can result in a single numerical value, also known as a scalar.

## Conditions for Matrix Multiplication

The most important condition for multiplying two matrices, say A and B, to get AB, is that the number of columns in A must be identical to the number of rows in B.

*   If A is an $m \times n$ matrix and B is an $n \times p$ matrix, then the product AB exists and will be an $m \times p$ matrix.
*   If the number of columns in A is not equal to the number of rows in B, then the multiplication is undefined, and the product cannot be calculated.

**Example of Valid Multiplication:**

Let's take these matrices:

$A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}_{2 \times 2}$

$B = \begin{bmatrix} 5 & 6 \\ 7 & 8 \end{bmatrix}_{2 \times 2}$

Matrix A has 2 columns, and Matrix B has 2 rows. Since $2 = 2$, the multiplication AB is possible, and the result will be a $2 \times 2$ matrix.

**Example of Invalid Multiplication:**

Consider these matrices:

$P = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \end{bmatrix}_{2 \times 3}$

$Q = \begin{bmatrix} 7 & 8 \\ 9 & 10 \end{bmatrix}_{2 \times 2}$

Matrix P has 3 columns, while Matrix Q has 2 rows. Since $3 \neq 2$, the product PQ cannot be calculated.

## Types of Matrix Multiplication

Beyond the standard row-by-column method, matrix operations also include scalar multiplication, which is a simpler process.

### Scalar Multiplication

When a matrix A is multiplied by a single number (a scalar, often denoted as $k$), every element within the matrix is multiplied by that scalar.

If $A = [a_{ij}]$ is a matrix and $k$ is a scalar, then:

$kA = [k \cdot a_{ij}]$

**Example:**

Let's multiply the matrix by the scalar 3:

$3 \cdot \begin{bmatrix} 1 & -2 \\ 0 & 5 \end{bmatrix} = \begin{bmatrix} 3 \cdot 1 & 3 \cdot (-2) \\ 3 \cdot 0 & 3 \cdot 5 \end{bmatrix} = \begin{bmatrix} 3 & -6 \\ 0 & 15 \end{bmatrix}$

This type of multiplication scales the entire matrix uniformly.

Mastering matrix multiplication is a foundational step for advanced mathematical concepts and their applications in various scientific and engineering disciplines.
