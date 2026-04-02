import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import ForgotPassword from './ForgotPassword';

jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ForgotPassword debug', () => {
  let container;
  let root;

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  const renderScreen = async () => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );
    });
  };

  it('renderiza estado de loading sem cair no fallback', async () => {
    axios.post.mockImplementation(() => new Promise(() => {}));

    await renderScreen();

    const input = container.querySelector('input[name="email"]');
    const form = container.querySelector('form');

    await act(async () => {
      input.value = 'teste@teste.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).not.toContain('Não foi possível abrir esta tela');
    expect(container.querySelector('button[type="submit"]')).toBeDisabled();
  });

  it('renderiza estado de sucesso sem cair no fallback', async () => {
    axios.post.mockResolvedValue({ data: {} });

    await renderScreen();

    const input = container.querySelector('input[name="email"]');
    const form = container.querySelector('form');

    await act(async () => {
      input.value = 'teste@teste.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent).toContain(
      'Se o e-mail existir em nossa base, enviaremos o link de redefinição em instantes.'
    );
    expect(container.textContent).not.toContain('Não foi possível abrir esta tela');
  });

  it('renderiza estado de erro sem cair no fallback', async () => {
    axios.post.mockRejectedValue({
      response: { data: { message: 'Falha controlada' } },
    });

    await renderScreen();

    const input = container.querySelector('input[name="email"]');
    const form = container.querySelector('form');

    await act(async () => {
      input.value = 'teste@teste.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Falha controlada');
    expect(container.textContent).not.toContain('Não foi possível abrir esta tela');
  });
});
