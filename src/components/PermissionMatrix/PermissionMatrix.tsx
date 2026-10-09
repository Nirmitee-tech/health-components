import type { HTMLAttributes } from "react";
import { cx } from "../../internal/cx";
import { useControllableState } from "../../internal/hooks";
import { Badge, type BadgeProps, type BadgeTone } from "../Badge/Badge";
import type { IconName } from "../Icon/Icon";
import { Switch } from "../Switch/Switch";

/** RBAC levels from the screens: None hidden, View locked, Edit create and change, Approve sign off. */
export type PermissionLevel = "none" | "view" | "edit" | "approve";

/** Label, tone, icon and meaning of each level, in order. */
export const permissionLevels: Record<
  PermissionLevel,
  { label: string; tone: BadgeTone; icon: IconName; meaning: string }
> = {
  none: { label: "None", tone: "neutral", icon: "x", meaning: "hidden" },
  view: { label: "View", tone: "info", icon: "eye", meaning: "locked" },
  edit: {
    label: "Edit",
    tone: "success",
    icon: "check",
    meaning: "create and change",
  },
  approve: {
    label: "Approve",
    tone: "ai",
    icon: "shield",
    meaning: "sign off",
  },
};

const LEVEL_KEYS = Object.keys(permissionLevels) as PermissionLevel[];

/** One action row of the matrix. */
export interface PermissionRow {
  /** Module the action belongs to ("Schedule", "Billing"); consecutive rows of one module are grouped */
  module: string;
  /** Action name ("Sign visit notes") */
  action: string;
  /** Level per role name; a missing role reads as 'none' */
  levels: Partial<Record<string, PermissionLevel>>;
}

export interface LevelTagProps extends Omit<
  BadgeProps,
  "tone" | "icon" | "children"
> {
  /** 'none' | 'view' | 'edit' | 'approve'; default 'none' */
  level?: PermissionLevel;
}

/** LevelTag is the Badge for one permission level: its own icon and word, so the level reads without colour. */
export function LevelTag({ level = "none", ...rest }: LevelTagProps) {
  const l = permissionLevels[level] ?? permissionLevels.none;
  return (
    <Badge tone={l.tone} icon={l.icon} {...rest}>
      {l.label}
    </Badge>
  );
}

export interface PermissionMatrixProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Role names, one column each (1 to 3 recommended); required */
  roles: string[];
  /** Rows (controlled): Array<{module, action, levels: Record<role, none|view|edit|approve>}>; default uncontrolled */
  rows?: PermissionRow[];
  /** Initial rows (uncontrolled); default [] */
  defaultRows?: PermissionRow[];
  /** Called with all rows after a level is edited; default none */
  onRowsChange?: (rows: PermissionRow[]) => void;
  /** A select per cell instead of level tags; default false */
  editable?: boolean;
  /** Hides rows where every role has the same level (controlled); default uncontrolled */
  onlyDifferences?: boolean;
  /** Initial "Only show differences" state (uncontrolled); default false */
  defaultOnlyDifferences?: boolean;
  /** Called when "Only show differences" is switched; default none */
  onOnlyDifferencesChange?: (on: boolean) => void;
  /** Called with the edited row (as it was before the edit), the role and the new level; default none */
  onChange?: (row: PermissionRow, role: string, level: PermissionLevel) => void;
  /** Table caption for screen readers; default "Permissions by role" */
  caption?: string;
}

/** PermissionMatrix is the role-by-action grid from Compare roles and Roles and Permissions, showing None, View, Edit or Approve for each role. */
export function PermissionMatrix({
  roles,
  rows: rowsProp,
  defaultRows = [],
  onRowsChange,
  editable = false,
  onlyDifferences,
  defaultOnlyDifferences = false,
  onOnlyDifferencesChange,
  onChange,
  caption = "Permissions by role",
  className,
  ...rest
}: PermissionMatrixProps) {
  const [rows, setRows] = useControllableState(
    rowsProp,
    defaultRows,
    onRowsChange,
  );
  const [only, setOnly] = useControllableState(
    onlyDifferences,
    defaultOnlyDifferences,
    onOnlyDifferencesChange,
  );
  const levelOf = (r: PermissionRow, role: string): PermissionLevel =>
    r.levels[role] ?? "none";
  const shown = only
    ? rows.filter((r) => {
        const v = roles.map((ro) => levelOf(r, ro));
        return v.some((x) => x !== v[0]);
      })
    : rows;

  const setLevel = (r: PermissionRow, role: string, level: PermissionLevel) => {
    const idx = rows.indexOf(r);
    if (idx < 0) return;
    const next = rows.slice();
    next[idx] = { ...r, levels: { ...r.levels, [role]: level } };
    setRows(next);
    onChange?.(r, role, level);
  };

  let mod: string | null = null;
  return (
    <div className={cx("co-dt", className)} {...rest}>
      <div className="co-row co-gap-8">
        <Switch
          label="Only show differences"
          checked={only}
          onChange={setOnly}
        />
        <div className="co-legend co-ml">
          {LEVEL_KEYS.map((k) => (
            <span key={k}>
              <LevelTag level={k} /> {permissionLevels[k].meaning}
            </span>
          ))}
        </div>
      </div>
      <div className="co-tbx">
        <table className="co-table">
          <caption className="co-sr">{caption}</caption>
          <thead>
            <tr>
              <th className="co-th-plain" scope="col">
                Module
              </th>
              <th className="co-th-plain" scope="col">
                Action
              </th>
              {roles.map((r) => (
                <th key={r} className="co-th-plain" scope="col">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.length ? (
              shown.map((r, i) => {
                const first = r.module !== mod;
                mod = r.module;
                return (
                  <tr key={`${r.module}-${r.action}-${i}`}>
                    <td>{first ? <b>{r.module}</b> : null}</td>
                    <th scope="row" className="co-th-plain co-pm-act">
                      {r.action}
                    </th>
                    {roles.map((ro) => {
                      const lv = levelOf(r, ro);
                      return (
                        <td key={ro}>
                          {editable ? (
                            <select
                              className="co-inp co-inp-sm co-pm-sel"
                              aria-label={`${r.action} for ${ro}`}
                              value={lv}
                              onChange={(e) =>
                                setLevel(
                                  r,
                                  ro,
                                  e.target.value as PermissionLevel,
                                )
                              }
                            >
                              {LEVEL_KEYS.map((k) => (
                                <option key={k} value={k}>
                                  {permissionLevels[k].label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <LevelTag level={lv} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={roles.length + 2} className="co-td-empty">
                  These roles have the same level on every action.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
