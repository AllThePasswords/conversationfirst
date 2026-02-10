import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '../ChatInput';

// Mock imageUpload validators
vi.mock('../../lib/imageUpload', () => ({
  validateImage: vi.fn(() => null),
  validateImageCount: vi.fn(() => null),
}));

describe('ChatInput', () => {
  let onSend, onAddImages, onRemoveImage;

  beforeEach(() => {
    onSend = vi.fn();
    onAddImages = vi.fn();
    onRemoveImage = vi.fn();
  });

  function renderInput(props = {}) {
    return render(
      <ChatInput
        onSend={onSend}
        disabled={false}
        stagedImages={[]}
        onAddImages={onAddImages}
        onRemoveImage={onRemoveImage}
        {...props}
      />
    );
  }

  // ── Commit: Remove gradient pseudo-element from chat input bar ──
  // ── Commit: Fix chat input: z-index over gradient overlay ──
  describe('input bar structure', () => {
    it('renders the chat-input-bar wrapper', () => {
      const { container } = renderInput();
      expect(container.querySelector('.chat-input-bar')).toBeInTheDocument();
    });

    it('renders the chat-input-inner container', () => {
      const { container } = renderInput();
      expect(container.querySelector('.chat-input-inner')).toBeInTheDocument();
    });

    it('renders textarea with placeholder', () => {
      renderInput();
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    it('renders attach button with aria-label', () => {
      renderInput();
      expect(screen.getByLabelText('Attach image')).toBeInTheDocument();
    });

    it('renders send button with aria-label', () => {
      renderInput();
      expect(screen.getByLabelText('Send message')).toBeInTheDocument();
    });

    it('has hidden file input for image attachment', () => {
      const { container } = renderInput();
      const fileInput = container.querySelector('input[type="file"]');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput.style.display).toBe('none');
      expect(fileInput.getAttribute('accept')).toBe('image/jpeg,image/png,image/gif,image/webp');
    });
  });

  describe('send behavior', () => {
    it('send button is disabled when textarea is empty', () => {
      renderInput();
      expect(screen.getByLabelText('Send message')).toBeDisabled();
    });

    it('send button is enabled when text is entered', async () => {
      renderInput();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      expect(screen.getByLabelText('Send message')).not.toBeDisabled();
    });

    it('calls onSend with text when send button is clicked', async () => {
      renderInput();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello world');
      await userEvent.click(screen.getByLabelText('Send message'));
      expect(onSend).toHaveBeenCalledWith('Hello world', []);
    });

    it('clears textarea after sending', async () => {
      renderInput();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello world');
      await userEvent.click(screen.getByLabelText('Send message'));
      expect(textarea.value).toBe('');
    });

    it('sends on Enter key (without Shift)', async () => {
      renderInput();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      expect(onSend).toHaveBeenCalledWith('Hello', []);
    });

    it('does NOT send on Shift+Enter (allows newline)', async () => {
      renderInput();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
      expect(onSend).not.toHaveBeenCalled();
    });

    it('does not send when disabled', async () => {
      renderInput({ disabled: true });
      const textarea = screen.getByLabelText('Message input');
      // Manually set value since disabled textarea won't accept input
      fireEvent.change(textarea, { target: { value: 'Hello' } });
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      expect(onSend).not.toHaveBeenCalled();
    });
  });

  describe('send with staged images (no text required)', () => {
    it('send button is enabled when images are staged even without text', () => {
      renderInput({
        stagedImages: [{ id: 1, file: new File(['x'], 'img.png', { type: 'image/png' }), preview: 'blob:1' }],
      });
      expect(screen.getByLabelText('Send message')).not.toBeDisabled();
    });

    it('calls onSend with image files when sent', async () => {
      const file = new File(['x'], 'img.png', { type: 'image/png' });
      renderInput({
        stagedImages: [{ id: 1, file, preview: 'blob:1' }],
      });
      await userEvent.click(screen.getByLabelText('Send message'));
      expect(onSend).toHaveBeenCalledWith('', [file]);
    });
  });

  describe('image thumbnails', () => {
    it('shows thumbnail strip when images are staged', () => {
      renderInput({
        stagedImages: [
          { id: 1, file: new File(['x'], 'a.png', { type: 'image/png' }), preview: 'blob:a' },
          { id: 2, file: new File(['y'], 'b.png', { type: 'image/png' }), preview: 'blob:b' },
        ],
      });
      expect(screen.getByLabelText('Attached images')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('calls onRemoveImage when remove button is clicked', async () => {
      renderInput({
        stagedImages: [
          { id: 42, file: new File(['x'], 'a.png', { type: 'image/png' }), preview: 'blob:a' },
        ],
      });
      await userEvent.click(screen.getByLabelText('Remove image 1'));
      expect(onRemoveImage).toHaveBeenCalledWith(42);
    });

    it('does not show thumbnail strip when no images', () => {
      renderInput({ stagedImages: [] });
      expect(screen.queryByLabelText('Attached images')).not.toBeInTheDocument();
    });
  });

  describe('drag and drop on input', () => {
    it('adds dragging class on dragEnter and removes on dragLeave', () => {
      const { container } = renderInput();
      const inner = container.querySelector('.chat-input-inner');

      fireEvent.dragEnter(inner, { dataTransfer: { files: [] } });
      expect(inner).toHaveClass('dragging');

      fireEvent.dragLeave(inner, { dataTransfer: { files: [] } });
      expect(inner).not.toHaveClass('dragging');
    });

    it('calls onAddImages when image files are dropped on input', () => {
      const { container } = renderInput();
      const inner = container.querySelector('.chat-input-inner');
      const file = new File(['img'], 'photo.png', { type: 'image/png' });

      fireEvent.drop(inner, {
        dataTransfer: { files: [file] },
      });
      expect(onAddImages).toHaveBeenCalledWith([file]);
    });

    it('filters out non-image files on drop', () => {
      const { container } = renderInput();
      const inner = container.querySelector('.chat-input-inner');
      const textFile = new File(['txt'], 'doc.txt', { type: 'text/plain' });

      fireEvent.drop(inner, {
        dataTransfer: { files: [textFile] },
      });
      expect(onAddImages).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    it('disables textarea when disabled prop is true', () => {
      renderInput({ disabled: true });
      expect(screen.getByLabelText('Message input')).toBeDisabled();
    });

    it('disables attach button when disabled', () => {
      renderInput({ disabled: true });
      expect(screen.getByLabelText('Attach image')).toBeDisabled();
    });
  });
});
