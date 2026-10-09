import { forwardRef, useState, type CSSProperties, type DragEvent, type InputHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Badge } from '../Badge/Badge';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { ProgressBar } from '../ProgressBar/ProgressBar';

export type FileUploadStatus = 'uploading' | 'done' | 'error';

/** One row of the file list. */
export interface FileUploadItem {
  /** File name, shown and used in the Remove button name */
  name: string;
  /** Size in bytes; default none */
  size?: number;
  /** 'uploading' | 'done' | 'error' */
  status: FileUploadStatus;
  /** Upload progress 0-100 while uploading; default 0 */
  progress?: number;
  /** Error text when status is 'error'; default 'Upload failed' */
  error?: string;
}

export interface FileUploadProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'title' | 'style' | 'onChange' | 'value' | 'defaultValue'
> {
  /** Field label above the zone; default none */
  label?: string;
  /** File types the picker accepts (".pdf,.jpg,.png"); default none */
  accept?: string;
  /** Allows picking several files; default false */
  multiple?: boolean;
  /** 'default' drop zone | 'photo' camera capture for insurance cards and ID; default 'default' */
  variant?: 'default' | 'photo';
  /** Controlled file list: Array<{name, size?, status: uploading|done|error, progress?, error?}>; default undefined (uncontrolled) */
  files?: FileUploadItem[];
  /** Initial file list (uncontrolled); default [] */
  defaultFiles?: FileUploadItem[];
  /** Called with the next list when files are added or removed */
  onFilesChange?: (files: FileUploadItem[]) => void;
  /** Forced drag-over state for previews; default false */
  dragging?: boolean;
  /** Forced done state (photo captured) for previews; default false */
  done?: boolean;
  /** Zone title; default 'Drag a file here or choose one' */
  title?: string;
  /** Hint under the title; default 'PDF, JPG or PNG, up to 10 MB' */
  hint?: string;
  /** Title in the done state; default 'Photo captured' */
  doneText?: string;
  /** Error message under the zone, role alert; default none */
  error?: string;
  /** Called with the picked or dropped files; default none */
  onFiles?: (files: FileList) => void;
  /** Called when a file row's Remove button is pressed; default none */
  onRemove?: (file: FileUploadItem, index: number) => void;
  /** Inline style of the root */
  style?: CSSProperties;
}

/** Formats a byte count as KB or MB. */
export function formatFileSize(bytes: number): string {
  return bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/** FileUpload is a drop zone with a file list, plus a photo variant for insurance cards and ID. */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    label,
    accept,
    multiple = false,
    variant = 'default',
    files: filesProp,
    defaultFiles = [],
    onFilesChange,
    dragging = false,
    done = false,
    title = 'Drag a file here or choose one',
    hint = 'PDF, JPG or PNG, up to 10 MB',
    doneText = 'Photo captured',
    error,
    onFiles,
    onRemove,
    required,
    disabled,
    className,
    style,
    id: idProp,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref
) {
  const id = useDomId('fu', idProp);
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useControllableState(filesProp, defaultFiles, onFilesChange);
  const drag = dragging || dragOver;
  const photo = variant === 'photo';

  const add = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const next = files.slice();
    for (let i = 0; i < list.length; i++) next.push({ name: list[i]!.name, size: list[i]!.size, status: 'done' });
    setFiles(next);
    onFiles?.(list);
  };

  const describedBy = [`${id}-hint`, error ? `${id}-err` : '', describedByProp ?? ''].filter(Boolean).join(' ');

  return (
    <div className={cx('co-field', className)} style={style}>
      {label ? (
        <span className="co-lbl" id={`${id}-l`}>
          {label}
          {required ? (
            <span className="co-req" aria-hidden="true">
              {' *'}
            </span>
          ) : null}
        </span>
      ) : null}
      <label
        className={cx('co-dz', drag && 'is-drag', photo && 'co-dz-photo', done && 'is-done', error && 'is-bad')}
        htmlFor={id}
        onDragOver={(e: DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e: DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) add(e.dataTransfer.files);
        }}
      >
        <Icon name={done ? 'check' : photo ? 'camera' : 'upload'} size={22} />
        <b id={`${id}-t`}>{done ? doneText : drag ? 'Drop to upload' : title}</b>
        <span className="co-help" id={`${id}-hint`}>
          {hint}
        </span>
        <input
          ref={ref}
          id={id}
          type="file"
          className="co-sr"
          accept={accept}
          multiple={multiple}
          capture={photo ? 'environment' : undefined}
          required={required}
          disabled={disabled}
          aria-labelledby={label ? `${id}-l ${id}-t` : `${id}-t`}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = '';
          }}
          {...rest}
        />
      </label>
      {error ? (
        <div className="co-errt" id={`${id}-err`} role="alert">
          {error}
        </div>
      ) : null}
      {files.length ? (
        <ul className="co-files" aria-label={label ? `${label} files` : 'Files'}>
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="co-file">
              <Icon name="file" size={16} />
              <span className="co-file-n">
                {f.name}
                <span className="co-mi-s">
                  {f.size ? formatFileSize(f.size) : ''}
                  {f.status === 'error' ? ` . ${f.error || 'Upload failed'}` : ''}
                </span>
              </span>
              {f.status === 'uploading' ? (
                <ProgressBar value={f.progress ?? 0} max={100} label={`Uploading ${f.name}`} compact />
              ) : f.status === 'error' ? (
                <Badge tone="danger">Failed</Badge>
              ) : (
                <Badge tone="success">Uploaded</Badge>
              )}
              <IconButton
                icon="x"
                label={`Remove ${f.name}`}
                size="sm"
                onClick={() => {
                  onRemove?.(f, i);
                  setFiles(files.filter((_, j) => j !== i));
                }}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
});
