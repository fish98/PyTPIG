# PyTPIG

A simple reaction diffusion system simulator written in Python 

## Usage

Input 4 parameter into tpig.py and get the reaction diffusion image generated in Data/ folder

Important Mutatable Parameters:

```python
pActAct = 0.08  # au
pInhAct = -0.08 # av
pActInh = 0.11  # bu
pInhInh = 0     # bv

iterTime = 50   # Diffusion Iteration 50 * 50 = 2500
```

**Corresponding Formula**

$$\frac{\partial a}{\partial t} = F(a, i) - a_u \cdot a + a_v \cdot \Delta a$$

$$\frac{\partial i}{\partial t} = G(a, i) - i_u \cdot i + i_v \cdot \Delta i$$

## Contribute

This project is inspired by [Prof. Shigeru Kondo's research projects](https://www.fbs.osaka-u.ac.jp/labs/skondo/research.html) in simulating reaction diffusion process.
