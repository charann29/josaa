---
title: 'Determinants – Notes, Topics, Formulas, Equations, Books, Question & Answers'
description: >-
  Explore determinants in Class 12 Maths: learn definitions, how to calculate
  them for 2x2 and 3x3 matrices, and key properties. Essential for JEE Main and
  board exams
tags:
  - determinants
  - determinants of health
  - determinants of
related:
  - continuity-and-differentiability-notes-topics-formulas-equations-books
  - integrals-notes-topics-formulas-equations-books-question-and-answers
  - inverse-trigonometric-functions-notes-topics-formulas-equations-books
  - limits-and-derivatives-notes-topics-formulas-equations-books-question
  - matrices-notes-topics-formulas-equations-books-question-and-answers
  - mechanical-properties-of-fluids-notes-topics-formulas-equations-books
topic: study-guides
rewritten: true
faqs:
  - q: What is a determinant in mathematics?
    a: >-
      A determinant is a unique numerical value associated with every square
      matrix. It helps in analyzing the properties of the matrix and is crucial
      for solving systems of linear equations.
  - q: How is a determinant different from a matrix?
    a: >-
      A matrix is an arrangement of numbers in rows and columns, serving as a
      representation. A determinant, on the other hand, is a single numerical
      value calculated from the elements of a square matrix.
  - q: Why are determinants important in real life?
    a: >-
      Determinants have practical applications in various fields. They are used
      in engineering to solve network problems, in computer graphics for
      transformations like rotation and scaling, and in economics for analyzing
      linear models.
  - q: What are minors and cofactors?
    a: >-
      The minor of an element in a matrix is the determinant of the sub-matrix
      formed by deleting its row and column. A cofactor is a signed minor,
      calculated by multiplying the minor by $(-1)^{i+j}$, where 'i' and 'j' are
      the row and column indices of the element.
  - q: Which are the best resources for studying determinants?
    a: >-
      The primary resource for studying determinants is the official NCERT Class
      12 Mathematics textbook. For competitive exams like JEE Main, students
      should also refer to dedicated reference books and previous year's
      question papers.
---

# Determinants – Notes, Topics, Formulas, Equations, Books, Question & Answers

Determinants are a fundamental concept in Class 12 Mathematics, working closely with matrices to help us understand and solve systems of linear equations. They are special numerical values linked to square matrices, providing insights into a matrix's characteristics and crucial information about the solutions to equation systems.

## Key takeaways

*   A determinant is a unique numerical value associated only with a square matrix, unlike a matrix itself which is an arrangement of numbers.
*   They are essential for determining if a system of linear equations has a single solution, many solutions, or no solution at all.
*   Determinants are used to find the inverse of a matrix, a vital operation in many mathematical and real-world problems.
*   Beyond academics, determinants have practical applications in fields like engineering (solving network problems), computer graphics (transformations), and economics (analyzing linear models).

## What are Determinants?

In mathematics, determinants are a powerful tool used to analyze square matrices and efficiently solve systems of linear equations. While a matrix is simply an organized collection of numbers, its determinant is a single, specific number calculated from those elements. This number helps us understand the properties of the matrix it represents.

For a determinant to exist, the matrix must always be a *square matrix* (meaning it has the same number of rows and columns). The determinant of a matrix 'A' is commonly denoted as `det(A)` or `|A|`.

If we have a square matrix A of order n, like this:

$A=\begin{bmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & \ddots & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{bmatrix}$

Then its determinant is written as:

$|A|=\begin{vmatrix}a_{11} & a_{12} & \cdots & a_{1n} \\a_{21} & a_{22} & \cdots & a_{2n} \\\vdots & \vdots & \ddots & \vdots \\a_{n1} & a_{n2} & \cdots & a_{nn}\end{vmatrix}$

## Minors and Cofactors

When working with determinants, especially for matrices larger than 2x2, we often use concepts called minors and cofactors. These help simplify the calculation process.

### Minors

For any element $a_{ij}$ in a square matrix A, its minor, denoted as $M_{ij}$, is the determinant of the sub-matrix formed by removing the $i^{th}$ row and $j^{th}$ column where that element $a_{ij}$ is located.

For example, in a 3x3 matrix:

$A=\begin{bmatrix}a_{11} & a_{12} & a_{13} \\a_{21} & a_{22} & a_{23} \\a_{31} & a_{32} & a_{33}\end{bmatrix}$

The minor of element $a_{11}$ ($M_{11}$) would be the determinant of the matrix remaining after deleting the first row and first column:

$M_{11} = \begin{vmatrix}a_{22} & a_{23} \\a_{32} & a_{33}\end{vmatrix} = a_{22}a_{33} - a_{32}a_{23}$

### Cofactors

A cofactor is essentially a minor with a sign attached to it. The cofactor of an element $a_{ij}$, denoted as $A_{ij}$, is calculated using the formula:

$A_{ij} = (-1)^{i+j} M_{ij}$

So, for the element $a_{11}$ from our example above, its cofactor would be:

$A_{11} = (-1)^{1+1} M_{11} = (+1) M_{11} = M_{11}$

For $a_{12}$, the cofactor $A_{12} = (-1)^{1+2} M_{12} = (-1) M_{12}$.

## Calculating Determinants

The method for calculating a determinant depends on the order (size) of the square matrix.

### For a 2x2 Matrix

If $A=\begin{bmatrix}a & b \\c & d\end{bmatrix}$, then the determinant is simply:

$|A| = ad - bc$

### For a 3x3 Matrix

For a matrix $A=\begin{bmatrix}a_{11} & a_{12} & a_{13} \\a_{21} & a_{22} & a_{23} \\a_{31} & a_{32} & a_{33}\end{bmatrix}$, the determinant can be found by expanding along any row or column using cofactors. For example, expanding along the first row:

$|A| = a_{11}A_{11} + a_{12}A_{12} + a_{13}A_{13}$

Which means:

$|A| = a_{11}(a_{22}a_{33} - a_{32}a_{23}) - a_{12}(a_{21}a_{33} - a_{31}a_{23}) + a_{13}(a_{21}a_{32} - a_{31}a_{22})$

## Important Properties of Determinants

Determinants have several useful properties that can simplify calculations and help in solving problems:

*   **Row/Column Interchange:** If any two rows or columns of a determinant are interchanged, the sign of the determinant changes.
*   **Identical Rows/Columns:** If any two rows or columns of a determinant are identical, the value of the determinant is zero.
*   **Scalar Multiplication:** If each element of a row or column of a determinant is multiplied by a constant 'k', then the value of the determinant is multiplied by 'k'.
*   **Sum of Elements:** If elements of a row or column are expressed as a sum of two or more terms, the determinant can be expressed as a sum of two or more determinants.
*   **Row/Column Operations:** If to any row or column of a determinant, a multiple of another row or column is added, the value of the determinant remains unchanged.

## Important Books and Resources

For mastering determinants, students should primarily refer to the official **NCERT Class 12 Mathematics textbook**. This forms the foundation for both board exams and competitive exams like JEE Main. For additional practice and deeper understanding, other recommended resources include reference books that cover advanced problems and previous year's questions from competitive exams, often compiled by various publishers.

Understanding determinants is crucial for success in Class 12 board exams and competitive entrance tests, opening doors to advanced mathematical concepts and their real-world applications.
