/*
 * `fmt`: one formatting and data model for every clinical number (CareOS.fmt).
 * Components never call toFixed or build a unit string themselves; they render what fmt returns.
 * Every member is also exported by name from src/clinical.
 */
import { age, ageLong, ageParts, date, dateTime, gestational, time } from './dates';
import { dose, doseNumber, TALL_MAN, tallMan } from './dose';
import { CODE_SYSTEMS, code, deaValid, ID_TYPES, identifier, npiValid } from './identifiers';
import { MEASURES, measure } from './measures';
import { money } from './money';
import { useRangeContext, withRangeContext } from './RangeContext';
import {
  FLAGS,
  RANGE_CONTEXTS,
  RANGES,
  flag,
  getRangeContext,
  onRangeContext,
  range,
  rangeFor,
  rangeKey,
  resolveContext,
  setRangeContext,
} from './ranges';
import { CONVERSIONS, convert, number, round, unitLabel } from './units';

/** The clinical formatting namespace, with the same member names as CareOS.fmt. */
export const fmt = {
  MEASURES,
  FLAGS,
  CONVERSIONS,
  TALL_MAN,
  CODE_SYSTEMS,
  ID_TYPES,
  measure,
  unitLabel,
  RANGES,
  RANGE_CONTEXTS,
  rangeFor,
  rangeKey,
  setRangeContext,
  getRangeContext,
  onRangeContext,
  resolveContext,
  number,
  round,
  flag,
  range,
  convert,
  tallMan,
  dose,
  doseNumber,
  date,
  time,
  dateTime,
  age,
  ageLong,
  ageParts,
  gestational,
  identifier,
  npiValid,
  deaValid,
  code,
  money,
  useRangeContext,
  withRangeContext,
} as const;

/** Type of the `fmt` namespace. */
export type Fmt = typeof fmt;
