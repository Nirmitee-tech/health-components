import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { Alert } from '../Alert/Alert';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Spinner } from '../Spinner/Spinner';

export type TelehealthCallState = 'waiting' | 'live' | 'poor';

export interface TelehealthCallFrameProps extends HTMLAttributes<HTMLDivElement> {
  /** Remote participant, e.g. "Nora Scott". Required */
  remote: string;
  /** 'waiting' (waiting room, Admit Patient) | 'live' (End Visit) | 'poor' (weak connection); default 'live' */
  state?: TelehealthCallState;
  /** Elapsed call time; default "00:00" */
  elapsed?: string;
  /** Shows the consent, location and billing note; default false */
  consent?: boolean;
  /** Patient location for the visit; default none */
  location?: string;
  /** Place of service code for the billing note; default "10" */
  pos?: string;
  /** Controlled microphone muted state; default undefined (uncontrolled) */
  muted?: boolean;
  /** Initial muted state when uncontrolled; default false */
  defaultMuted?: boolean;
  /** Called when Mute is toggled */
  onMutedChange?: (muted: boolean) => void;
  /** Controlled camera off state; default undefined (uncontrolled) */
  cameraOff?: boolean;
  /** Initial camera off state when uncontrolled; default false */
  defaultCameraOff?: boolean;
  /** Called when the camera button is toggled */
  onCameraOffChange?: (cameraOff: boolean) => void;
  /** Called when Chat is pressed; default none */
  onChat?: () => void;
  /** Called when Admit Patient is pressed (waiting state); default none */
  onAdmit?: () => void;
  /** Called when End Visit is pressed (live and poor states); default none */
  onEnd?: () => void;
}

const INK = { color: 'var(--co-toast-ink)' };

/** TelehealthCallFrame is the video visit frame: waiting room, live call, weak connection, controls and the consent and billing note. */
export const TelehealthCallFrame = forwardRef<HTMLDivElement, TelehealthCallFrameProps>(function TelehealthCallFrame(
  {
    remote,
    state = 'live',
    elapsed = '00:00',
    consent = false,
    location,
    pos = '10',
    muted: mutedProp,
    defaultMuted = false,
    onMutedChange,
    cameraOff: cameraOffProp,
    defaultCameraOff = false,
    onCameraOffChange,
    onChat,
    onAdmit,
    onEnd,
    className,
    ...rest
  },
  ref
) {
  const [muted, setMuted] = useControllableState(mutedProp, defaultMuted, onMutedChange);
  const [cameraOff, setCameraOff] = useControllableState(cameraOffProp, defaultCameraOff, onCameraOffChange);
  const waiting = state === 'waiting';
  return (
    <div ref={ref} className={cx('co-tele', className)} {...rest}>
      <div className="co-vid" role="group" aria-label={waiting ? 'Waiting room' : `Video of ${remote}`}>
        {waiting ? (
          <div className="co-dt" style={{ alignItems: 'center', ...INK }}>
            <Spinner size="lg" label="Waiting" />
            <b>{`${remote} is in the waiting room`}</b>
            <span>Joined 2 min ago . Camera on . Mic on</span>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Avatar name={remote} size="xl" aria-hidden="true" />
            <div style={{ ...INK, marginTop: 8 }}>{remote + (state === 'poor' ? ' . Weak connection' : '')}</div>
          </div>
        )}
        <div className="co-pip">You</div>
        <span className="co-timer">
          <span className="co-sr">Elapsed </span>
          {elapsed}
        </span>
        {state === 'poor' ? (
          <span className="co-netwarn" role="status">
            <Icon name="alert" size={14} /> Video paused to save bandwidth
          </span>
        ) : null}
      </div>
      <div className="co-row co-gap-8" style={{ justifyContent: 'center' }}>
        <IconButton
          icon="mic"
          label="Mute"
          variant="secondary"
          size="lg"
          aria-pressed={muted}
          onClick={() => setMuted(!muted)}
        />
        <IconButton
          icon="video"
          label="Turn camera off"
          variant="secondary"
          size="lg"
          aria-pressed={cameraOff}
          onClick={() => setCameraOff(!cameraOff)}
        />
        <IconButton icon="message" label="Chat" variant="secondary" size="lg" onClick={onChat} />
        {waiting ? (
          <Button variant="primary" size="lg" onClick={onAdmit}>
            Admit Patient
          </Button>
        ) : (
          <Button variant="danger-solid" size="lg" onClick={onEnd}>
            End Visit
          </Button>
        )}
      </div>
      {consent ? (
        <Alert tone="note">{`Consent recorded. Patient location: ${location ?? 'not recorded'}. Bill with POS ${pos} and modifier 95.`}</Alert>
      ) : null}
    </div>
  );
});
