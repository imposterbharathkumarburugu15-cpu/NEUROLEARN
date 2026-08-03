export interface DocumentItem {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'General';
  category: 'pyqs' | 'notes' | 'formulae';
  pagesCount: number;
  fileSize: string;
  author: string;
  year?: string;
  rating: number;
  downloads: number;
  coverImage: string;
  badge?: string;
  isBookmarked?: boolean;
  isDownloaded?: boolean;
  summary: string;
  tags: string[];
  tableOfContents: { title: string; page: number }[];
  pages: {
    pageNumber: number;
    title: string;
    content: string;
    keyFormulas?: string[];
    diagramType?: 'dipole' | 'mindmap' | 'integral' | 'structure' | 'circuit';
    solvedExamples?: {
      question: string;
      options?: string[];
      answer: string;
      explanation: string;
    }[];
  }[];
}

export const REAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-phys-formulas',
    title: 'Physics Master Formula & Concept Handbook',
    subject: 'Physics',
    category: 'formulae',
    pagesCount: 6,
    fileSize: '3.4 MB',
    author: 'Prof. R. V. Sharma (IIT Delhi)',
    year: '2026 Edition',
    rating: 4.9,
    downloads: 14200,
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    badge: 'High Yield',
    isBookmarked: true,
    isDownloaded: true,
    summary: 'Comprehensive formula handbook covering Electrostatics, Magnetism, Optics, Thermodynamics, and Modern Physics with unit derivations and edge cases.',
    tags: ['Electrostatics', 'Magnetism', 'Formulas', 'JEE Advanced', 'NEET'],
    tableOfContents: [
      { title: '1. Electrostatics & Dipoles', page: 1 },
      { title: '2. Current Electricity & Kirchhoff Laws', page: 2 },
      { title: '3. Magnetism & Electromagnetic Induction', page: 3 },
      { title: '4. Optics & Wave Optics', page: 4 },
      { title: '5. Thermodynamics & Kinetic Theory', page: 5 },
      { title: '6. Modern Physics & Photoelectric Effect', page: 6 },
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Electrostatics & Electric Field Vectors',
        content: `
### 1.1 Coulomb's Law & Vector Form
The electrostatic force between two point charges $q_1$ and $q_2$ in vacuum separated by distance $r$:
$$\\vec{F}_{12} = \\frac{1}{4\\pi \\varepsilon_0} \\frac{q_1 q_2}{r^2} \\hat{r}_{12}$$
where $\\varepsilon_0 = 8.854 \\times 10^{-12} \\text{ F/m}$.

### 1.2 Electric Field of Standard Charge Distributions
* **Point Charge:** $E = \\frac{kq}{r^2}$
* **Infinite Wire (charge density $\\lambda$):** $E = \\frac{2k\\lambda}{r} = \\frac{\\lambda}{2\\pi \\varepsilon_0 r}$
* **Uniformly Charged Ring (radius $R$, charge $Q$) on axis at distance $x$:**
  $$E(x) = \\frac{k Q x}{(x^2 + R^2)^{3/2}}$$
  * Maximum field occurs at $x = \\pm \\frac{R}{\\sqrt{2}}$, where $E_{\\text{max}} = \\frac{2 k Q}{3\\sqrt{3} R^2}$.
* **Solid Uniformly Charged Conducting Sphere (Radius $R$):**
  * $r < R$: $E_{\\text{inside}} = 0$
  * $r \\ge R$: $E_{\\text{outside}} = \\frac{kQ}{r^2}$
* **Solid Non-Conducting Uniform Charge Sphere:**
  * $r \\le R$: $E = \\frac{\\rho r}{3\\varepsilon_0} = \\frac{k Q r}{R^3}$

### 1.3 Electric Dipole Equations
* Dipole Moment: $\\vec{p} = q \\vec{d}$ (directed from $-q$ to $+q$)
* Axial Field: $E_{\\text{axial}} = \\frac{2 k p r}{(r^2 - a^2)^2} \\approx \\frac{2 k p}{r^3}$ (for $r \\gg a$)
* Equatorial Field: $E_{\\text{eq}} = \\frac{k p}{(r^2 + a^2)^{3/2}} \\approx \\frac{k p}{r^3}$
* Torque on Dipole in Uniform Field: $\\vec{\\tau} = \\vec{p} \\times \\vec{E}$
* Potential Energy: $U = - \\vec{p} \\cdot \\vec{E}$
        `,
        keyFormulas: [
          'F = (1 / 4πε₀) · (q₁q₂ / r²)',
          'E_ring(x) = k Q x / (x² + R²)^(3/2)',
          'E_max occurs at x = R / √2',
          'τ = p × E',
          'U = -p · E'
        ],
        diagramType: 'dipole',
        solvedExamples: [
          {
            question: 'Two identical charges q are fixed at (a, 0) and (-a, 0). A third charge -q of mass m is placed at origin. If given a small displacement y << a along y-axis, find the frequency of simple harmonic motion.',
            options: [
              'f = (1/2π) √(2kq²/ma³)',
              'f = (1/2π) √(kq²/2ma³)',
              'f = (1/2π) √(4kq²/ma³)',
              'f = (1/2π) √(kq²/ma³)'
            ],
            answer: 'f = (1/2π) √(2kq²/ma³)',
            explanation: 'Net restoring force along y-axis: F_y = -2 (kq²/(a²+y²)) · sin(θ) ≈ -2kq²y/a³ for y<<a. Comparing with F = -m ω² y gives ω = √(2kq²/ma³), so f = ω / 2π.'
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Current Electricity, RC Circuits & Potentiometer',
        content: `
### 2.1 Microscopic Ohm's Law & Drift Velocity
* Drift Velocity: $v_d = \\frac{e E \\tau}{m} = \\frac{e V \\tau}{m L}$
* Current Density: $J = n e v_d = \\sigma E$
* Temperature coefficient of resistance: $R(T) = R_0 (1 + \\alpha \\Delta T)$

### 2.2 Kirchhoff's Laws & Circuit Reduction
* **Junction Rule:** $\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$ (Conservation of Charge)
* **Loop Rule:** $\\sum \\Delta V = 0$ (Conservation of Energy)

### 2.3 RC Circuit Charging & Discharging
* **Charging Capacitor:**
  $$q(t) = Q_0 \\left(1 - e^{-t / \\tau}\\right), \\quad I(t) = I_0 e^{-t / \\tau}$$
  where time constant $\\tau = R C$.
* **Discharging Capacitor:**
  $$q(t) = Q_0 e^{-t / \\tau}, \\quad I(t) = - I_0 e^{-t / \\tau}$$
* Energy stored: $U = \\frac{1}{2} C V^2 = \\frac{q^2}{2C}$. During charging from voltage $V$, battery supplies $Q V = C V^2$, half is stored in capacitor, half dissipated as heat ($H = \\frac{1}{2} C V^2$).
        `,
        keyFormulas: [
          'v_d = e E τ / m',
          'J = σ E = I / A',
          'q(t) = Q₀ (1 - e^(-t / RC))',
          'Heat Dissipated = ½ C V²'
        ],
        diagramType: 'circuit',
        solvedExamples: [
          {
            question: 'In an uncharged RC circuit with C = 4 μF and R = 2 MΩ connected to 12V battery, find the charge after t = 8 seconds.',
            answer: 'Q = 48 (1 - e⁻¹) μC ≈ 30.34 μC',
            explanation: 'Time constant τ = R C = (2 × 10⁶) × (4 × 10⁻⁶) = 8 s. Since t = τ, Q(τ) = Q₀ (1 - e⁻¹) = (48 μC)(1 - 0.368) = 30.34 μC.'
          }
        ]
      },
      {
        pageNumber: 3,
        title: 'Magnetism, Biot-Savart Law & Ampere Law',
        content: `
### 3.1 Magnetic Field Equations
* **Biot-Savart Law:** $d\\vec{B} = \\frac{\\mu_0 I}{4\\pi} \\frac{d\\vec{l} \\times \\hat{r}}{r^2}$
* **Infinite Straight Wire:** $B = \\frac{\\mu_0 I}{2\\pi r}$
* **Center of Circular Loop (radius $R$, $N$ turns):** $B = \\frac{\\mu_0 N I}{2 R}$
* **Axis of Circular Loop at distance $x$:**
  $$B(x) = \\frac{\\mu_0 I R^2}{2 (R^2 + x^2)^{3/2}}$$
* **Solenoid (n turns/meter):** $B = \\mu_0 n I$ (inside uniform region)

### 3.2 Motion of Charged Particle in Magnetic Field
* Force: $\\vec{F} = q (\\vec{v} \\times \\vec{B})$
* Radius of circular motion (velocity $\\perp \\vec{B}$): $r = \\frac{m v}{q B} = \\frac{\\sqrt{2 m K}}{q B} = \\frac{p}{q B}$
* Time period: $T = \\frac{2\\pi m}{q B}$ (independent of velocity!)
* Pitch of helical path (angle $\\theta$ with $B$): $p_{\\text{pitch}} = v \\cos\\theta \\cdot T = \\frac{2\\pi m v \\cos\\theta}{q B}$
        `,
        keyFormulas: [
          'B_wire = μ₀ I / 2πr',
          'B_axis(x) = μ₀ I R² / 2(R² + x²)^(3/2)',
          'r = m v / q B',
          'T = 2π m / q B'
        ]
      }
    ]
  },
  {
    id: 'doc-chem-mindmap',
    title: 'Organic Chemistry Master Mechanisms & Reaction Map',
    subject: 'Chemistry',
    category: 'notes',
    pagesCount: 8,
    fileSize: '4.8 MB',
    author: 'Dr. Ananya Mukherjee (Ex-HOD Chemistry)',
    year: '2026 Revised',
    rating: 5.0,
    downloads: 18900,
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
    badge: 'Must Have',
    isBookmarked: true,
    isDownloaded: false,
    summary: 'Complete visual roadmap for Nucleophilic Substitution (SN1 vs SN2), Elimination (E1 vs E2), Electrophilic Addition, Aldol, Cannizzaro, and Named Reagents.',
    tags: ['Organic Chemistry', 'Mind Map', 'SN1/SN2', 'Aldol', 'Named Reactions'],
    tableOfContents: [
      { title: '1. SN1 vs SN2 vs E1 vs E2 Decision Matrix', page: 1 },
      { title: '2. Electrophilic Aromatic Substitution (EAS)', page: 2 },
      { title: '3. Aldol Condensation & Cannizzaro Mechanisms', page: 3 },
      { title: '4. Grignard Reagents & Organometallics', page: 4 },
      { title: '5. Reimer-Tiemann & Kolbe Reactions', page: 5 }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'SN1, SN2, E1, and E2 Substitution & Elimination Matrix',
        content: `
### 1.1 Decision Matrix based on Substrate & Nucleophile/Base

| Substrate | Strong Nucleophile / Weak Base (e.g., I⁻, CN⁻, HS⁻) | Strong Bulky Base (e.g., t-BuOK, LDA) | Weak Nucleophile / Base (e.g., H₂O, EtOH) |
|---|---|---|---|
| **Methyl** | **SN2** (Fastest) | **SN2** | No Reaction |
| **Primary (1°)** | **SN2** | **E2** (Hofmann product) | No Reaction |
| **Secondary (2°)** | **SN2** (Polar Aprotic) | **E2** | **SN1 / E1** (Slow, needs heat) |
| **Tertiary (3°)** | **SN1** | **E2** (Zaitsev product) | **SN1 / E1** (Solvolysis) |

### 1.2 Stereochemistry Comparison
* **SN2:** 100% Inversion of configuration (Walden Inversion), Concerted single-step mechanism with pentacoordinate transition state.
* **SN1:** Racemization with slight preference for inversion due to ion-pair shielding. Stepwise mechanism forming planar carbocation intermediate.
* **E2:** Anti-coplanar transition state required ($H$ and leaving group $X$ must be anti periplanar).
* **E1:** Zaitsev's rule governs major alkene product unless steric hindrance dictates otherwise.
        `,
        keyFormulas: [
          'Rate(SN2) = k [R-X] [Nu⁻]',
          'Rate(SN1) = k [R-X]',
          'Carbocation Stability: 3° > 2° > 1° > Methyl',
          'Polar Aprotic Solvents (DMSO, DMF, Acetone) favor SN2'
        ],
        diagramType: 'mindmap',
        solvedExamples: [
          {
            question: 'Which solvent best promotes the SN2 reaction of 1-bromobutane with sodium cyanide (NaCN)?',
            options: ['Water (H₂O)', 'Methanol (CH₃OH)', 'DMF (Dimethylformamide)', 'Acetic acid'],
            answer: 'DMF (Dimethylformamide)',
            explanation: 'DMF is a polar aprotic solvent. It solvates the Na+ cation while leaving the CN- nucleophile naked and highly reactive, maximizing SN2 rate.'
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Electrophilic Aromatic Substitution (EAS)',
        content: `
### 2.1 General EAS Mechanism
1. **Generation of Electrophile ($E^+$):**
   * Nitration: $\\text{HNO}_3 + \\text{H}_2\\text{SO}_4 \\rightarrow \\text{NO}_2^+ + \\text{HSO}_4^- + \\text{H}_2\\text{O}$
   * Halogenation: $\\text{Cl}_2 + \\text{FeCl}_3 \\rightarrow \\text{Cl}^+ \\cdot \\text{FeCl}_4^-$
   * Friedel-Crafts Alkylation: $\\text{R-Cl} + \\text{AlCl}_3 \\rightarrow \\text{R}^+ + \\text{AlCl}_4^-$ (Carbocation rearrangement possible!)
2. **Attack of Benzene Ring:** Formation of resonance-stabilized Arenium Ion (Sigma Complex).
3. **Deprotonation:** Loss of $H^+$ restores aromaticity.

### 2.2 Directing Groups Summary
* **Strong Activators (Ortho/Para):** $-\\text{OH}, -\\text{NH}_2, -\\text{OR}, -\\text{NR}_2$
* **Moderate Activators (Ortho/Para):** $-\\text{NHCOR}, -\\text{OCOR}$
* **Deactivators (Ortho/Para):** Halogens ($-\\text{F}, -\\text{Cl}, -\\text{Br}, -\\text{I}$) - Deactivating due to $-I$ effect, but ortho/para directing due to $+M$ resonance.
* **Meta Directors (Deactivating):** $-\\text{NO}_2, -\\text{CN}, -\\text{CHO}, -\\text{COR}, -\\text{COOH}, -\\text{SO}_3\\text{H}, -\\text{NR}_3^+$
        `,
        keyFormulas: [
          'Nitronium Ion: NO₂⁺',
          'Acylium Ion: R-C≡O⁺ (No rearrangement)',
          'Halogens: Deactivating but Ortho/Para Directing'
        ]
      }
    ]
  },
  {
    id: 'doc-math-calculus-pyq',
    title: 'Calculus JEE Advanced Solved PYQ Archive (2018–2025)',
    subject: 'Mathematics',
    category: 'pyqs',
    pagesCount: 14,
    fileSize: '6.2 MB',
    author: 'NeuroLearn Math Editorial Board',
    year: '2025 Solved',
    rating: 4.9,
    downloads: 22100,
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    badge: 'Exam Grade',
    isBookmarked: false,
    isDownloaded: true,
    summary: '85+ Rigorously solved Calculus questions from JEE Advanced with King property shortcuts, Leibniz integral rule derivations, and graph transformation tricks.',
    tags: ['Calculus', 'JEE Advanced', 'Integration', 'Limits', 'Differential Equations'],
    tableOfContents: [
      { title: '1. Limits, Continuity & Differentiability', page: 1 },
      { title: '2. Application of Derivatives & Monotonicity', page: 3 },
      { title: '3. Indefinite & Definite Integration', page: 6 },
      { title: '4. Area Under Curves & Bounded Regions', page: 10 },
      { title: '5. Differential Equations & Integrating Factors', page: 12 }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Definite Integrals & King Property Masterclass',
        content: `
### 1.1 The King Property & Derivatives
$$\\int_{a}^{b} f(x) dx = \\int_{a}^{b} f(a + b - x) dx$$

**Special Case (Symmetric Limits):**
$$\\int_{-a}^{a} f(x) dx = \\begin{cases} 2 \\int_{0}^{a} f(x) dx & \\text{if } f(x) \\text{ is even} \\\\ 0 & \\text{if } f(x) \\text{ is odd} \\end{cases}$$

### 1.2 Leibniz Rule of Differentiation Under Integral Sign
If $I(x) = \\int_{g(x)}^{h(x)} f(t, x) dt$, then:
$$\\frac{dI}{dx} = f(h(x), x) \\cdot h'(x) - f(g(x), x) \\cdot g'(x) + \\int_{g(x)}^{h(x)} \\frac{\\partial f}{\\partial x} dt$$
        `,
        keyFormulas: [
          '∫[a to b] f(x)dx = ∫[a to b] f(a+b-x)dx',
          'd/dx ∫[g(x) to h(x)] f(t)dt = f(h(x))h\'(x) - f(g(x))g\'(x)'
        ],
        diagramType: 'integral',
        solvedExamples: [
          {
            question: '[JEE Advanced 2023] Evaluate I = ∫₀^(π/2) (sin^n(x) / (sin^n(x) + cos^n(x))) dx for any real number n.',
            options: ['π/2', 'π/4', 'π/8', '0'],
            answer: 'π/4',
            explanation: 'Applying King property: I = ∫₀^(π/2) (cos^n(x) / (cos^n(x) + sin^n(x))) dx. Adding both expressions gives 2I = ∫₀^(π/2) 1 dx = π/2 => I = π/4.'
          },
          {
            question: '[JEE Advanced 2021] Let f(x) = ∫₀^(x²) (t² - 5t + 4) dt. Find the points of local minima of f(x) for x > 0.',
            options: ['x = 1', 'x = 2', 'x = 1 and x = 2', 'x = 0'],
            answer: 'x = 2',
            explanation: 'By Leibniz Rule: f\'(x) = ( (x²)² - 5(x²) + 4 ) · (2x) = 2x (x⁴ - 5x² + 4) = 2x (x² - 1)(x² - 4). For x > 0, critical points are x = 1 and x = 2. Checking sign change of f\'(x): at x = 2, f\'(x) changes from negative to positive, so x = 2 is a point of local minimum.'
          }
        ]
      }
    ]
  },
  {
    id: 'doc-inorganic-cheat',
    title: 'Inorganic Chemistry NCERT Line-by-Line Cheat Sheet',
    subject: 'Chemistry',
    category: 'notes',
    pagesCount: 5,
    fileSize: '2.9 MB',
    author: 'Kota Super-30 Faculty',
    year: '2026 Verified',
    rating: 4.8,
    downloads: 16400,
    coverImage: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=800',
    badge: 'NCERT Special',
    isBookmarked: false,
    isDownloaded: false,
    summary: 'Every exception, color chart, oxidation state rule, and coordination complex hybridization extracted directly from NCERT class 11 & 12 textbooks.',
    tags: ['Inorganic', 'NCERT', 'Coordination Compounds', 'p-Block', 'Exceptions'],
    tableOfContents: [
      { title: '1. Coordination Compounds & CFT Splitting', page: 1 },
      { title: '2. p-Block Elements & Anomalous Behavior', page: 2 },
      { title: '3. d & f Block Colors & Magnetic Moments', page: 3 },
      { title: '4. Metallurgy & Ores Table', page: 4 }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Coordination Chemistry & Crystal Field Theory (CFT)',
        content: `
### 1.1 Spectrochemical Series (Ligand Field Strength)
$$\\text{I}^- < \\text{Br}^- < \\text{SCN}^- < \\text{Cl}^- < \\text{S}^{2-} < \\text{F}^- < \\text{OH}^- < \\text{C}_2\\text{O}_4^{2-} < \\text{H}_2\\text{O} < \\text{NCS}^- < \\text{EDTA}^{4-} < \\text{NH}_3 < \\text{en} < \\text{CN}^- < \\text{CO}$$

* **Strong Field Ligands (SFL):** Cause pairing of electrons ($t_{2g}^6 e_g^0$ low spin), e.g., $\\text{CO}, \\text{CN}^-, \\text{en}, \\text{NH}_3$ (for $\\text{Co}^{3+}$ and higher).
* **Weak Field Ligands (WFL):** High spin complexes, e.g., $\\text{F}^-, \\text{Cl}^-, \\text{H}_2\\text{O}$.

### 1.2 Crystal Field Splitting Energy (CFSE) Formula
* **Octahedral Complex ($\Delta_o$):**
  $$\\text{CFSE} = \\left( -0.4 \\cdot n_{t2g} + 0.6 \\cdot n_{eg} \\right) \\Delta_o + P_{\\text{pairing}}$$
* **Tetrahedral Complex ($\Delta_t$):**
  $$\\Delta_t = \\frac{4}{9} \\Delta_o$$
  Tetrahedral complexes are **always high spin** because $\\Delta_t$ is too small to overcome pairing energy $P$.

### 1.3 Magnetic Moment ($\mu_s$)
$$\\mu_s = \\sqrt{n(n + 2)} \\text{ BM}$$
where $n$ is the number of unpaired electrons.
        `,
        keyFormulas: [
          'CFSE(oct) = (-0.4 n_t2g + 0.6 n_eg) Δ_o',
          'Δ_t = (4/9) Δ_o',
          'μ_s = √(n(n+2)) BM'
        ]
      }
    ]
  },
  {
    id: 'doc-math-vectors',
    title: 'Vector Algebra & 3D Geometry Formula & Shortcut Matrix',
    subject: 'Mathematics',
    category: 'formulae',
    pagesCount: 4,
    fileSize: '2.1 MB',
    author: 'Prof. K. N. Rao',
    year: '2026 Edition',
    rating: 4.9,
    downloads: 11200,
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
    badge: 'Formula Sheet',
    isBookmarked: true,
    isDownloaded: false,
    summary: 'Vector scalar and vector triple products, shortest distance between skew lines, plane equations, and angle bisector formulas.',
    tags: ['Vectors', '3D Geometry', 'Mathematics', 'Formulas'],
    tableOfContents: [
      { title: '1. Vector Triple Products & Identities', page: 1 },
      { title: '2. Lines in 3D & Skew Distance', page: 2 },
      { title: '3. Planes & Intersection of Planes', page: 3 }
    ],
    pages: [
      {
        pageNumber: 1,
        title: 'Vector Products & Scalar Triple Products',
        content: `
### 1.1 Vector Triple Product (VTP)
$$\\vec{a} \\times (\\vec{b} \\times \\vec{c}) = (\\vec{a} \\cdot \\vec{c}) \\vec{b} - (\\vec{a} \\cdot \\vec{b}) \\vec{c}$$
*Memory Trick: "1 3 2 minus 1 2 3"*

### 1.2 Scalar Triple Product (STP)
$$[\\vec{a} \\vec{b} \\vec{c}] = \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\begin{vmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{vmatrix}$$
* Volume of Parallelopiped with coterminous edges $\\vec{a}, \\vec{b}, \\vec{c}$: $V = |[\\vec{a} \\vec{b} \\vec{c}]|$
* Volume of Tetrahedron: $V = \\frac{1}{6} |[\\vec{a} \\vec{b} \\vec{c}]|$

### 1.3 Shortest Distance Between Skew Lines
Line 1: $\\vec{r} = \\vec{a}_1 + \\lambda \\vec{b}_1$, Line 2: $\\vec{r} = \\vec{a}_2 + \\mu \\vec{b}_2$
$$d = \\left| \\frac{(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)}{|\\vec{b}_1 \\times \\vec{b}_2|} \\right|$$
        `,
        keyFormulas: [
          'a × (b × c) = (a · c)b - (a · b)c',
          'd_skew = |(a₂ - a₁) · (b₁ × b₂) / |b₁ × b₂||',
          'V_tetrahedron = (1/6) |[a b c]|'
        ]
      }
    ]
  }
];
