import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

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

// Mock child components of the home page
vi.mock('../components/Hero', () => ({ default: () => <div data-testid="hero">Hero</div> }));
vi.mock('../components/VoiceRules', () => ({ default: () => <div data-testid="voice-rules">VoiceRules</div> }));
vi.mock('../components/ProcessingDemo', () => ({ default: () => <div data-testid="processing-demo">ProcessingDemo</div> }));
vi.mock('../components/CitationDemo', () => ({ default: () => <div data-testid="citation-demo">CitationDemo</div> }));
vi.mock('../components/ComponentShowcase', () => ({ default: () => <div data-testid="component-showcase">ComponentShowcase</div> }));
vi.mock('../components/Configurator', () => ({ default: () => <div data-testid="configurator">Configurator</div> }));
vi.mock('../components/Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));

describe('App', () => {
  beforeEach(() => {
    window.location.hash = '#/';
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    window.location.hash = '';
  });

  // ── Commit: Replace speech bubble with hamburger menu icon on home page ──
  // ── Commit: Fix home page sidebar: push layout + visible menu button ──
  describe('home page with MenuButton (hamburger)', () => {
    it('renders the home page when route is #/', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.home-page')).toBeInTheDocument();
    });

    it('renders the hamburger menu button on home page', () => {
      render(<App />);
      expect(screen.getByLabelText('Open conversation list')).toBeInTheDocument();
    });

    it('hamburger button has 3-line SVG icon', () => {
      const { container } = render(<App />);
      const menuBtn = container.querySelector('.chat-menu-btn');
      expect(menuBtn).toBeInTheDocument();
      const lines = menuBtn.querySelectorAll('svg line');
      expect(lines.length).toBe(3);
    });

    it('toggles sidebar-open class when hamburger is clicked', async () => {
      const { container } = render(<App />);
      const menuBtn = screen.getByLabelText('Open conversation list');

      await userEvent.click(menuBtn);
      expect(container.querySelector('.home-page.sidebar-open')).toBeInTheDocument();

      // Label changes to "Close conversation list" when open
      const closeBtn = screen.getByLabelText('Close conversation list');
      await userEvent.click(closeBtn);
      expect(container.querySelector('.home-page.sidebar-open')).not.toBeInTheDocument();
    });
  });

  // ── Commit: Unify hamburger menu: always opens sidebar on both routes ──
  describe('sidebar on both routes', () => {
    it('renders ChatSidebar on home page', () => {
      const { container } = render(<App />);
      // ChatSidebar renders .chat-sidebar nav element
      expect(container.querySelector('.chat-sidebar')).toBeInTheDocument();
    });

    it('renders ChatPage (which includes sidebar) on chat route', () => {
      window.location.hash = '#/chat';
      render(<App />);
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });
  });

  describe('home page header', () => {
    it('header uses chat-header and home-header classes', () => {
      const { container } = render(<App />);
      const header = container.querySelector('.chat-header.home-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('FloatingInput on home page', () => {
    it('renders FloatingInput with textarea', () => {
      render(<App />);
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });

    it('renders attach image button', () => {
      render(<App />);
      expect(screen.getByLabelText('Attach image')).toBeInTheDocument();
    });

    it('renders send button (disabled when empty)', () => {
      render(<App />);
      expect(screen.getByLabelText('Send message')).toBeDisabled();
    });

    it('send button becomes enabled when text is entered', async () => {
      render(<App />);
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      expect(screen.getByLabelText('Send message')).not.toBeDisabled();
    });

    it('stores pending message and navigates to chat on send', async () => {
      render(<App />);
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      await userEvent.click(screen.getByLabelText('Send message'));
      expect(sessionStorage.getItem('cf-pending-message')).toBe('Hello');
    });

    it('sends on Enter (not Shift+Enter)', async () => {
      render(<App />);
      const textarea = screen.getByLabelText('Message input');
      await userEvent.type(textarea, 'Hello');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
      expect(sessionStorage.getItem('cf-pending-message')).toBe('Hello');
    });

    it('FloatingInput has chat-input-floating class', () => {
      const { container } = render(<App />);
      expect(container.querySelector('.chat-input-floating')).toBeInTheDocument();
    });
  });

  describe('home page sections', () => {
    it('renders all showcase sections', () => {
      render(<App />);
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
      render(<App />);
      const skipLink = screen.getByText('Skip to content');
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });

  describe('hash routing', () => {
    it('shows home page for empty hash', () => {
      window.location.hash = '';
      const { container } = render(<App />);
      expect(container.querySelector('.home-page')).toBeInTheDocument();
    });

    it('shows chat page for #/chat', () => {
      window.location.hash = '#/chat';
      render(<App />);
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });

    it('shows chat page for #/chat?new', () => {
      window.location.hash = '#/chat?new';
      render(<App />);
      expect(screen.getByTestId('chat-page')).toBeInTheDocument();
    });
  });
});
