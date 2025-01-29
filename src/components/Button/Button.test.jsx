import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

const buttonAttrs = {
  'aria-label': 'Click Me!',
  type: 'button',
};

describe('Button content', () => {
  it('contains the given attributes', () => {
    render(<Button {...buttonAttrs} />);
    const name = buttonAttrs['aria-label'];
    const input = screen.getByRole('button', { name });
    expect(input.ariaLabel).toBe(buttonAttrs['aria-label']);
    expect(input.type).toBe(buttonAttrs.type);
  });

  it('contains the given children', () => {
    render(<Button>{buttonAttrs['aria-label']}</Button>);
    const name = buttonAttrs['aria-label'];
    expect(screen.getByRole('button', { name })).toBeInTheDocument();
  });

  it('contains the given className', () => {
    render(<Button {...buttonAttrs} className="bg-white" />);
    const name = buttonAttrs['aria-label'];
    expect(screen.getByRole('button', { name })).toHaveClass('bg-white');
  });
});
