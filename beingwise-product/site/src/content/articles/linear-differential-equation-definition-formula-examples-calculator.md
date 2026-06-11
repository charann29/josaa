---
title: 'Linear Differential Equation: Definition, Formula, Examples, Calculator'
description: >-
  Understand linear differential equations: definition, general formula,
  integrating factor method, solved examples, and how they apply in real life.
tags: []
related:
  - limits-definition-equation-formula-examples-calculator
  - union-of-sets-definition-equation-formula-examples-calculator
  - universal-set-definition-equation-formula-examples-calculator
  - left-hand-and-right-hand-limits-definition-formula-examples-calculator
  - cross-product-definition-formula-rules-and-examples
  - functions-image-and-pre-image-definition-calculator-and-examples
topic: study-guides
rewritten: true
faqs:
  - q: What is the general form of a first-order linear differential equation?
    a: >-
      The general form for a first-order linear differential equation is `dy/dx
      + P(x)y = Q(x)`, where `P(x)` and `Q(x)` are functions of 'x' or
      constants.
  - q: How is an integrating factor used to solve linear differential equations?
    a: >-
      The integrating factor (IF), calculated as `e^(∫P(x) dx)`, is multiplied
      across the entire linear differential equation. This transforms the left
      side into the derivative of a product, making the equation straightforward
      to integrate.
  - q: Why are linear differential equations important in real life?
    a: >-
      They are crucial for modeling real-world changes, such as population
      growth, the flow of electric current in circuits, radioactive decay, and
      heat transfer, due to their ability to describe linear relationships
      between a quantity and its rate of change.
  - q: Are linear differential equations important for competitive exams?
    a: >-
      Yes, they are a very important topic for competitive exams like JEE Main.
      Data from previous years shows a consistent number of questions from this
      concept, indicating its significance.
  - q: >-
      What is the difference between a linear and non-linear differential
      equation?
    a: >-
      In a linear differential equation, the dependent variable and its
      derivatives appear only to the first power and are not multiplied
      together. Non-linear equations do not follow these rules, often involving
      higher powers or products of the dependent variable and its derivatives.
  - q: Can I use an online calculator for linear differential equations?
    a: >-
      Yes, online calculators can be very useful for checking your solutions or
      understanding the step-by-step process. However, a solid understanding of
      manual solving methods is essential for true mastery.
---

# Linear Differential Equation: Definition, Formula, Examples, Calculator

Linear differential equations are fundamental tools in mathematics, helping us understand how various quantities change over time or with respect to other variables. They are vital for modeling real-world phenomena, from tracking population trends to analyzing electrical circuits.

## Key Takeaways

*   Linear differential equations describe relationships between functions and their rates of change in a linear way.
*   They are a core topic in Class 12 Mathematics and frequently appear in competitive exams like JEE Main.
*   The general form for a first-order linear differential equation is `dy/dx + P(x)y = Q(x)`.
*   The integrating factor method is a common and effective way to solve these equations.

## What is a Differential Equation?

A differential equation is any equation that includes one or more derivatives of a dependent variable with respect to an independent variable. Essentially, it links a function with its rate of change.

For instance, in the equation `dy/dx = f(x)`, 'x' is the independent variable and 'y' is the dependent variable. The term `dy/dx` represents the derivative of 'y' with respect to 'x'.

Here are some examples:

*   `x(dy/dx) + 2y = 0`
*   `dy/dx = sin(2x) + cos(x)`
*   `k(d²y/dx²) = [1 + (dy/dx)²]^(3/2)`

These equations all involve variables and the derivatives of those variables, making them differential equations.

## What is a Linear Differential Equation?

A linear differential equation is a specific type of differential equation where the dependent variable and all its derivatives appear only in the first degree (not squared, cubed, or raised to any other power), and they are not multiplied together. When plotted, these relationships would appear as straight lines.

The general form for a first-order linear differential equation is:

`dy/dx + P(x)y = Q(x)`

In this form, `P(x)` and `Q(x)` are either functions of 'x' only or constants. If an equation doesn't fit this linear structure, meaning the dependent variable or its derivatives are raised to powers greater than one, or multiplied together, it's considered a non-linear differential equation. Non-linear equations can lead to more complex and diverse solutions, sometimes even exhibiting chaotic behavior.

## Solving Linear Differential Equations

Several methods can be used to solve linear differential equations, depending on their complexity:

*   **Separation of Variables:** This method is suitable for simpler equations where you can easily separate the variables to opposite sides of the equation.
*   **Integrating Factor:** This is a powerful technique for first-order linear equations of the form `dy/dx + P(x)y = Q(x)`. It involves multiplying the entire equation by a special term called the integrating factor to simplify it.
*   **Characteristic Equation:** For linear differential equations with constant coefficients, you can solve a characteristic polynomial to find the solutions.

## Solve Linear Differential Equation using Integrating Factor

The integrating factor is a crucial tool that transforms a linear differential equation into a form that's easy to integrate. When multiplied by an integrating factor, the left side of the equation becomes the derivative of a product.

For the general first-order linear differential equation: `dy/dx + P(x)y = Q(x)`

The integrating factor (IF) is given by: `IF = e^(∫P(x) dx)`

Once you calculate the integrating factor, multiply both sides of the original equation by it:

`e^(∫P(x) dx) * (dy/dx) + y * P(x) * e^(∫P(x) dx) = Q(x) * e^(∫P(x) dx)`

The left side of this equation is now the derivative of the product `y * e^(∫P(x) dx)`. So, we can write:

`d/dx [y * e^(∫P(x) dx)] = Q(x) * e^(∫P(x) dx)`

To find 'y', simply integrate both sides with respect to 'x':

`y * e^(∫P(x) dx) = ∫[Q(x) * e^(∫P(x) dx)] dx + C`

Finally, solve for 'y':

`y = [1 / e^(∫P(x) dx)] * {∫[Q(x) * e^(∫P(x) dx)] dx + C}`

This formula provides the general solution to a first-order linear differential equation.

## Solved Examples Based On Linear Differential Equation

**Example 1: Solve `dy/dx + 2y = e^(-x)`**

Here, `P(x) = 2` and `Q(x) = e^(-x)`.

1.  **Calculate the integrating factor (IF):**
    `IF = e^(∫2 dx) = e^(2x)`

2.  **Multiply the equation by IF:**
    `e^(2x) * (dy/dx) + 2y * e^(2x) = e^(-x) * e^(2x)`
    `d/dx [y * e^(2x)] = e^x`

3.  **Integrate both sides:**
    `∫ d/dx [y * e^(2x)] dx = ∫ e^x dx`
    `y * e^(2x) = e^x + C`

4.  **Solve for y:**
    `y = (e^x + C) / e^(2x)`
    `y = e^(-x) + C * e^(-2x)`

**Example 2: Solve `(dy/dx) + (y/x) = x²`**

Here, `P(x) = 1/x` and `Q(x) = x²`.

1.  **Calculate the integrating factor (IF):**
    `IF = e^(∫(1/x) dx) = e^(ln|x|) = x` (assuming x > 0)

2.  **Multiply the equation by IF:**
    `x * (dy/dx) + y = x * x²`
    `d/dx (xy) = x³`

3.  **Integrate both sides:**
    `∫ d/dx (xy) dx = ∫ x³ dx`
    `xy = (x⁴/4) + C`

4.  **Solve for y:**
    `y = (x³/4) + (C/x)`

## Linear Differential Equation Calculator

While manual calculation is essential for understanding, online calculators can be helpful for checking your work or quickly solving complex problems. These tools typically allow you to input the P(x) and Q(x) functions and will provide the step-by-step solution, including the integrating factor and the final general solution. Many educational platforms offer such calculators, often integrated into their math resources.

Mastering linear differential equations is a significant step in your mathematical journey, opening doors to advanced topics and practical applications across various scientific and engineering fields.
