# WHO daily growth references

The CSVs contain `gender,day,l,m,s`, with `M` for boys and `F` for girls.
Both indicators cover every integer day from 0 through 1856, inclusive.
L, M and S values are extracted without rounding from the official WHO expanded
z-score workbooks for boys and girls, downloaded on 2026-10-10:

- [Length/height-for-age](https://www.who.int/tools/child-growth-standards/standards/length-height-for-age)
- [Weight-for-age](https://www.who.int/tools/child-growth-standards/standards/weight-for-age)

Regenerate both files with `python scripts/download-who-paeds.py`.
The script validates column names and complete daily coverage before writing.

The utility computes `z = ((x / M)^L - 1) / (L * S)` (or `ln(x / M) / S`
when L is zero), then returns `100 * Phi(z)`, where Phi is the standard normal
CDF. Height/length is in centimetres; weight is in kilograms.
Age is calculated from date of birth to the supplied visit date. Missing or
invalid visit dates return `null`; the current date is never used as a fallback.

The WHO height reference uses recumbent length through day 730 and standing
height from day 731; measurements must match that convention. See the
[WHO expanded-table instructions](https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/instructions-en.pdf?sfvrsn=5cec8c61_23).
No age extrapolation or measurement-position correction is applied.
