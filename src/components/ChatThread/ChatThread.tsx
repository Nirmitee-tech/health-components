import { forwardRef, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Avatar } from '../Avatar/Avatar';
import { ChatMessage, type ChatMessageProps } from '../ChatMessage/ChatMessage';
import { IconButton } from '../IconButton/IconButton';

/** One message in a thread: ChatMessage props plus its text. */
export interface ChatThreadMessage extends Pick<ChatMessageProps, 'direction' | 'author' | 'status' | 'ai' | 'system'> {
  /** Stable id (React key); default the index */
  id?: string | number;
  /** Time sent, e.g. "9:02 AM" */
  time: string;
  /** Message text */
  text: ReactNode;
}

export interface ChatThreadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Array<ChatMessage props & {text}> (controlled; pair with onMessagesChange); default uncontrolled */
  messages?: ChatThreadMessage[];
  /** Initial messages (uncontrolled); the thread appends what the user sends; default [] */
  defaultMessages?: ChatThreadMessage[];
  /** Called with the new list after a send; default none */
  onMessagesChange?: (messages: ChatThreadMessage[]) => void;
  /** Header name (patient or colleague), with an avatar; default none (no header) */
  title?: string;
  /** Header second line (MRN, reply time); default none */
  subtitle?: ReactNode;
  /** Composer placeholder; default "Write a message" */
  placeholder?: string;
  /** Shows the "Suggest a reply with AI" button; default false */
  ai?: boolean;
  /** Replaces the composer with a lock banner; default false */
  readOnly?: boolean;
  /** Lock banner text; default "Read-only preview. Sending is blocked for staff." */
  lockText?: ReactNode;
  /** (text) => void: called with the trimmed text when the user sends; default none */
  onSend?: (text: string) => void;
  /** Called by the AI button; never sends on its own; default none */
  onSuggest?: () => void;
}

/** ChatThread is a full secure-message conversation: header, message log and composer with optional AI reply suggestion. */
export const ChatThread = forwardRef<HTMLDivElement, ChatThreadProps>(function ChatThread(
  {
    messages,
    defaultMessages = [],
    onMessagesChange,
    title,
    subtitle,
    placeholder = 'Write a message',
    ai = false,
    readOnly = false,
    lockText = 'Read-only preview. Sending is blocked for staff.',
    onSend,
    onSuggest,
    className,
    id,
    ...rest
  },
  ref
) {
  const [msgs, setMsgs] = useControllableState(messages, defaultMessages, onMessagesChange);
  const [txt, setTxt] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = txt.trim();
    if (!text) return;
    setMsgs([...msgs, { direction: 'out', text, time: 'Now', status: 'Sent' }]);
    setTxt('');
    onSend?.(text);
  };

  return (
    <div ref={ref} id={id} className={cx('co-thread', className)} {...rest}>
      {title ? (
        <div className="co-thread-h">
          <Avatar name={title} size="sm" />
          <div>
            <b>{title}</b>
            {subtitle ? <div className="co-mi-s">{subtitle}</div> : null}
          </div>
        </div>
      ) : null}
      <div
        className="co-thread-b"
        role="log"
        aria-label={title ? `Messages with ${title}` : 'Messages'}
      >
        {msgs.map((m, i) => (
          <ChatMessage
            key={m.id != null ? `id-${m.id}` : `i-${i}`}
            direction={m.direction}
            author={m.author}
            time={m.time}
            status={m.status}
            ai={m.ai}
            system={m.system}
          >
            {m.text}
          </ChatMessage>
        ))}
      </div>
      {readOnly ? (
        <Alert tone="lock">{lockText}</Alert>
      ) : (
        <form className="co-thread-f" onSubmit={submit}>
          <input
            className="co-inp"
            placeholder={placeholder}
            aria-label="Message"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
          />
          {ai ? <IconButton icon="sparkle" label="Suggest a reply with AI" variant="secondary" onClick={onSuggest} /> : null}
          <IconButton icon="send" label="Send" variant="primary" type="submit" />
        </form>
      )}
    </div>
  );
});
