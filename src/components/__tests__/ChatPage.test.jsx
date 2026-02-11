import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../context/AuthContext';
import ChatPage from '../ChatPage';

// Mock supabase so AuthProvider doesn't try real connections
vi.mock('../../lib/supabase', () => ({ supabase: null }));

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

vi.mock('../../hooks/useChatDB', () => ({
  useChatDB: vi.fn(() => ({
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
      isAuthenticated: false,
      user: null,
      session: null,
    };
  });

  function renderPage(props = {}) {
    return render(
      <AuthProvider>
        <ChatPage {...defaultProps} {...props} />
      </AuthProvider>
    );
  }

  // ── Commit: Fix chat header: menu left, hide border until scroll, no empty title ──
  // ── Commit: Add chat header with title + home link in sidebar menu ──
  describe('chat header', () => {
    it('renders the chat-header element', () => {
      const { container } = renderPage();
      expect(container.querySelector('.chat-header')).toBeInTheDocument();
    });

    it('renders back button in header for guest mode', () => {
      renderPage();
      const btn = screen.getByLabelText('Back to home');
      expect(btn).toBeInTheDocument();
    });

    it('renders hamburger menu button in header for authenticated mode', () => {
      renderPage({ isAuthenticated: true, user: { id: 'u1', email: 'test@test.com' } });
      const btn = screen.getByLabelText('Open conversation list');
      expect(btn).toBeInTheDocument();
    });

    it('toggles sidebar when menu button is clicked (authenticated)', async () => {
      renderPage({ isAuthenticated: true, user: { id: 'u1', email: 'test@test.com' } });
      await userEvent.click(screen.getByLabelText('Open conversation list'));
      expect(defaultProps.toggleSidebar).toHaveBeenCalled();
    });

    it('shows "Close conversation list" label when sidebar is open (authenticated)', () => {
      renderPage({ sidebarOpen: true, isAuthenticated: true, user: { id: 'u1', email: 'test@test.com' } });
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

  describe('header button SVG', () => {
    it('renders back arrow SVG in guest mode', () => {
      const { container } = renderPage();
      const menuBtn = container.querySelector('.chat-menu-btn');
      const svg = menuBtn.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders 3-line hamburger SVG icon in authenticated mode', () => {
      const { container } = renderPage({ isAuthenticated: true, user: { id: 'u1', email: 'test@test.com' } });
      const menuBtn = container.querySelector('.chat-menu-btn');
      const svg = menuBtn.querySelector('svg');
      expect(svg).toBeInTheDocument();
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
      expect(screen.getByText('Drop it')).toBeInTheDocument();
    });

    it('hides drop overlay when drag leaves', () => {
      const { container } = renderPage();
      const page = container.querySelector('.chat-page');

      fireEvent.dragEnter(page, { dataTransfer: { files: [] } });
      fireEvent.dragLeave(page, { dataTransfer: { files: [] } });
      expect(screen.queryByText('Drop it')).not.toBeInTheDocument();
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
