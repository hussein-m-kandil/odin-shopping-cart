import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('has heading', () => {
    render(<Footer />);
    expect(
      screen.getByRole('heading', { name: /Get.+app/i }),
    ).toBeInTheDocument();
  });

  it('has form with an input and a button', () => {
    render(<Footer />);
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByRole('form')).toContainElement(
      screen.getByRole('textbox'),
    );
    expect(screen.getByRole('form')).toContainElement(
      screen.getByRole('button'),
    );
  });
});
