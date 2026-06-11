---
title: To Draw The I-V Characteristics Curve Of P-N Junction In Forward Bias
description: >-
  Explore the I-V characteristics of a P-N junction diode in forward bias. Learn
  about its threshold voltage, current flow, and how to plot its behaviour.
tags: []
related:
  - draw-the-characteristic-curve-of-a-zener-diode-and-to-determine-its
  - common-emitter-npn-pnp-transistor-characteristics-and-gains
  - matter-particles-characteristics-properties-particle-theory-faqs
topic: study-guides
rewritten: true
faqs:
  - q: What is forward bias in a P-N junction diode?
    a: >-
      Forward bias occurs when the positive terminal of a battery is connected
      to the P-type side of the diode and the negative terminal to the N-type
      side. This connection reduces the potential barrier at the junction,
      allowing current to flow easily.
  - q: What is the threshold or cut-in voltage for a diode?
    a: >-
      The threshold or cut-in voltage is the minimum forward bias voltage
      required across a diode for it to begin conducting current significantly.
      For silicon diodes, it's typically around 0.7 V, and for germanium diodes,
      it's about 0.2 V.
  - q: Why does current increase rapidly after the threshold voltage?
    a: >-
      Once the applied forward voltage overcomes the internal potential barrier
      (threshold voltage), the depletion region narrows significantly. This
      allows a large number of majority charge carriers to cross the junction,
      leading to a sharp, exponential increase in current.
  - q: What is dynamic forward resistance?
    a: >-
      Dynamic forward resistance is the resistance of the diode when it is
      conducting current in the forward bias. It is calculated as the change in
      voltage divided by the change in current (ΔVf / ΔIf) in the steep, linear
      region of the I-V characteristic curve.
  - q: What are some practical applications of a forward-biased diode?
    a: >-
      Forward-biased diodes are fundamental in many electronic circuits. They
      are used in rectifiers to convert AC to DC, in LED circuits to emit light,
      in voltage regulators, and as switches in various digital and analog
      applications.
  - q: What precautions should be taken during this experiment?
    a: >-
      Key precautions include ensuring clean and tight connections, starting
      with minimum voltage, not exceeding the diode's maximum current rating,
      accurately reading meters, and switching off the power supply immediately
      after taking readings or if any component overheats to prevent damage.
---

# To Draw The I-V Characteristics Curve Of P-N Junction In Forward Bias

Understanding how a P-N junction diode behaves when forward-biased is fundamental to grasping its role in electronic circuits. This experiment helps visualise the relationship between voltage and current, revealing the diode's unique switching behaviour that is vital in countless applications.

## Key takeaways

*   When a diode is forward-biased, current flows from the P-type to the N-type material, effectively reducing the internal electrical barrier.
*   Initially, as forward voltage increases, the current remains very low until it reaches a specific "threshold" or "cut-in" voltage.
*   Beyond this threshold voltage (approximately 0.7V for silicon diodes and 0.2V for germanium), the current increases sharply, indicating the diode is conducting.
*   This characteristic curve is essential for designing and troubleshooting circuits involving rectifiers, LED drivers, and power supplies.

## Aim

The primary objective of this experiment is to plot the current-voltage (I-V) characteristic curve for a P-N junction diode operating under forward bias conditions.

## Apparatus Required

To conduct this experiment, you will need the following components:

*   A P-N junction semiconductor diode
*   A 3-volt DC battery
*   A 50-volt DC battery (for potential divider setup)
*   A high-resistance rheostat (serving as a potential divider)
*   One 0-3 volt voltmeter
*   One 0-50 volt voltmeter
*   One 0-100 mA ammeter
*   One 0-700 µA ammeter
*   A one-way key (switch)
*   Connecting wires
*   Pieces of sandpaper (for cleaning connections)

## Theoretical Background

A P-N junction diode is forward-biased when its P-type semiconductor material is connected to the positive terminal of a battery and its N-type material is connected to the negative terminal. This connection pushes the majority charge carriers towards the junction, narrowing the depletion region and lowering the potential barrier. As the forward bias voltage increases, a small current begins to flow. This current initially rises slowly, but once the applied voltage reaches a specific value, known as the cut-in voltage or threshold voltage, the current increases very rapidly. For silicon diodes, this threshold is typically around 0.7 V, while for germanium diodes, it is approximately 0.2 V. Understanding this behaviour is crucial for predicting how a diode will perform in a circuit.

## Experimental Procedure

Follow these steps carefully to perform the experiment:

1.  Set up the circuit exactly as shown in the provided circuit diagram (imagine a standard forward-bias diode circuit with a series ammeter, parallel voltmeter, and a rheostat for varying voltage).
2.  Ensure all electrical connections are clean, secure, and tight to prevent errors from loose contacts.
3.  Note down the least count and any zero error for both the voltmeter and the milli-ammeter. This helps ensure accurate readings.
4.  Position the moving contact of the rheostat near its negative end and then insert the key (close the switch). At this point, both the voltmeter and milli-ammeter should read zero.
5.  Gradually move the rheostat contact slightly towards the positive end to apply a small forward-bias voltage, starting with 0.1 V. Observe that the current remains zero.
6.  Continue increasing the forward-bias voltage. For a germanium diode, the current typically remains zero up to about 0.3 V due to its inherent junction potential barrier.
7.  When the forward voltage reaches approximately 0.4 V (for germanium) or slightly higher (for silicon), the milli-ammeter should record a small, measurable current.
8.  Increase the forward voltage in small, consistent steps (e.g., 0.02 V or 0.05 V) and record the corresponding forward current readings. You will notice the current initially increases slowly, then more rapidly, until the voltage approaches the diode's threshold (e.g., 0.7 V for silicon).
9.  When the forward voltage reaches or slightly exceeds the threshold (e.g., 0.72 V), the current will increase very suddenly. This point signifies the "forward breakdown" or conduction stage.
10. If you continue to increase the forward voltage beyond this breakdown stage, the forward current will continue to rise significantly. However, for safety and to prevent damage to the diode, it's advisable to take out the key (open the switch) once the sudden current increase is clearly observed and sufficient data points are collected.

## Data Analysis and Calculation

Once you have collected your data, plot a graph with the forward-bias voltage (Vf) on the x-axis and the corresponding forward current (If) on the y-axis. This graph represents the forward-bias characteristic curve of the P-N junction diode.

From the linear region of the graph (where current increases rapidly), you can calculate the dynamic forward resistance (r) of the diode. Select two points, A and B, on this steep part of the curve. Let the voltage and current values for these points be (Vf1, If1) and (Vf2, If2) respectively.

Change in forward voltage, ΔVf = Vf2 - Vf1
Change in forward current, ΔIf = If2 - If1

The junction resistance for forward bias is then calculated as:

r = ΔVf / ΔIf

For example, if ΔVf = 0.4 V and ΔIf = 10 mA (which is 0.01 A), then:

r = 0.4 V / 0.01 A = 40 ohms.

## Result

The experiment successfully demonstrates the forward-bias I-V characteristics of a P-N junction diode, showing the initial slow current increase followed by a rapid rise after the cut-in voltage. The calculated dynamic junction resistance for the forward bias condition is 40 ohms (as per the example calculation).

## Precautions

To ensure accurate and safe experimental results, please observe the following precautions:

*   Always verify that all connections are secure and correct before switching on the power.
*   Start with the rheostat at its maximum resistance position (minimum voltage) to protect the diode from excessive current.
*   Do not exceed the maximum forward current rating of the diode, as this can permanently damage it.
*   Read the voltmeter and ammeter carefully, noting their least counts and any zero errors.
*   Switch off the power supply immediately after taking readings or if you suspect any component is overheating.

This experiment provides a clear visual and practical understanding of how P-N junction diodes function in their forward-biased state, a cornerstone concept in electronics.
