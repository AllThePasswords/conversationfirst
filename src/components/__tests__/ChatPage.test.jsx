import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatPage from '../ChatPage';

// Mock hooks and child components to isolate ChatPage behavior
vi.mock('../../hooks/useChat', () => ({
  useChat: vi.fn(() => ({
    messages: [],
    isStreaming: false,
    isSearching: false,
    isUploading: false,
    streamingContent: '',
    error: null,
    sendMessage: vi.fn(),
    clearError: vi.fn(),
  })),
}));

vi.mock('../../lib/imageUpload', () => ({
  validateImage: vi.fn(() => null),
  validateImageCount: vi.fn(() => null),
}));

// We need to import useChat after mocking to get the mock reference
import { useChat } from '../../hooks/useChat';

describe('ChatPage', () => {
  let defaultProps;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.hash = '#/chat';

    // Reset useChat to default empty-state mock
    useChat.mockReturnValue({
      messages: [],
      isStreaming: false,
      isSearching: false,
      isUploading: false,
      streamingContent: '',
      error: null,
      sendMessage: vi.fn(),
      clearError: vi.fn(),
    });

    defaultProps = {
      sidebarOpen: false,
      setSidebarOpen: vi.fn(),
      toggleSidebar: vi.fn(),
      conversations: [{ id: 'conv-1', title: 'Test Chat', updatedAt: Date.now() }],
      activeId: 'conv-1',
      createConversation: vi.fn(),
      updateTitle: vi.fn(),
      onSidebarSelect: vi.fn(),
      onNewChat: vi.fn(),
    };
  });

  function renderPage(props = {}) {
    return render(<ChatPage {...defaultProps} {...props} />);
  }

  // ── Commit: Fix chat header: menu left, hide border until scroll, no empty title ──
  // ── Commit: Add chat header with title + home link in sidebar menu ──
  describe('chat header', () => {
    it('renders the chat-header element', () => {
      const { container } = renderPage();
      expect(container.querySelector('.chat-header')).toBeInTheDocument();
    });

    it('renders hamburger menu button in header', () => {
      renderPage();
      const btn = screen.getByLabelText('Open conversation list');
      expect(btn).toBeInTheDocument();
    });

    it('toggles sidebar when menu button is clicked', async () => {
      renderPage();
      await userEvent.click(screen.getByLabelText('Open conversation list'));
      expect(defaultProps.toggleSidebar).toHaveBeenCalled();
    });

    it('shows "Close conversation list" label when sidebar is open', () => {
      renderPage({ sidebarOpen: true });
      expect(screen.getByLabelText('Close conversation list')).toBeInTheDocument();
    });

    it('displays conversation title in header when messages exist', () => {
      useChat.mockReturnValue({
        messages: [{ role: 'user', content: 'Hi' }],
        isStreaming: false,
        isSearching: false,
        isUploading: false,
        streamingContent: '',
        error: null,
        sendMessage: vi.fn(),
        clearError: vi.fn(),
      });
      const { container } = renderPage();
      expect(container.querySelector('.chat-header-title')).toBeInTheDocument();
      expect(container.querySelector('.chat-header-title').textContent).toBe('Test Chat');
    });

    it('does NOT display title when messages is empty', () => {
      useChat.mockReturnValue({
        messages: [],
        isStreaming: false,
        isSearching: false,
        isUploading: false,
        streamingContent: '',
        error: null,
        sendMessage: vi.fn(),
        clearError: vi.fn(),
      });
      const { container } = renderPage();
      expect(container.querySelector('.chat-header-title')).not.toBeInTheDocument();
    });

    it('does NOT display title when conversation has no title', () => {
      useChat.mockReturnValue({
        messages: [{ role: 'user', content: 'Hi' }],
        isStreaming: false,
        isSearching: false,
        isUploading: false,
        streamingContent: '',
        error: null,
        sendMessage: vi.fn(),
        clearError: vi.fn(),
      });
      const { container } = renderPage({
        conversations: [{ id: 'conv-1', title: '', updatedAt: Date.now() }],
      });
      expect(container.querySelector('.chat-header-title')).not.toBeInTheDocument();
    });
  });

  // ── Commit: Fix header title truncation and input bar background ──
  describe('header scroll border', () => {
    it('header starts without scrolled class', () => {
      const { container } = renderPage();
      const header = container.querySelector('.chat-header');
      expect(header).not.toHaveClass('scrolled');
    });

    it('adds scrolled class when messages area scrolls past threshold', () => {
      const { container } = renderPage();
      const messagesArea = container.querySelector('.chat-messages');

      // Simulate scroll > 8px
      Object.defineProperty(messagesArea, 'scrollTop', { value: 20, writable: true });
      fireEvent.scroll(messagesArea);

      const header = container.querySelector('.chat-header');
      expect(header).toHaveClass('scrolled');
    });
  });

  // ── Commit: Unify hamburger menu: always opens sidebar on both routes ──
  describe('sidebar integration', () => {
    it('passes sidebarOpen to page wrapper class', () => {
      const { container } = renderPage({ sidebarOpen: true });
      expect(container.querySelector('.chat-page.sidebar-open')).toBeInTheDocument();
    });

    it('does not have sidebar-open class when closed', () => {
      const { container } = renderPage({ sidebarOpen: false });
      expect(container.querySelector('.chat-page.sidebar-open')).not.toBeInTheDocument();
    });
  });

  // ── Commit: Remove chat header, use floating hamburger toggle top-left ──
  // (later re-added — verifies the hamburger exists as a real button)
  describe('hamburger menu button (SVG)', () => {
    it('renders 3-line hamburger SVG icon', () => {
      const { container } = renderPage();
      const menuBtn = container.querySelector('.chat-menu-btn');
      const svg = menuBtn.querySelector('svg');
      expect(svg).toBeInTheDocument();
      // 3 lines in hamburger icon
      const lines = svg.querySelectorAll('line');
      expect(lines.length).toBe(3);
    });
  });

  describe('welcome state', () => {
    it('shows welcome screen when no messages and not streaming', () => {
      renderPage();
      expect(screen.getByText('Conversation First')).toBeInTheDocument();
    });

    it('shows suggestion buttons in welcome state', () => {
      renderPage();
      expect(screen.getByText('Write me a system prompt that follows the 7 voice rules')).toBeInTheDocument();
    });

    it('shows the 7 voice rules in welcome state', () => {
      renderPage();
      expect(screen.getByText(/Answer first/)).toBeInTheDocument();
      expect(screen.getByText(/Stop when done/)).toBeInTheDocument();
    });
  });

  describe('page-level drag and drop', () => {
    it('shows drop overlay when dragging images over the page', () => {
      const { container } = renderPage();
      const page = container.querySelector('.chat-page');

      fireEvent.dragEnter(page, { dataTransfer: { files: [] } });
      expect(screen.getByText('Drop images here')).toBeInTheDocument();
    });

    it('hides drop overlay when drag leaves', () => {
      const { container } = renderPage();
      const page = container.querySelector('.chat-page');

      fireEvent.dragEnter(page, { dataTransfer: { files: [] } });
      fireEvent.dragLeave(page, { dataTransfer: { files: [] } });
      expect(screen.queryByText('Drop images here')).not.toBeInTheDocument();
    });
  });

  describe('error display', () => {
    it('shows error alert when error exists', () => {
      useChat.mockReturnValue({
        messages: [{ role: 'user', content: 'Hi' }],
        isStreaming: false,
        isSearching: false,
        isUploading: false,
        streamingContent: '',
        error: 'Something went wrong',
        sendMessage: vi.fn(),
        clearError: vi.fn(),
      });
      renderPage();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('has dismiss button on error alert', () => {
      const clearError = vi.fn();
      useChat.mockReturnValue({
        messages: [{ role: 'user', content: 'Hi' }],
        isStreaming: false,
        isSearching: false,
        isUploading: false,
        streamingContent: '',
        error: 'Oops',
        sendMessage: vi.fn(),
        clearError,
      });
      renderPage();
      expect(screen.getByLabelText('Dismiss error')).toBeInTheDocument();
    });
  });

  describe('upload indicator', () => {
    it('shows uploading indicator when isUploading is true', () => {
      useChat.mockReturnValue({
        messages: [],
        isStreaming: false,
        isSearching: false,
        isUploading: true,
        streamingContent: '',
        error: null,
        sendMessage: vi.fn(),
        clearError: vi.fn(),
      });
      renderPage();
      expect(screen.getByText('Uploading images...')).toBeInTheDocument();
    });
  });

  describe('skip to content link', () => {
    it('renders skip-link for accessibility', () => {
      renderPage();
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink).toHaveAttribute('href', '#chat-main');
    });
  });
});
