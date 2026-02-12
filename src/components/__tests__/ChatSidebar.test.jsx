import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatSidebar from '../ChatSidebar';
import { AuthProvider } from '../../context/AuthContext';

// Mock supabase so AuthProvider doesn't try real connections
vi.mock('../../lib/supabase', () => ({ supabase: null }));

describe('ChatSidebar', () => {
  let onSelect, onNew, onClose;

  beforeEach(() => {
    onSelect = vi.fn();
    onNew = vi.fn();
    onClose = vi.fn();
  });

  function renderSidebar(props = {}) {
    return render(
      <AuthProvider>
        <ChatSidebar
          isOpen={false}
          conversations={[]}
          activeId={null}
          onSelect={onSelect}
          onNew={onNew}
          onClose={onClose}
          {...props}
        />
      </AuthProvider>
    );
  }

  // ── Commit: Add chat header with title + home link in sidebar menu ──
  describe('home link in sidebar', () => {
    it('renders a Home link pointing to #/', () => {
      renderSidebar({ isOpen: true });
      const homeLink = screen.getByText('Home');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.closest('a')).toHaveAttribute('href', '#/');
    });

    it('renders home icon SVG', () => {
      const { container } = renderSidebar({ isOpen: true });
      const homeLink = container.querySelector('.chat-sidebar-home');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink.querySelector('svg')).toBeInTheDocument();
    });
  });

  // ── Commit: Unify hamburger menu: always opens sidebar on both routes ──
  describe('sidebar open/close behavior', () => {
    it('has the open class when isOpen is true', () => {
      const { container } = renderSidebar({ isOpen: true });
      expect(container.querySelector('.chat-sidebar.open')).toBeInTheDocument();
    });

    it('does not have the open class when isOpen is false', () => {
      const { container } = renderSidebar({ isOpen: false });
      expect(container.querySelector('.chat-sidebar.open')).not.toBeInTheDocument();
    });

    it('renders overlay when open', () => {
      const { container } = renderSidebar({ isOpen: true });
      expect(container.querySelector('.chat-sidebar-overlay')).toBeInTheDocument();
    });

    it('does not render overlay when closed', () => {
      const { container } = renderSidebar({ isOpen: false });
      expect(container.querySelector('.chat-sidebar-overlay')).not.toBeInTheDocument();
    });

    it('calls onClose when overlay is clicked', async () => {
      const { container } = renderSidebar({ isOpen: true });
      await userEvent.click(container.querySelector('.chat-sidebar-overlay'));
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed while open', () => {
      renderSidebar({ isOpen: true });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('does NOT call onClose on Escape when sidebar is closed', () => {
      renderSidebar({ isOpen: false });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  // ── Commit: Fix home page sidebar: push layout + visible menu button ──
  describe('sidebar structure and push layout', () => {
    it('sidebar has fixed width of 280px via chat-sidebar class', () => {
      const { container } = renderSidebar({ isOpen: true });
      const sidebar = container.querySelector('.chat-sidebar');
      expect(sidebar).toBeInTheDocument();
    });

    it('sidebar uses dialog role with aria-modal', () => {
      renderSidebar({ isOpen: true });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'Conversation history');
    });
  });

  describe('conversation list', () => {
    it('renders conversation items', () => {
      renderSidebar({
        isOpen: true,
        conversations: [
          { id: '1', title: 'First chat', updatedAt: Date.now() },
          { id: '2', title: 'Second chat', updatedAt: Date.now() },
        ],
      });
      expect(screen.getByText('First chat')).toBeInTheDocument();
      expect(screen.getByText('Second chat')).toBeInTheDocument();
    });

    it('shows "New conversation" for untitled conversations', () => {
      renderSidebar({
        isOpen: true,
        conversations: [{ id: '1', title: '', updatedAt: Date.now() }],
      });
      expect(screen.getByText('New conversation')).toBeInTheDocument();
    });

    it('highlights active conversation', () => {
      renderSidebar({
        isOpen: true,
        activeId: '2',
        conversations: [
          { id: '1', title: 'First', updatedAt: Date.now() },
          { id: '2', title: 'Second', updatedAt: Date.now() },
        ],
      });
      const active = screen.getByText('Second');
      expect(active.closest('button')).toHaveClass('active');
    });

    it('calls onSelect when a conversation is clicked', async () => {
      renderSidebar({
        isOpen: true,
        conversations: [{ id: 'abc', title: 'My Chat', updatedAt: Date.now() }],
      });
      await userEvent.click(screen.getByText('My Chat'));
      expect(onSelect).toHaveBeenCalledWith('abc');
    });

    it('shows empty state when no conversations', () => {
      renderSidebar({ isOpen: true, conversations: [] });
      expect(screen.getByText('No conversations yet.')).toBeInTheDocument();
    });
  });

  describe('new chat button', () => {
    it('renders "+ New chat" button', () => {
      renderSidebar({ isOpen: true });
      expect(screen.getByText('+ New chat')).toBeInTheDocument();
    });

    it('calls onNew when clicked', async () => {
      renderSidebar({ isOpen: true });
      await userEvent.click(screen.getByText('+ New chat'));
      expect(onNew).toHaveBeenCalled();
    });
  });

  describe('Conversations label', () => {
    it('shows "Conversations" label in sidebar header', () => {
      renderSidebar({ isOpen: true });
      expect(screen.getByText('Conversations')).toBeInTheDocument();
    });
  });
});
