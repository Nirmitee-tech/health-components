# ClinicalValue

ClinicalValue shows one clinical measurement with its unit, fixed precision, abnormal flag, trend and reference range, formatted by the shared CareOS.fmt rules.

**Foundation:** part of the clinical values set. Every number it shows comes from `CareOS.fmt`, so it matches every other component.

## When to use

- Any vital sign, lab result or score shown on a screen: banner, flowsheet, result inbox, chart summary, mobile.
- Inside DataTable cells, StatCards and VitalsPanel tiles.

## When not to use

- Medication doses: use DoseDisplay (different trailing-zero rule).
- Money: MoneyDisplay. Dates and ages: DateTimeClinical.
- Free-text or coded results (Positive, Detected): show text with AbnormalFlag A.

## Variants and states

| Variant | What it is |
|---|---|
| normal | Value and unit; no flag unless `showNormal`. |
| L / H | Amber value with L or H flag. |
| LL / HH | Red value with a solid critical flag that spells out Critical low or Critical high. |
| A | Abnormal without direction, passed as `flag`. |
| trend | Up, down or unchanged arrow with optional delta. |
| showMeta | Second line with range, time and source. |
| entered-in-error | Struck through, grey, unflagged, labelled. |
| sizes | sm, md (default), lg. |
| rangeContext | Outpatient, inpatient, ED, pediatric or pregnancy range from the shared registry; a lab range on the result wins. |

## Props

| Prop | Type | Default |
|---|---|---|
| `value` | number | required |
| `measure` | key of fmt.MEASURES (hr, temp, potassium...) | none |
| `loinc` | string: finds the measure if `measure` is absent | none |
| `unit` | UCUM code | measure's unit |
| `precision` | number of decimals | measure's precision |
| `refLow / refHigh` | number: lab range, overrides sample | sample range |
| `critLow / critHigh` | number | sample critical |
| `rangeContext` | 'outpatient' \| 'inpatient' \| 'ed' \| 'pediatric' \| 'pregnancy': which registry range applies | global setting, else outpatient |
| `ageYears` | number: picks the pediatric band | none |
| `flag` | 'N' \| 'L' \| 'H' \| 'LL' \| 'HH' \| 'A' \| 'AA': lab flag, overrides the computed one | computed |
| `trend / delta` | 'up' \| 'down' \| 'stable' / string | none |
| `timestamp / timeZone / source` | ISO string / IANA zone / string | none |
| `status` | 'final' \| 'preliminary' \| 'entered-in-error' | 'final' |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' |
| `showMeta / showLabel / showNormal` | boolean | false |
| `tooltip` | boolean | true |

## Usage

```jsx
<ClinicalValue measure="potassium" value={5.4} trend="up" delta="+0.6"
  timestamp="2026-10-09T13:40:00Z" timeZone="America/Chicago" source="Quest" showMeta />
```

## Accessibility

- The value, unit and flag are read as one sentence ("Potassium 5.4 mmol/L, High"); the visual parts are aria-hidden.
- The range tooltip opens on focus as well as hover.
- Flags carry letter, icon and word; colour is never the only signal.
- Trend arrows have a text equivalent (rising, falling, unchanged).

## Do and don't

- **Do:** Pass the lab range from the result when you have it.
- **Do:** Keep 37.0 °C: the trailing zero is the precision.
- **Don't:** Round in the caller and pass a string; pass `value` and let fmt round.
- **Don't:** Hide an entered-in-error result; strike it through.

## Clinical value rules

Every clinical number in CareOS goes through `CareOS.fmt`. Components never call `toFixed` or build a unit string themselves. This is what makes a potassium of 5.4 look the same in the banner, the flowsheet, the result inbox and the mobile app.

1. **Tabular figures.** Numbers use `font-variant-numeric: tabular-nums` so columns line up.
2. **Unit always shown.** Data keeps the UCUM code (`mm[Hg]`, `Cel`, `10*3/uL`); the screen shows the readable label (mmHg, °C, K/µL). A value with no unit is a bug.
3. **Precision belongs to the measure.** Each measure has one number of decimals, applied by rounding half away from zero. Lab and vital values keep trailing zeros at that precision (temperature 37.0 °C) because the precision itself carries meaning.
4. **Doses follow ISMP.** Doses are the exception to rule 3: never a trailing zero (5 mg, not 5.0 mg), always a leading zero (0.5 mg, not .5 mg), "units" never "U" or "IU", "mcg" never "µg", "mL" never "cc", commas from 1,000. Look-alike drug names use tall-man lettering (hydrOXYzine, hydrALAZINE).
5. **Flags are never colour alone.** Every flag shows a letter (N, L, H, LL, HH, A), an icon and a screen-reader word. Critical flags also show the word on screen.
6. **Critical thresholds use strict comparison.** A value flags LL only when it is below `critLow` and HH only when it is above `critHigh`. A lab that defines critical as "at or below" must send its own `flag`.
7. **The range travels with the value.** Hover or focus shows the reference range, LOINC code, time and source. When a value is converted to another unit, the range converts with it.
8. **Entered in error stays visible.** The number is struck through, greyed, never flagged and labelled "Entered in error". It is never silently removed.
9. **Negative money uses parentheses:** ($45.00). Dates are MM/DD/YYYY; times are 12-hour by default with a 24-hour option, and show the zone when one is passed.

### Precision per measure

Decimals and display unit per measure. Ranges are not in this table: every set reads them from one registry, described below.

| Measure | LOINC | Unit shown | Decimals | Paediatric note |
|---|---|---|---|---|
| Systolic BP | 8480-6 | mmHg | 0 | Age and height percentiles under 13 y |
| Diastolic BP | 8462-4 | mmHg | 0 |  |
| Heart rate | 8867-4 | bpm | 0 | Newborn 100-160 |
| Respiratory rate | 9279-1 | breaths/min | 0 | Newborn 30-60 |
| Temperature | 8310-5 | °C (°F) | 1 |  |
| SpO2 | 59408-5 | % | 0 | COPD targets set per patient |
| Weight | 29463-7 | kg (lb) | 1 | Infants under 10 kg: 2 decimals |
| Height | 8302-2 | cm (in) | 1 |  |
| BMI | 39156-5 | kg/m² | 1 | Under 20 y: BMI-for-age percentile |
| Pain score | 72514-3 | /10 | 0 | FLACC or Wong-Baker in young children |
| Glucose | 2345-7 | mg/dL (mmol/L, 1 dp) | 0 |  |
| Potassium | 2823-3 | mmol/L | 1 | Newborn upper limit about 6.0 |
| Sodium | 2951-2 | mmol/L | 0 |  |
| Creatinine | 2160-0 | mg/dL (µmol/L, 0 dp) | 2 | Much lower in children |
| eGFR | 98979-8 | mL/min/1.73m² | 0 | Not reported under 18 y by most labs |
| Hemoglobin A1c | 4548-4 | % (mmol/mol, 0 dp) | 1 |  |
| INR | 6301-6 | INR | 1 | On warfarin the target replaces the range |
| Hemoglobin | 718-7 | g/dL | 1 | Adult female 11.6-15.0 |
| WBC | 6690-2 | K/µL | 1 |  |
| Platelets | 777-3 | K/µL | 0 |  |
| LDL cholesterol | 13457-7 | mg/dL | 0 |  |
| TSH | 3016-3 | mIU/L | 2 |  |
| Troponin I, high sensitivity | 89579-7 | ng/L | 0 | Cut-off is assay specific |

The reference ranges for these measures are in the next section, Reference ranges and flags.

### Conversion factors

| Conversion | Formula | Basis |
|---|---|---|
| lb to kg | × 0.45359237 | Exact by definition |
| in to cm | × 2.54 | Exact by definition |
| °F to °C | (F − 32) × 5/9 | Exact |
| Glucose mg/dL to mmol/L | ÷ 18.016 | From molar mass 180.16 g/mol |
| Creatinine mg/dL to µmol/L | × 88.42 | From molar mass 113.12 g/mol |
| A1c % to mmol/mol | (% − 2.15) × 10.929 | IFCC master equation |

Conversion happens on the stored number, never on the rounded display. Converting 154.3 lb back and forth never drifts.

### Age display

Under 14 days in days (8 d), under 8 weeks in weeks (6 wk), under 24 months in months (9 mo), then years (47 y). Gestational age shows as 38w 4d, from weeks and days or from the EDD.

## Reference ranges and flags

Every CareOS set reads reference ranges from one registry, `CareOS.fmt.RANGES`, and flags through one function, `CareOS.fmt.flag(value, measure, {context, refLow, refHigh})`. The same value in the same context gets the same flag on the ED board, the inpatient census, the nursing flowsheet, the chart panels, the specialty screens and `ClinicalValue`. `build/probe_values.js` checks this on every build.

**Every range in the registry is a sample value, not clinical guidance.** Each entry carries `source: 'sample value, not clinical guidance'`. A deployment replaces the registry with its own reviewed ranges or, better, passes the performing lab's range on each result.

### Which range wins

1. **The lab range on the result.** `refLow` / `refHigh` passed with the value (FHIR `Observation.referenceRange`) replace the registry's reference edges in every context. Lab `critLow` / `critHigh` replace the registry's critical edges when passed; otherwise the context's critical edges still apply.
2. **The component's `rangeContext` prop.** Every complex component in the inpatient, ED, specialty and chart panel sets, and `ClinicalValue`, `ReferenceRangeBar` and `UnitToggle`, take `rangeContext`. It reaches every value inside the component. `CareOS.RangeContext.Provider` does the same for a whole subtree.
3. **The global setting.** `CareOS.setRangeContext('outpatient' | 'inpatient' | 'ed' | 'pediatric' | 'pregnancy')` sets the context for the whole app and re-renders every value. `CareOS.setRangeContext(null)` clears it.
4. **The set's default.** ED and perioperative parts default to `ed`; inpatient flow and inpatient nursing parts default to `inpatient`; `PrenatalFlowsheet` defaults to `pregnancy`. The others have no default.
5. **Outpatient adult**, when nothing above applies.

A context a measure does not define falls back to outpatient. The `ed` context therefore equals outpatient adult for every measure except temperature, where it uses the fever cut-off of 38.0 °C. The `pediatric` context picks the band by `ageYears`; with no age it uses the oldest band, so a missing age never applies an infant's range to a teenager. No set passes an age today, so pediatric bands only apply where a caller passes `ageYears` to `CareOS.fmt.flag` or `ClinicalValue`.

The precedence of the set default under the global setting is a design choice: an app that calls `setRangeContext` controls every screen, and a screen that needs a different context says so with the prop.

### Sample ranges

Reference edges, with critical edges in parentheses. A value flags L or H when it is strictly outside the reference edges and LL or HH when it is strictly outside the critical edges. Units are the measure's display unit.

| Measure key | Outpatient (default adult) | Inpatient | ED | Pediatric (age bands) | Pregnancy |
|---|---|---|---|---|---|
| `bpSys` | 90-129 (crit <70, >180) | 90-139 (crit <70, >180) | as outpatient | 1-12 y: 85-115 (crit <60, >140); 13-17 y: 90-129 (crit <70, >160) | 90-139 (crit <70, >159) |
| `bpDia` | 60-79 (crit <40, >120) | 60-89 (crit <40, >120) | as outpatient | 1-12 y: 50-75 (crit <35, >100); 13-17 y: 60-79 (crit <40, >110) | 60-89 (crit <40, >109) |
| `map` | 65-110 (crit <55, >130) | as outpatient | as outpatient | as outpatient | as outpatient |
| `hr` | 60-100 (crit <40, >150) | as outpatient | as outpatient | under 1 y: 100-160 (crit <80, >200); 1-5 y: 80-140 (crit <60, >180); 6-12 y: 70-120 (crit <50, >160); 13-17 y: 60-100 (crit <40, >150) | 60-110 (crit <40, >150) |
| `rr` | 12-20 (crit <8, >30) | as outpatient | as outpatient | under 1 y: 30-60 (crit <20, >70); 1-5 y: 24-40 (crit <16, >50); 6-12 y: 18-30 (crit <12, >40); 13-17 y: 12-20 (crit <8, >30) | as outpatient |
| `temp` | 36.1-37.2 (crit <35, >40) | 36.1-37.9 (crit <35, >40) | 36.1-37.9 (crit <35, >40) | as outpatient | as outpatient |
| `spo2` | 95-100 (crit <88) | 92-100 (crit <88) | as outpatient | as outpatient | as outpatient |
| `etco2` | 35-45 (crit <25, >60) | as outpatient | as outpatient | as outpatient | as outpatient |
| `gcs` | 15-15 (crit <9) | as outpatient | as outpatient | as outpatient | as outpatient |
| `bmi` | 18.5-24.9 | as outpatient | as outpatient | as outpatient | as outpatient |
| `pain` | 0-3 | as outpatient | as outpatient | as outpatient | as outpatient |
| `glucose` | 70-99 (crit <54, >400) | 70-180 (crit <54, >400) | as outpatient | under 1 month: 50-99 (crit <40, >300); 1 month-17 y: 70-99 (crit <54, >400) | 70-94 (crit <54, >400) |
| `potassium` | 3.5-5.1 (crit <2.8, >6.2) | as outpatient | as outpatient | under 1 month: 3.7-5.9 (crit <2.8, >7); 1 month-17 y: 3.4-4.7 (crit <2.8, >6) | as outpatient |
| `sodium` | 136-145 (crit <120, >160) | as outpatient | as outpatient | as outpatient | as outpatient |
| `chloride` | 98-107 | as outpatient | as outpatient | as outpatient | as outpatient |
| `bicarbonate` | 22-29 (crit <10, >40) | as outpatient | as outpatient | as outpatient | as outpatient |
| `bun` | 7-20 | as outpatient | as outpatient | as outpatient | as outpatient |
| `creatinine` | 0.74-1.35 | as outpatient | as outpatient | 1-5 y: 0.2-0.5; 6-12 y: 0.3-0.7; 13-17 y: 0.5-1 | 0.4-0.8 |
| `egfr` | ≥60 | as outpatient | as outpatient | as outpatient | as outpatient |
| `calcium` | 8.6-10.3 (crit <6, >13) | as outpatient | as outpatient | as outpatient | as outpatient |
| `magnesium` | 1.7-2.2 (crit <1, >4.9) | as outpatient | as outpatient | as outpatient | as outpatient |
| `a1c` | 4-5.6 | as outpatient | as outpatient | as outpatient | as outpatient |
| `ldl` | ≤99 | as outpatient | as outpatient | as outpatient | as outpatient |
| `tsh` | 0.4-4.5 | as outpatient | as outpatient | as outpatient | 0.1-2.5 |
| `alt` | 7-56 | as outpatient | as outpatient | as outpatient | as outpatient |
| `inr` | 0.8-1.1 (crit >5) | as outpatient | as outpatient | as outpatient | as outpatient |
| `hgb` | 13.2-16.6 (crit <7, >20) | as outpatient | as outpatient | 6 months-5 y: 11-14 (crit <7, >20); 6-12 y: 11.5-15.5 (crit <7, >20); 13-17 y: 12-16 (crit <7, >20) | 11-15 (crit <7, >20) |
| `wbc` | 3.4-9.6 (crit <1, >30) | as outpatient | as outpatient | 1-5 y: 5.5-15.5 (crit <1, >30); 6-17 y: 4.5-13.5 (crit <1, >30) | as outpatient |
| `anc` | ≥1.5 (crit <0.5) | as outpatient | as outpatient | as outpatient | as outpatient |
| `plt` | 135-317 (crit <20, >1000) | as outpatient | as outpatient | as outpatient | as outpatient |
| `bnp` | ≤125 | as outpatient | as outpatient | as outpatient | as outpatient |
| `trop` | ≤34 | as outpatient | as outpatient | as outpatient | as outpatient |
| `lactate` | 0.5-2.2 (crit >4) | as outpatient | as outpatient | as outpatient | as outpatient |
| `vanc` | 10-20 (crit >25) | as outpatient | as outpatient | as outpatient | as outpatient |
| `crcl` | ≥60 (crit <15) | as outpatient | as outpatient | as outpatient | as outpatient |
| `phq9` | ≤9 (crit >19) | as outpatient | as outpatient | as outpatient | as outpatient |
| `iop` | 10-21 (crit >29) | as outpatient | as outpatient | as outpatient | as outpatient |
| `dbhl` | ≤25 (crit >90) | as outpatient | as outpatient | as outpatient | as outpatient |
| `uoRate` | ≥0.5 | as outpatient | as outpatient | as outpatient | as outpatient |
| `fhr` | 110-160 (crit <100, >180) | as outpatient | as outpatient | as outpatient | as outpatient |
| `contractions` | 0-5 (crit >6) | as outpatient | as outpatient | as outpatient | as outpatient |
| `oxytocin` | ≤20 (crit >30) | as outpatient | as outpatient | as outpatient | as outpatient |
| `rom` | ≤18 (crit >24) | as outpatient | as outpatient | as outpatient | as outpatient |
| `ebl` | ≤500 (crit >1000) | as outpatient | as outpatient | as outpatient | as outpatient |

Measures for labor and delivery (`fhr`, `contractions`, `oxytocin`, `rom`, `ebl`) and some unit protocols (`uoRate`) are protocol thresholds rather than lab reference ranges. They sit in the registry so every screen flags them the same way. Some screens also apply their own protocol rules that are not reference ranges: the ESI danger-zone vitals in `TriageForm` (HR above 100, RR above 20, SpO2 below 92%), the regimen hold limits in `OncologyRegimen`, and the severe-range blood pressure alert text in `PrenatalFlowsheet`. Those are not changed by the range context.


## In this package

`CareOS.fmt`, `CareOS.RangeContext.Provider` and `CareOS.setRangeContext` above are the named exports `fmt`, `RangeContextProvider` and `setRangeContext` (plus `useRangeContext` and `withRangeContext` for your own components). See Foundations, Clinical values.
