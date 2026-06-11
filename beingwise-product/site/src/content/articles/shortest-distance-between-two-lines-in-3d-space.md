---
title: Shortest Distance between Two Lines in 3D Space
description: >-
  Learn to calculate the shortest distance between lines in 3D space. Understand
  parallel, intersecting, and skew lines with formulas for JEE Main & board
  exams.
tags: []
related:
  - bba-distance-education-course-eligibility-fees-syllabus-colleges-career
  - bca-distance-education-admission-top-colleges-syllabus-entrance-exams
  - bcom-in-distance-education-course-eligibility-fees-colleges-salary-scope
  - best-distance-mba-colleges-in-bangalore-courses-fees-admission-2026
  - best-distance-mba-colleges-in-india-2026-courses-fees-admission-entrance
  - best-sikkim-manipal-university-distance-education-courses
topic: study-guides
rewritten: true
faqs:
  - q: Why is the shortest distance between two intersecting lines zero?
    a: >-
      Intersecting lines meet at a single point. Since they share a common
      point, there is no separation between them, making their shortest distance
      zero.
  - q: What is the main difference between skew lines and parallel lines?
    a: >-
      Parallel lines have the same direction and never meet, maintaining a
      constant distance. Skew lines, on the other hand, are neither parallel
      (their directions differ) nor do they intersect, existing in different
      planes.
  - q: Are there any specific prerequisites for understanding this topic?
    a: >-
      Yes, a good understanding of vector algebra, including dot products, cross
      products, and vector equations of lines in 3D, is essential for grasping
      the concepts and formulas related to the shortest distance between lines.
  - q: How often does this topic appear in JEE Main?
    a: >-
      Based on past trends, questions on the shortest distance between lines in
      3D space appear regularly in JEE Main. NTA's data indicates its consistent
      presence, often with multiple questions in a single exam year,
      highlighting its importance.
  - q: Can the shortest distance ever be negative?
    a: >-
      No, distance is a scalar quantity representing length, and length is
      always non-negative. The formulas for shortest distance include absolute
      values to ensure the result is always positive.
---

Understanding the shortest distance between two lines in 3D space is a fundamental concept in three-dimensional geometry. This topic is not only essential for Class 12 board examinations but also plays a significant role in competitive engineering entrance exams across India.

## Key Takeaways

*   The shortest distance between two lines is always the length of the perpendicular segment connecting them.
*   Lines in 3D space can be parallel, intersecting, or skew.
*   The method for finding the shortest distance depends on the relationship between the two lines.
*   This concept is frequently tested in exams like JEE Main and other state-level engineering entrances.

## What is the Shortest Distance Between Two Lines?

In three-dimensional space, the shortest distance between any two lines is defined as the length of the unique line segment that is perpendicular to both of them. This segment represents the minimum separation between the two lines.

## Relationships Between Lines in 3D Space

Before calculating the distance, it's crucial to identify how the two lines relate to each other. In a three-dimensional environment, two distinct lines can have one of three primary relationships:

*   **Parallel Lines:** These lines have the same direction vectors and never meet, no matter how far they extend. The distance between them remains constant.
*   **Intersecting Lines:** These lines cross each other at a single point. Their direction vectors are not parallel. The shortest distance between intersecting lines is zero.
*   **Skew Lines:** This is a unique 3D concept. Skew lines are neither parallel nor do they intersect. They lie in different planes and point in different directions. Finding the shortest distance between skew lines is the most complex scenario.

## Shortest Distance Between Skew Lines

Skew lines are distinct because they are non-parallel and non-intersecting. The line segment representing the shortest distance between them will be perpendicular to both skew lines.

If two skew lines are represented in vector form as $\vec{r} = \vec{a} + \lambda \vec{b}$ and $\vec{r} = \vec{a_1} + \mu \vec{b_1}$, the shortest distance (d) between them can be calculated using the formula:

$$d = \left|\frac{(\vec{b} \times \vec{b_1}) \cdot (\vec{a} - \vec{a_1})}{\|\vec{b} \times \vec{b_1}\|}\right|$$

Here, $\vec{a}$ and $\vec{a_1}$ are the position vectors of points on the first and second lines, respectively, and $\vec{b}$ and $\vec{b_1}$ are their respective direction vectors.

### Derivation for Skew Lines

Consider two skew lines, L1 and L2. There is one and only one line that is perpendicular to both L1 and L2. This is called the line of shortest distance. If we take any point S on L1 with position vector $\vec{r_0}$ and any point T on L2 with position vector $\vec{r_0}'$, the magnitude of the shortest distance vector is equal to the projection of the vector ST along the direction of the line of shortest distance. Since the shortest distance vector is perpendicular to both direction vectors $\vec{b}$ and $\vec{b_1}$, its direction is given by the cross product $\vec{b} \times \vec{b_1}$.

## Shortest Distance Between Parallel Lines

When two lines are parallel, their direction vectors are proportional, and they never meet. The shortest distance between them is the perpendicular distance from any point on one line to the other line.

If the two parallel lines are given by $\vec{r} = \vec{a_1} + \lambda \vec{b}$ and $\vec{r} = \vec{a_2} + \mu \vec{b}$, the shortest distance (d) is given by:

$$d = \frac{\|(\vec{a_2} - \vec{a_1}) \times \vec{b}\|}{\|\vec{b}\|}$$

This formula essentially finds the area of the parallelogram formed by $(\vec{a_2} - \vec{a_1})$ and $\vec{b}$ and divides it by the base length $\|\vec{b}\|$, which gives the perpendicular height.

## Importance in Competitive Exams

This topic is highly relevant for various competitive examinations. For instance, the Joint Entrance Examination (JEE) Main has consistently featured questions on the shortest distance between lines. Data from NTA shows a significant number of questions over the years, with a notable increase in recent exam cycles, indicating its high weightage.

Mastering this concept is key to scoring well in the mathematics section of engineering entrance exams and Class 12 board exams.
