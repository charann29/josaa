---
title: 'Cross Product - Definition, Formula, Rules and Examples'
description: >-
  Explore the cross product of vectors: definition, formula, right-hand rule,
  and properties. Essential for Class 11 Maths and competitive exams like JEE
  Main.
tags: []
related:
  - left-hand-and-right-hand-limits-definition-formula-examples-calculator
  - limits-definition-equation-formula-examples-calculator
  - linear-differential-equation-definition-formula-examples-calculator
  - periodic-function-definition-examples-formula-equations
  - surface-tension-definition-examples-formula-unit-dimension-faqs
  - tension-definition-examples-units-formula-faqs
topic: study-guides
rewritten: true
faqs:
  - q: What is the primary difference between a dot product and a cross product?
    a: >-
      The main difference is the type of result. A dot product (or scalar
      product) of two vectors yields a single numerical value (a scalar), while
      a cross product (or vector product) of two vectors results in another
      vector.
  - q: Why is the cross product important in real life?
    a: >-
      The cross product has numerous real-world applications, especially in
      physics and engineering. For instance, it's used to calculate torque,
      angular momentum, and to determine forces in magnetic fields. A practical
      example is in determining the optimal orientation for solar panels.
  - q: Can the cross product of two vectors be zero?
    a: >-
      Yes, the cross product of two non-zero vectors is zero if and only if the
      two vectors are parallel or anti-parallel to each other. This is because
      the sine of the angle between them (0 or 180 degrees) would be zero.
  - q: Is the cross product commutative?
    a: >-
      No, the cross product is not commutative. This means that the order of the
      vectors matters. Specifically, $\overrightarrow{\mathbf{a}} \times
      \overrightarrow{\mathbf{b}}$ is equal to $-(\overrightarrow{\mathbf{b}}
      \times \overrightarrow{\mathbf{a}})$, indicating that the resulting vector
      has the same magnitude but points in the opposite direction.
  - q: What is the 'right-hand system' mentioned in the cross product formula?
    a: >-
      A right-hand system refers to the orientation of the three vectors (the
      two original vectors and their cross product) in space. If you align your
      right-hand index finger with the first vector and your middle finger with
      the second, your thumb will point in the direction of the cross product,
      forming a consistent right-handed coordinate system.
---

# Cross Product - Definition, Formula, Rules and Examples

When we multiply two vectors, there are two main ways to do it: the dot product, which gives us a single number (a scalar), and the cross product, which results in another vector. This vector product has many uses in geometry, mechanics, and engineering, such as determining the optimal placement of a solar panel.

## Key Takeaways

*   The cross product of two vectors yields a new vector that is perpendicular to both original vectors.
*   It is a fundamental concept within Vector Algebra, a key chapter in Class 11 Mathematics.
*   Understanding cross products is vital for competitive exams like JEE Main and others such as SRM Joint Engineering Entrance, BITSAT, WBJEE, and BCECE.
*   JEE Main has featured a significant number of questions on this topic, with 45 questions asked between 2013 and 2023, including a notable increase in recent years (17 in 2023).

## What is a Vector (or Cross) Product?

The cross product is an operation between two vectors in three-dimensional space. The outcome is always a new vector that stands at a right angle (perpendicular) to both of the initial vectors. If we have two vectors, say **a** and **b**, their cross product is written as **a** × **b**.

### Cross Product Formula

The vector product of two non-zero vectors, denoted as $\overrightarrow{\mathbf{a}}$ and $\overrightarrow{\mathbf{b}}$, is defined by the formula:

$\overrightarrow{\mathbf{a}} \times \overrightarrow{\mathbf{b}} = |\overrightarrow{\mathbf{a}}||\overrightarrow{\mathbf{b}}| \sin \theta \hat{\mathbf{n}}$

In this formula:

*   $\theta$ represents the angle between the two vectors $\overrightarrow{\mathbf{a}}$ and $\overrightarrow{\mathbf{b}}$, where $0 \leq \theta \leq \pi$.
*   $|\overrightarrow{\mathbf{a}}|$ and $|\overrightarrow{\mathbf{b}}|$ are the magnitudes (lengths) of vectors $\overrightarrow{\mathbf{a}}$ and $\overrightarrow{\mathbf{b}}$ respectively.
*   $\hat{\mathbf{n}}$ is a unit vector (a vector of length 1) that is perpendicular to both $\overrightarrow{\mathbf{a}}$ and $\overrightarrow{\mathbf{b}}$.
*   Crucially, $\overrightarrow{\mathbf{a}}$, $\overrightarrow{\mathbf{b}}$, and $\hat{\mathbf{n}}$ collectively form what is known as a right-hand system.

## The Right-Hand Rule for Cross Products

The right-hand rule is a practical method to determine the direction of the resulting vector from a cross product. Imagine stretching out your right hand:

1.  Point your index finger in the direction of the first vector.
2.  Point your middle finger in the direction of the second vector.
3.  Your thumb will then point in the direction of the unit vector $\hat{\mathbf{n}}$, which is the direction of the cross product.

This rule clearly demonstrates that the cross product is not commutative. This means that $\overrightarrow{\mathbf{a}} \times \overrightarrow{\mathbf{b}}$ is not the same as $\overrightarrow{\mathbf{b}} \times \overrightarrow{\mathbf{a}}$. In fact, their directions are opposite:

$\overrightarrow{\mathbf{a}} \times \overrightarrow{\mathbf{b}} = -(\overrightarrow{\mathbf{b}} \times \overrightarrow{\mathbf{a}})$ 

This property shows that if you reverse the order of the vectors in a cross product, the resulting vector points in the opposite direction.

## Properties of the Vector Product

Understanding the properties of the cross product is essential for solving problems efficiently.

### Cross Product of Perpendicular Vectors

If two vectors are perpendicular to each other, the angle $\theta$ between them is $90^\circ$ or $\pi/2$ radians. Since $\sin(90^\circ) = 1$, the formula simplifies to:

$\overrightarrow{\mathbf{a}} \times \overrightarrow{\mathbf{b}} = |\overrightarrow{\mathbf{a}}||\overrightarrow{\mathbf{b}}| \hat{\mathbf{n}}$

The magnitude of the cross product is simply the product of the magnitudes of the two vectors.

### Cross Product of Parallel Vectors

If two vectors are parallel (or anti-parallel) to each other, the angle $\theta$ between them is $0^\circ$ or $180^\circ$ ($\pi$ radians). In both these cases, $\sin(0^\circ) = 0$ and $\sin(180^\circ) = 0$. Therefore, if vectors $\overrightarrow{\mathbf{a}}$ and $\overrightarrow{\mathbf{b}}$ are parallel:

$\overrightarrow{\mathbf{a}} \times \overrightarrow{\mathbf{b}} = 0$

This means the cross product of two parallel vectors is a zero vector.

## Triple Cross Product

The triple cross product involves three vectors, for example, $\overrightarrow{\mathbf{a}} \times (\overrightarrow{\mathbf{b}} \times \overrightarrow{\mathbf{c}})$. This operation is more complex and has its own specific expansion formula, often known as the 'BAC-CAB' rule:

$\overrightarrow{\mathbf{a}} \times (\overrightarrow{\mathbf{b}} \times \overrightarrow{\mathbf{c}}) = \overrightarrow{\mathbf{b}}(\overrightarrow{\mathbf{a}} \cdot \overrightarrow{\mathbf{c}}) - \overrightarrow{\mathbf{c}}(\overrightarrow{\mathbf{a}} \cdot \overrightarrow{\mathbf{b}})$ 

This shows that the result is a vector lying in the plane formed by $\overrightarrow{\mathbf{b}}$ and $\overrightarrow{\mathbf{c}}$.

Mastering the cross product is a significant step in understanding advanced physics and engineering principles, and it's a topic that frequently appears in major entrance examinations.
