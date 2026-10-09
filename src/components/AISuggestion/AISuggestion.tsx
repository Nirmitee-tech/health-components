import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';

export interface AISuggestionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title; also names the region; default "AI suggestion" */
  title?: string;
  /** Tag text; default "Draft, needs review" */
  source?: string;
  /** Confidence word shown on the right ("medium"); default none */
  confidence?: string;
  /** The AI-drafted content. Required. */
  children: ReactNode;
  /** Accept, Edit, Discard buttons; default none */
  actions?: ReactNode;
}

/** AISuggestion holds content drafted by AI, in the AI purple, with its source, confidence and Accept or Edit actions. */
export const AISuggestion = forwardRef<HTMLDivElement, AISuggestionProps>(function AISuggestion(
  { title = 'AI suggestion', source = 'Draft, needs review', confidence, children, actions, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('co-aibox', className)} role="region" aria-label={title} {...rest}>
      <div className="co-row co-gap-8">
        <Icon name="sparkle" size={16} />
        <b>{title}</b>
        <Badge tone="ai" size="sm">
          {source}
        </Badge>
        {confidence ? <span className="co-help co-ml">{`Confidence ${confidence}`}</span> : null}
      </div>
      <div className="co-aibox-b">{children}</div>
      {actions ? <div className="co-row co-gap-8">{actions}</div> : null}
    </div>
  );
});
