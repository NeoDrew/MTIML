# Study guide — VC Dimension Upper-Bounds Rademacher Complexity

For the COMP34312 poster, Fri 2026-05-08. Source: Tewari/Kakade Lecture 10 (page 1) + Lecture 11. Use this as your script for the 15-min talk and your Q&A prep.

---

## The one-line story

> **A class generalises iff it can't realise too many distinct labellings on samples of size m.**
> The "too many" is measured by the growth function Π_F(m). Massart's lemma turns a count of labellings into a Rademacher bound. Sauer's lemma turns the count into a polynomial in m once VCdim is finite. The two bounds compose into a √(d log m / m) generalisation guarantee.

The whole poster is one chain. Memorise the chain — you can re-derive everything from it:

```
generalisation gap   ≤  2 · Rademacher complexity   (symmetrisation)
Rademacher of F      ≤  √(2 ln Π_F(m) / m)          (Theorem 1.1, via Massart)
Π_F(m)               ≤  (em/d)^d  when m ≥ d        (Sauer + Corollary 3.1)
⟹  gap               ≲  √(d ln(em/d) / m)            → 0 as m→∞
```

If you can write that on a whiteboard and explain *why each step holds*, you're ready.

---

## How to spend the 15 minutes

| Time | Section | What you say |
|---|---|---|
| 0:00–1:30 | Setup (blocks 1–2) | Why train ≠ test; define R, R̂, sup gap; introduce Rademacher as "can the class fit pure noise?" |
| 1:30–3:00 | Master theorem (block 3) | State symmetrisation; sketch ghost-sample idea (don't prove). Plant the flag: bounding R_m gives generalisation. |
| 3:00–5:30 | Labellings & growth (blocks 4–5) | F\|_{x_1^m}, growth function, Π_F(m) ≤ 2^m. |
| 5:30–8:30 | Massart + Theorem 1.1 (block 6) | **Prove Massart**. Apply to A = F\|_{x_1^m}, get R_m(F) ≤ √(2 ln Π_F(m)/m). |
| 8:30–9:30 | Why trivial bound fails (block 7) | Plug in 2^m → √(2 ln 2), constant, useless. Motivates VC dim. |
| 9:30–12:00 | VC dim + halfspaces (block 8) | Definition, shattering. State VCdim of halfspaces = d+1; sketch lower bound; mention Radon for upper bound. |
| 12:00–14:00 | Sauer + final chain (blocks 9–10) | Sauer statement + induction sketch; (em/d)^d corollary; assemble final bound. |
| 14:00–15:00 | Takeaway (block 11) | "Larger d ⇒ richer class. Larger m ⇒ better generalisation. Finite VC ⇒ uniform convergence." Open the floor. |

Practice once aloud with a timer. If you blow past 15 min, cut the symmetrisation discussion — it's stated, not proved on the poster.

---

## Result-by-result deep dive

### 0. Setting (block 1)

- F ⊆ {±1}^X is a class of binary classifiers.
- R(f) = E[ℓ(y, f(x))], R̂(f) = (1/m) Σ ℓ(y_i, f(x_i)). For 0-1 loss, ℓ(y, y') = 1[y ≠ y'].
- We want a uniform bound on `sup_{f∈F} (R̂(f) − R(f))`. Uniform = the same bound for *every* f, including the one ERM picks.

**Why uniform matters:** if you only know R̂ ≈ R for one fixed f, you can't say anything about the f your algorithm chose after looking at the data. Uniform convergence sidesteps that.

### 1. Lemma 1.1 — Rademacher of loss class = ½ Rademacher of class (Lec 10 p.1)

> R_m(φ∘F) = ½ R_m(F), where φ is 0-1 loss.

**The trick:** for y, y' ∈ {±1}, `1[y' ≠ y] = (1 − y y')/2`.

**Proof sketch.** Substitute the identity into R_m(φ∘F):

```
R_m(φ∘F) = E[ sup_f (1/m) Σ ε_i (1 − Y_i f(X_i))/2 ]
         = (1/2) E[ sup_f (1/m) Σ ε_i (−Y_i f(X_i)) ]   (the constant 1 contributes 0 since E[ε_i] = 0)
         = (1/2) E[ sup_f (1/m) Σ ε_i f(X_i) ]            (−ε_i Y_i has the same distribution as ε_i)
         = (1/2) R_m(F)
```

Two facts you must say out loud: (i) E[ε_i | X, Y] = 0 kills constant terms, (ii) (−ε_i Y_i) has the same joint distribution as ε_i because ε_i is symmetric and independent of Y_i. The factor of ½ is why the master theorem has a 2 in it.

**Likely Q:** *"Why does this only work for 0-1 loss?"* Because the (1 − yy')/2 identity is specific to {±1}-valued y, y' and the 0-1 loss. For other losses (squared, hinge) you use Talagrand's contraction lemma instead.

### 2. Symmetrisation / master theorem (block 3)

> E[ sup_h ((1/m) Σ h(z_i) − E[h]) ] ≤ 2 R_m(H).

**Idea ("ghost sample").** Introduce an independent copy S' = {z'_1, ..., z'_m}. Then E[h] = E_{S'}[(1/m) Σ h(z'_i)], so

```
sup_h ((1/m) Σ h(z_i) − E[h])
   = sup_h E_{S'}[ (1/m) Σ (h(z_i) − h(z'_i)) ]
   ≤ E_{S'}[ sup_h (1/m) Σ (h(z_i) − h(z'_i)) ]
```

(Jensen pushed the sup inside the expectation.) Now (h(z_i) − h(z'_i)) is symmetric in distribution, so multiplying the i-th term by ε_i ∈ {±1} doesn't change the joint distribution. That introduces the Rademacher signs, and triangle-inequality split gives the factor 2.

You don't need to write this on the poster — it's stated. But you should be able to say "ghost sample, swap with random signs, factor of 2" in 30 seconds if asked.

### 3. Massart's finite class lemma (block 6) — **PROVE THIS**

> A ⊂ R^m finite, r = sup_{a∈A} ‖a‖_2, ε_i iid ±1. Then
> E[ sup_{a∈A} (1/m) Σ ε_i a_i ] ≤ r √(2 ln |A|) / m.

**This is the proof you are most likely to be asked.** Walk through it slowly:

Let μ = E[ sup_a Σ_i ε_i a_i ] (no 1/m factor for now). For any λ > 0:

```
e^{λμ}  ≤ E[ exp(λ sup_a Σ ε_i a_i) ]                (Jensen, exp is convex)
        = E[ sup_a exp(λ Σ ε_i a_i) ]
        ≤ E[ Σ_a exp(λ Σ ε_i a_i) ]                  (sup ≤ sum)
        = Σ_a Π_i E[exp(λ ε_i a_i)]                  (independence of ε_i)
        = Σ_a Π_i (e^{λa_i} + e^{−λa_i})/2
        ≤ Σ_a Π_i exp(λ²a_i²/2)                      (Hoeffding's MGF bound, key step)
        = Σ_a exp(λ² ‖a‖²/2)
        ≤ |A| exp(λ²r²/2).
```

Take logs and divide by λ:

```
μ ≤ ln|A|/λ + λr²/2.
```

Optimise: λ = √(2 ln|A|)/r. Plug back: **μ ≤ r √(2 ln|A|)**. Divide by m: done.

**Things to memorise:**
- The "sup ≤ sum over A" step (this is why we need *finite* A).
- The cosh inequality `(e^x + e^{−x})/2 ≤ e^{x²/2}` — this is the Hoeffding MGF bound. You should be ready to prove it from `cosh(x) = Σ x^{2k}/(2k)!  ≤  Σ x^{2k}/(2^k k!) = e^{x²/2}`.
- The optimal λ comes from setting the derivative of `ln|A|/λ + λr²/2` to zero.

**Likely Q:** *"Why this λ?"* Because it minimises the upper bound — you're free to pick any λ > 0, so pick the best one. *"What if A is infinite?"* The `sup ≤ sum` step blows up. Need a different tool (chaining, Dudley's entropy integral).

### 4. Theorem 1.1 — Rademacher ≤ growth function bound (Lec 11)

> R_m(F) ≤ √(2 ln Π_F(m) / m).

**Proof.** R_m(F) = E[ sup_{a ∈ F\|_{x_1^m}} (1/m) Σ ε_i a_i ]. The set A = F\|_{x_1^m} is finite (≤ 2^m elements). For each a in it, every coordinate is ±1, so ‖a‖_2 = √m. Apply Massart with r = √m:

```
R_m(F) ≤ √m · √(2 ln |F|_{x_1^m}|) / m
       = √(2 ln |F|_{x_1^m}|) / √m
       ≤ √(2 ln Π_F(m) / m)
```

The last step replaces |F restricted to *these* points| by its max over all m-tuples of points, which is the definition of Π_F(m). Then take expectation over the random sample (the bound holds pointwise so it's fine).

**Q:** *"Why √m?"* Because each a_i ∈ {±1} ⇒ ‖a‖² = m.

### 5. Why the trivial bound fails (block 7)

Π_F(m) ≤ 2^m always. Plug in:

```
R_m(F) ≤ √(2 ln(2^m)/m) = √(2 ln 2) ≈ 1.18.
```

Doesn't depend on m. Useless: more data should help, but this bound never decays. **Motivation for VC dim**: we need a class-specific way to argue Π_F(m) is *much* smaller than 2^m once m is past some threshold.

### 6. VC dimension and shattering (block 8)

- A set {x_1, ..., x_m} is **shattered** by F if every labelling in {±1}^m is realised: F\|_{x_1^m} = {±1}^m.
- VCdim(F) = max{m : Π_F(m) = 2^m} = size of the largest shattered set.

**Examples to know:**
- Intervals on R: VCdim = 2.
- Axis-aligned rectangles in R^2: VCdim = 4.
- Halfspaces in R^d: VCdim = d+1 (the proof is in the source — see below).
- Convex polygons in R^2 (no vertex bound): VCdim = ∞.

### 7. Halfspaces have VCdim = d+1 (Theorem 2.1)

> F = {x ↦ sgn(w·x − θ) : w ∈ R^d, θ ∈ R}. Then VCdim(F) = d+1.

Two directions.

**Lower bound (shatter d+1 points).** Take X = {0, e_1, ..., e_d}. Given any labelling (b_0, b_1, ..., b_d) ∈ {±1}^{d+1}, set θ = −b_0 and w_i = θ + b_i. Check:

- w · 0 − θ = −θ = b_0 ✓
- w · e_i − θ = w_i − θ = b_i ✓

So every labelling is realised. The shattered set has size d+1.

**Upper bound (no set of size d+2 is shattered).** Use Radon's lemma:

> **Radon.** Any d+2 points in R^d can be partitioned into disjoint X_1, X_2 with conv(X_1) ∩ conv(X_2) ≠ ∅.

*Why Radon kills shattering:* take a point z in conv(X_1) ∩ conv(X_2). Try to label X_1 as +1 and X_2 as −1 with a halfspace H. If H labels everything in X_1 as +1, then by convexity H labels conv(X_1) as +1, so it labels z as +1. Same argument with X_2 says H labels z as −1. Contradiction. So the +1/−1 labelling that splits along (X_1, X_2) is unrealisable, so X is not shattered.

**Proof of Radon's lemma (short).** Let X = {x_1, ..., x_{d+2}}. Consider the system of d+1 equations in d+2 unknowns:

```
Σ λ_i x_i = 0,   Σ λ_i = 0.
```

(The first is d equations, the second is one more.) More variables than equations ⇒ a non-trivial solution λ* exists. Let P = {i : λ*_i > 0}, N = {j : λ*_j < 0}. Both are non-empty (since λ* ≠ 0 and Σ λ*_i = 0). Define X_1 = {x_i : i ∈ P}, X_2 = {x_j : j ∈ N}. Then

```
( Σ_{i∈P} λ*_i x_i ) / ( Σ_{i∈P} λ*_i )  =  ( Σ_{j∈N} (−λ*_j) x_j ) / ( Σ_{j∈N} (−λ*_j) )
```

is a convex combination on both sides (positive coefficients summing to 1) and hence lies in both conv(X_1) and conv(X_2). Done.

**Likely Q:** *"Why d+1 equations in d+2 unknowns?"* d for the spatial coordinates plus 1 for the affine constraint Σ λ = 0. The affine constraint is what forces both P and N to be non-empty.

### 8. Theorem 2.2 — function-space dimension upper-bounds VCdim

> If G is a finite-dimensional vector space of functions R^d → R, F = {sgn ∘ g : g ∈ G}, then VCdim(F) ≤ dim(G).

**Idea.** Pick any k+1 points (k = dim G). The evaluation map T(g) = (g(x_1), ..., g(x_{k+1})) sends G into R^{k+1} but its image has dimension ≤ k. So there's a non-zero λ ∈ R^{k+1} orthogonal to image(T): Σ λ_i g(x_i) = 0 for all g ∈ G.

Split into P, N (positive/negative coordinates of λ). Try to realise the labelling that's +1 on P and −1 on N: would require some g with g(x_i) > 0 on P, ≤ 0 on N. Then Σ_{P} λ_i g(x_i) > 0 but Σ_{N} λ_i g(x_i) ≥ 0, contradicting Σ λ_i g(x_i) = 0. Hence this labelling is unrealisable, so {x_1, ..., x_{k+1}} isn't shattered.

This generalises the halfspace result: halfspaces correspond to G = span{1, x_1, ..., x_d}, dimension d+1.

### 9. Sauer's lemma (block 9) — **be ready to prove**

> If VCdim(F) ≤ d, then Π_F(m) ≤ Σ_{i=0}^d C(m,i).

**Proof by induction on m + d.** Base case m = d = 1: both sides are 2.

Inductive step. Fix F with VCdim(F) ≤ d on m points X_1 = {x_1, ..., x_m}. Let X_2 = {x_2, ..., x_m}. Define:

- F_1 := F\|_{X_1}  (full restriction; we want to bound |F_1| = Π_F(m)).
- F_2 := F\|_{X_2}  (drop the first coordinate).
- F_3 := { f\|_{X_2} : f ∈ F and ∃ f' ∈ F that agrees with f on X_2 but disagrees on x_1 }. So F_3 is the set of "ambiguous" tail-labellings — those that are achievable with both signs at x_1.

Counting: every label vector in F_1 is determined by (its tail in F_2, sign at x_1). For non-ambiguous tails, only one sign at x_1 occurs ⇒ contributes |F_2 \ F_3| to F_1. Ambiguous tails contribute 2|F_3|. So

```
|F_1| = (|F_2| − |F_3|) + 2|F_3| = |F_2| + |F_3|.
```

Now bound each:

- VCdim(F_2) ≤ d (restricting to a smaller point set can only decrease VCdim). Induction (m − 1, d): |F_2| ≤ h(m−1, d).
- VCdim(F_3) ≤ d − 1: if F_3 shatters some set S ⊂ X_2, then F shatters S ∪ {x_1} (because every labelling on S is realised by *both* signs at x_1, by definition of F_3). So if F_3 shattered d points, F would shatter d+1, contradicting VCdim(F) ≤ d. Induction (m − 1, d − 1): |F_3| ≤ h(m−1, d−1).

Putting it together: |F_1| ≤ h(m−1, d) + h(m−1, d−1) = h(m, d) using Pascal's identity. Done.

**Likely Q:** *"Why does VCdim(F_3) ≤ d−1?"* Because every set F_3 shatters can be extended by x_1 to a set F shatters with one more point.

### 10. Corollary 3.1 — polynomial closed-form (block 9)

> For m ≥ d, Π_F(m) ≤ (em/d)^d.

**Proof.** Multiply Sauer's bound by (m/d)^d / (m/d)^d = 1, then bound:

```
Σ_{i=0}^d C(m,i)
  ≤ (m/d)^d Σ_{i=0}^d C(m,i) (d/m)^i               (since (d/m)^i ≤ 1, factor (m/d)^d compensates)
  ≤ (m/d)^d Σ_{i=0}^m C(m,i) (d/m)^i               (extend the sum, all extra terms ≥ 0)
  = (m/d)^d (1 + d/m)^m                            (binomial theorem)
  ≤ (m/d)^d e^d                                    (since (1+x/m)^m ≤ e^x)
```

So Π_F(m) ≤ (em/d)^d. The key inequality used is `(1 + d/m)^m ≤ e^d` — say "from (1+x)^m ≤ e^{xm}" if asked.

### 11. The final chain (block 10)

For m ≥ d:

```
R_m(F) ≤ √(2 ln Π_F(m) / m)         (Massart-driven Theorem 1.1)
       ≤ √(2 ln (em/d)^d / m)        (Sauer + Corollary 3.1)
       = √(2d ln(em/d) / m).
```

Combined with symmetrisation (factor 2):

```
E[ sup_f (R̂(f) − R(f)) ]  ≲  √(d ln(em/d) / m).
```

**Reading the bound:**
- d ↑: bound looser (more flexible class needs more data).
- m ↑: bound shrinks like √(ln m / m) (essentially 1/√m up to log).
- d = ∞ (e.g. convex polygons): bound vacuous, no uniform convergence guarantee.
- d finite: gap → 0 as m → ∞ ⇒ ERM is consistent (PAC learnable in agnostic sense).

---

## Q&A drills (be ready for these)

1. **"Why is Rademacher complexity the right thing to bound?"** Because it appears naturally after symmetrisation, and it captures whether the class can fit pure noise — which is exactly the worst-case overfitting scenario.

2. **"Why does the bound involve √(ln Π / m), not ln Π / m?"** Because Massart's lemma gives a √-bound. The √ comes from balancing the Hoeffding-style bound λ²r²/2 with the entropy term ln|A|/λ — the best λ produces a square root.

3. **"Where in the proof does VC dim enter?"** Only in Sauer's lemma. Everything before Sauer is general. VC dim is the right "complexity" because it's exactly the threshold past which the trivial 2^m bound becomes loose, and Sauer's lemma quantifies the slack.

4. **"What's an example of an F with infinite VC dim?"** Convex polygons in R^2 (with unbounded number of vertices). Take m points on a circle: any subset can be enclosed by a polygon with vertices just outside that subset, so all 2^m labellings are realised.

5. **"Is finite VC dim necessary for learnability?"** For PAC learnability of binary classification with the 0-1 loss, *yes* — this is the Fundamental Theorem of Statistical Learning. Finite VC dim is equivalent to uniform convergence which is equivalent to PAC learnability (in the agnostic case).

6. **"How does this connect to deep learning?"** Modern nets often have VCdim ≫ m yet still generalise. So VC theory gives a worst-case bound that's vacuous for deep nets — this is what motivates margin/Rademacher/algorithmic-stability based bounds. (Cite *Zhang et al., "Understanding deep learning requires rethinking generalization", 2017* if asked.)

7. **"Why do we use ε_i ∈ {±1}, not Gaussian noise?"** Either works (Gaussian gives "Gaussian complexity"); Rademacher is sharper for {±1}-valued classes and the symmetrisation argument lands directly on signs.

8. **"What's the difference between the growth function and VC dim?"** Growth function counts labellings on the *worst-case* m points. VC dim is a single integer summarising when this counting stops being exponential. Sauer's lemma is the bridge: VC dim controls growth.

9. **"Why are halfspaces VCdim d+1, not d?"** The "+1" comes from the bias/threshold term θ. Without θ (homogeneous halfspaces through the origin) it's d.

10. **"Where does Radon's lemma actually use d+2?"** The system Σ λ_i x_i = 0, Σ λ_i = 0 has d+1 equations in d+2 unknowns. d+2 is the smallest number of points for which this system is guaranteed to be under-determined.

---

## Things to know cold (one-line each)

- **Rademacher complexity:** R_m(H) = E[ sup_{h∈H} (1/m) Σ ε_i h(z_i) ].
- **Growth function:** Π_F(m) = max over m-tuples of |F restricted to those m points|.
- **VC dim:** max m with Π_F(m) = 2^m, equivalently size of largest shattered set.
- **Massart:** finite A ⇒ Rademacher ≤ r √(2 ln |A|)/m.
- **Sauer:** VCdim ≤ d ⇒ Π_F(m) ≤ Σ_{i=0}^d C(m,i) ≤ (em/d)^d.
- **Final:** R_m(F) ≤ √(2d ln(em/d)/m), gap ≤ 2 R_m(F).

---

## What to do tonight and tomorrow

**Tonight:**
1. Read the two source PDFs end-to-end with this guide open. Match each result to its block on the poster.
2. Practice the Massart proof on paper from memory. Then the Sauer induction. Then the halfspace lower bound + Radon proof. Those are the three you must be able to derive in front of a marker.

**Tomorrow:**
1. Practice the 15-min talk aloud, with a timer, twice. Once alone, once with a teammate listening.
2. Have your two teammates pick three Q&A drills each and grill you. Swap.
3. Decide who covers which blocks during the talk — typical split: setup + symmetrisation, growth + Massart, VC dim + Sauer + final chain (one block of three each).
4. Final compile of the poster, print preview at 100% to check legibility.

**Friday morning:**
- Arrive 15+ minutes early to set up.
- Bring printout of this guide as a backup cheat sheet.
- AI-use declaration: include a one-liner ("Generative AI was used to assist with poster design and proof exposition; all mathematical content was verified against the lecture notes") since the brief explicitly requires it.
