---
title: 'Law of Sines - Definition, Proof, Formula, Applications and Example'
description: >-
  Discover the Law of Sines: definition, formula, and proof explained simply.
  Learn how this key trigonometric rule helps solve triangles and real-world
  problems.
tags: []
related:
  - ohm-s-law-definition-formula-applications-faqs
  - pascals-law-and-its-application-definition-formula-applications-faqs
  - argument-of-complex-numbers-definition-formula-example
  - atomic-number-mass-number-definition-example-formula-and-calculation-faqs
  - buoyant-force-definition-formula-applications-faqs
  - combination-in-math-definition-formula-and-example
topic: law
rewritten: true
faqs:
  - q: What is the primary use of the Law of Sines?
    a: >-
      The Law of Sines is primarily used to find unknown side lengths or angle
      measures in any triangle when you are given certain combinations of sides
      and angles, specifically Angle-Side-Angle (ASA), Angle-Angle-Side (AAS),
      or Side-Side-Angle (SSA) information.
  - q: Does the Law of Sines work for all types of triangles?
    a: >-
      Yes, the Law of Sines is universally applicable. It works for acute
      triangles, obtuse triangles, and scalene triangles. Unlike the Pythagorean
      theorem, which is only for right-angled triangles, the Law of Sines is
      more versatile.
  - q: What information do I need to use the Law of Sines?
    a: >-
      To effectively use the Law of Sines, you typically need to know at least
      one side and its opposite angle, along with one other side or angle.
      Common scenarios include knowing two angles and one side (ASA or AAS) or
      two sides and one non-included angle (SSA).
  - q: What is the 'ambiguous case' in the Law of Sines?
    a: >-
      The 'ambiguous case' arises when you are given two sides and a
      non-included angle (SSA). In certain situations, this information might
      lead to two possible triangles, one unique triangle, or no triangle at
      all. It requires careful analysis to determine the correct solution.
  - q: How is the Law of Sines different from the Law of Cosines?
    a: >-
      The Law of Sines relates sides to the sines of their opposite angles. The
      Law of Cosines, on the other hand, relates the square of one side to the
      squares of the other two sides and the cosine of the included angle. You
      typically use the Law of Cosines when you have Side-Angle-Side (SAS) or
      Side-Side-Side (SSS) information.
  - q: What does 'R' mean in the Law of Sines formula (a/sin A = 2R)?
    a: >-
      In the extended Law of Sines formula, 'R' represents the circumradius of
      the triangle. This is the radius of the unique circle that passes through
      all three vertices of the triangle, also known as the circumcircle.
---

When you need to figure out distances or angles in a triangle but can't directly measure everything, the Law of Sines comes to your rescue. This powerful rule in trigonometry helps connect the sides and angles of *any* triangle, making it incredibly useful for everything from land surveying to physics problems.

## Key takeaways

*   The Law of Sines establishes a relationship between the sides of a triangle and the sines of their opposite angles.
*   It applies to all types of triangles—acute, obtuse, or scalene—not just right-angled ones.
*   This law is crucial for finding unknown side lengths or angle measures when you have certain pieces of information about a triangle.
*   It's a fundamental concept in geometry, navigation, and many real-world measurement challenges.

## What is a Triangle?

A triangle is the simplest polygon, defined by three sides and three angles. Every triangle has six key components: three sides and three interior angles. A fundamental property is that the sum of these three angles always equals 180 degrees. For a triangle named ABC, we typically label the angles as A, B, and C (using capital letters) and the sides opposite these angles as a, b, and c, respectively (using lowercase letters).

Other important properties include:

*   The sum of any two sides must be greater than the third side (e.g., a + b > c).
*   All side lengths must be positive (a > 0, b > 0, c > 0).

These basic characteristics form the foundation for various theorems, including the Law of Sines, which helps us understand the relationships within a triangle.

## Law of Sines: Definition and Formula

The Law of Sines is a trigonometric rule that states that in any triangle, the ratio of the length of a side to the sine of its opposite angle is constant for all three sides and angles. This means that if you divide the length of side 'a' by the sine of angle A, you'll get the same value as dividing side 'b' by the sine of angle B, and side 'c' by the sine of angle C.

Mathematically, for a triangle ABC with sides a, b, c and opposite angles A, B, C, the Law of Sines is expressed as:

`a / sin(A) = b / sin(B) = c / sin(C)`

Sometimes, this formula is also written in its reciprocal form:

`sin(A) / a = sin(B) / b = sin(C) / c`

This constant ratio is also equal to `2R`, where `R` is the circumradius of the triangle (the radius of the circle that passes through all three vertices of the triangle).

### When to use the Law of Sines:

*   **ASA (Angle-Side-Angle):** When you know two angles and the included side.
*   **AAS (Angle-Angle-Side):** When you know two angles and a non-included side.
*   **SSA (Side-Side-Angle):** When you know two sides and a non-included angle. Be careful here, as this case can sometimes lead to ambiguous results (two possible triangles).

## Proof of the Law of Sines

To understand why the Law of Sines holds true, let's consider a triangle ABC. We can draw an altitude (height) 'h' from one vertex, say C, down to the opposite side AB (or its extension). Let's call the point where the altitude meets AB as D.

Now we have two right-angled triangles: ADC and BDC.

In right triangle ADC:

`sin(A) = opposite / hypotenuse = h / b`

So, `h = b * sin(A)`

In right triangle BDC:

`sin(B) = opposite / hypotenuse = h / a`

So, `h = a * sin(B)`

Since both expressions equal 'h', we can set them equal to each other:

`b * sin(A) = a * sin(B)`

Now, if we divide both sides by `a * b`, we get:

`sin(A) / a = sin(B) / b`

We can repeat this process by drawing an altitude from a different vertex (e.g., from A to BC) and similarly prove that `sin(B) / b = sin(C) / c`. By combining these results, we establish the full Law of Sines:

`sin(A) / a = sin(B) / b = sin(C) / c`

## Applications of the Law of Sines

The Law of Sines is incredibly versatile and finds applications in various fields:

*   **Surveying and Cartography:** Surveyors use it to measure inaccessible distances, such as the width of a river, the height of a mountain, or distances between points separated by obstacles. By measuring angles from two known points and the distance between those points, they can calculate unknown distances.
*   **Navigation:** Pilots and sailors use this law for triangulation to determine their position or the distance to a landmark.
*   **Physics and Engineering:** It's applied in vector analysis, especially when resolving forces that are not at right angles to each other. Engineers might use it in structural design or to analyze forces in complex systems.
*   **Astronomy:** While more complex formulas are often used, the basic principles of the Law of Sines can be applied to calculate distances between celestial bodies or their relative positions.

## Example Problem

Let's say you have a triangle ABC where angle A = 45 degrees, angle B = 60 degrees, and side a = 10 cm. You want to find the length of side b.

Using the Law of Sines:

`a / sin(A) = b / sin(B)`

Substitute the known values:

`10 / sin(45°) = b / sin(60°)`

We know that `sin(45°) = √2 / 2 ≈ 0.707` and `sin(60°) = √3 / 2 ≈ 0.866`.

`10 / 0.707 = b / 0.866`

To find b, multiply both sides by 0.866:

`b = (10 / 0.707) * 0.866`

`b ≈ 14.14 * 0.866`

`b ≈ 12.24 cm`

So, the length of side b is approximately 12.24 cm.

The Law of Sines is a cornerstone of trigonometry, offering a straightforward way to solve many geometric problems that would otherwise be challenging. Mastering it opens up a world of practical applications in mathematics and beyond.
