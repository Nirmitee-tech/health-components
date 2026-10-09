import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Avatar } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';

export interface ChatMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** 'in' (received, left) | 'out' (sent, right); default 'in' */
  direction?: 'in' | 'out';
  /** Sender name, shown with an avatar on incoming messages; default none */
  author?: string;
  /** Time sent, e.g. "9:02 AM" */
  time: string;
  /** Delivery status, outgoing only ("Sent", "Read"); default none */
  status?: string;
  /** Message written by an AI agent: purple bubble and AI tag; default false */
  ai?: boolean;
  /** System event ("Henna West started a conversation"); default false */
  system?: boolean;
  /** Message text */
  children: ReactNode;
}

/** ChatMessage is one bubble in a secure message thread: incoming, outgoing, AI or system. */
export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  { direction = 'in', author, time, status, ai = false, system = false, className, children, ...rest },
  ref
) {
  const incoming = direction === 'in';
  return (
    <div ref={ref} className={cx('co-bubrow', `co-bubrow-${direction}`, className)} {...rest}>
      {incoming && author ? <Avatar name={author} size="sm" color={ai ? 'ai' : 'primary'} /> : null}
      <div className={cx('co-bub', `co-bub-${direction}`, ai && 'co-bub-ai', system && 'co-bub-sys')}>
        {author && incoming ? (
          <div className="co-bub-a">
            {author}
            {ai ? (
              <Badge tone="ai" size="sm">
                AI
              </Badge>
            ) : null}
          </div>
        ) : null}
        <div>{children}</div>
        <div className="co-bt">
          {time}
          {!incoming && status ? ` · ${status}` : ''}
        </div>
      </div>
    </div>
  );
});
