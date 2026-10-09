import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUpload, type FileUploadItem } from './FileUpload';

const referralFiles: FileUploadItem[] = [
  { name: 'referral-bell-to-shah.pdf', size: 482000, status: 'done' },
  { name: 'echo-report.pdf', size: 2100000, status: 'uploading', progress: 62 },
  { name: 'scan-0042.heic', size: 3400000, status: 'error', error: 'HEIC is not supported. Use JPG or PNG.' },
];

const meta = {
  title: 'Basic/Inputs/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'FileUpload is a drop zone with a file list, plus a photo variant for insurance cards and ID. The whole zone is a label for a visually hidden file input, so keyboard and screen readers get the native picker. Each file row has a Remove button named with the file name.',
      },
    },
  },
  argTypes: { variant: { control: 'inline-radio', options: ['default', 'photo'] } },
  args: { label: 'Referral Letter', accept: '.pdf,.jpg,.png', onFiles: fn(), onRemove: fn() },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Showcase: Story = {
  render: () => (
    <div className="pv-grid">
      <FileUpload label="Referral Letter" defaultFiles={referralFiles} />
      <FileUpload label="Outside Records" dragging />
      <div className="co-row" style={{ alignItems: 'stretch' }}>
        <div style={{ flex: 1 }}>
          <FileUpload variant="photo" label="Front of Card" title="Take photo" />
        </div>
        <div style={{ flex: 1 }}>
          <FileUpload variant="photo" label="Back of Card" done hint="card-back.jpg" />
        </div>
      </div>
    </div>
  ),
};

export const WithFiles: Story = { args: { defaultFiles: referralFiles, multiple: true } };

export const Dragging: Story = { args: { label: 'Outside Records', dragging: true } };

export const Photo: Story = {
  args: { variant: 'photo', label: 'Front of Card', title: 'Take photo', accept: 'image/*' },
};

export const PhotoDone: Story = {
  args: { variant: 'photo', label: 'Back of Card', done: true, hint: 'card-back.jpg' },
};

export const WithError: Story = {
  args: { label: 'Signed Consent', required: true, error: 'Upload the signed consent to continue.' },
};
