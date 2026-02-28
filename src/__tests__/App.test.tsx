import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

// Mock supabase so AuthProvider doesn't try real connections
vi.mock('../lib/supabase', () => ({ supabase: null }));

// Mock ChatPage to avoid its complex dependencies
vi.mock('../components/ChatPage', () => ({
  default: vi.fn((props) => (
    <div data-testid="chat-page">
      <button onClick={props.toggleSidebar}>toggle-sidebar</button>
      <span data-testid="sidebar-state">{props.sidebarOpen ? 'open' : 'closed'}</span>
    </div>
  )),
}));

// Mock hooks
vi.mock('../hooks/useChatHistory', () => ({
  useChatHistory: vi.fn(() => ({
    conversations: [],
    activeId: null,
    setActiveId: vi.fn(),
    createConversation: vi.fn(() => 'new-id'),
    updateTitle: vi.fn(),
    deleteConversation: vi.fn(),
  })),
}));

vi.mock('../hooks/useChatHistoryDB', () => ({
  useChatHistoryDB: vi.fn(() => ({
    conversations: [],
    activeId: null,
    setActiveId: vi.fn(),
    createConversation: vi.fn(() => 'new-id'),
    updateTitle: vi.fn(),
    deleteConversation: vi.fn(),
    loaded: true,
  })),
}));

// Mock child components of the home page
vi.mock('../components/Hero', () => ({ default: () => <div data-testid="hero">Hero</div> }));
vi.mock('../components/VoiceRules', () => ({ default: () => <div data-testid="voice-rules">VoiceRules</div> }));
vi.mock('../components/ProcessingDemo', () => ({ default: () => <div data-testid="processing-demo">ProcessingDemo</div> }));
vi.mock('../components/CitationDemo', () => ({ default: () => <div data-testid="citation-demo">CitationDemo</div> }));
vi.mock('../components/ComponentShowcase', () => ({ default: () => <div data-testid="component-showcase">ComponentShowcase</div> }));
vi.mock('../components/Configurator', () => ({ default: () => <div data-testid="configurator">Configurator</div> }));
vi.mock('../components/Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

function renderApp() {
  return render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#/';
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    window.location.hash = '';
  });

  // ── Home page rendering ──
  describe('home page', () => {
    it('renders the home page when route is #/', () => {
      const { container } = renderApp();
      expect(container.querySelector('.home-page')).toBeInTheDocument();
    });

    it('renders a "Log in" button when not authenticated', () => {
      renderApp();
      expect(screen.getByLabelText('Log in')).toBeInTheDocument();
    });

    it('login button has SVG icon', () => {
      const { container } = renderApp();
      const menuBtn = container.querySelector('.chat-menu-btn');
      expect(menuBtn).toBeInTheDocument();
      expect(menuBtn.querySelector('svg')).toBeInTheDocument();
    });

    it('does not render sidebar when not authenticated', () => {
      const { container } = renderApp();
      expect(container.querySelector('.chat-sidebar')).not.toBeInTheDocument();
    });
  });

  // ── Chat route ──
  describe('chat route', () => {
    it('renders ChatPage on chat route', () => {
      window.location.hash = '#/chat';
      renderApp();
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });
  });

  describe('home page header', () => {
    it('header uses chat-header and home-header classes', () => {
      const { container } = renderApp();
      const header = container.querySelector('.chat-header.home-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('FloatingInput on home page', () => {
    it('renders FloatingInput with textarea', () => {
      renderApp();
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    it('renders attach image button', () => {
      renderApp();
      expect(screen.getByLabelText('Attach image')).toBeInTheDocument();
    });

    it('renders send button (disabled when empty)', () => {
      renderApp();
      expect(screen.getByLabelText('Send message')).toBeDisabled();
    });

    it('send button becomes enabled when text is entered', async () => {
      renderApp();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      expect(screen.getByLabelText('Send message')).not.toBeDisabled();
    });

    it('stores pending message and navigates to chat on send', async () => {
      renderApp();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      await userEvent.click(screen.getByLabelText('Send message'));
      expect(sessionStorage.getItem('cf-pending-message')).toBe('Hello');
    });

    it('sends on Enter (not Shift+Enter)', async () => {
      renderApp();
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      expect(sessionStorage.getItem('cf-pending-message')).toBe('Hello');
    });

    it('FloatingInput has chat-input-floating class', () => {
      const { container } = renderApp();
      expect(container.querySelector('.chat-input-floating')).toBeInTheDocument();
    });
  });

  describe('home page sections', () => {
    it('renders all showcase sections', () => {
      renderApp();
      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByTestId('voice-rules')).toBeInTheDocument();
      expect(screen.getByTestId('processing-demo')).toBeInTheDocument();
      expect(screen.getByTestId('citation-demo')).toBeInTheDocument();
      expect(screen.getByTestId('component-showcase')).toBeInTheDocument();
      expect(screen.getByTestId('configurator')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('skip to content', () => {
    it('renders skip-link on home page', () => {
      renderApp();
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('hash routing', () => {
    it('shows home page for empty hash', () => {
      window.location.hash = '';
      const { container } = renderApp();
      expect(container.querySelector('.home-page')).toBeInTheDocument();
    });

    it('shows chat page for #/chat', () => {
      window.location.hash = '#/chat';
      renderApp();
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });

    it('shows chat page for #/chat?new', () => {
      window.location.hash = '#/chat?new';
      renderApp();
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });
  });
});
