import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Checkbox } from '../Checkbox/Checkbox';

/** One staff task. */
export interface TaskCardData {
  /** Task text ("Call back about MRI auth") */
  title: string;
  /** Patient the task is about; default none */
  patient?: string;
  /** Due text ("Today 3 PM"); default none */
  due?: string;
  /** Red border and Overdue tag; default false */
  overdue?: boolean;
  /** Initial done state; default false */
  done?: boolean;
  /** Category tag ("Prior Auth"); default none */
  tag?: string;
  /** Person who owns the task */
  owner: string;
}

export interface TaskCardProps extends HTMLAttributes<HTMLDivElement> {
  /** {title, patient?, due?, overdue?, done?, tag?, owner}; required */
  task: TaskCardData;
  /** Controlled done state; default undefined (uncontrolled, starts at `task.done`) */
  done?: boolean;
  /** Called when the done check changes */
  onDoneChange?: (done: boolean, task: TaskCardData) => void;
}

/** TaskCard is one staff task with done check, patient, due date, overdue tag, category and owner. */
export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(function TaskCard(
  { task, done, onDoneChange, className, ...rest },
  ref
) {
  const [isDone, setDone] = useControllableState(done, task.done ?? false, (next) => onDoneChange?.(next, task));
  const meta = [task.patient, task.due ? `Due ${task.due}` : null].filter(Boolean).join(' . ');
  return (
    <div ref={ref} className={cx('co-task', task.overdue && 'is-overdue', className)} {...rest}>
      <Checkbox
        label={<b>{task.title}</b>}
        checked={isDone}
        onChange={(e) => setDone(e.target.checked)}
        aria-label={`Done: ${task.title}`}
      />
      {meta ? <span className="co-mi-s">{meta}</span> : null}
      <div className="co-row co-gap-6">
        {task.overdue ? (
          <Badge tone="danger" icon="clock">
            Overdue
          </Badge>
        ) : null}
        {task.tag ? <Badge tone="info">{task.tag}</Badge> : null}
        <span className="co-ml">
          <Avatar name={task.owner} size="xs" aria-hidden="true" />
        </span>
        <span className="co-mi-s">{task.owner}</span>
      </div>
    </div>
  );
});
