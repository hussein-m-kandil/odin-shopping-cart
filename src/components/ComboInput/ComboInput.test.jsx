import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComboInput from './ComboInput';

// Note: Not all types has default accessible role, but 'email' has role of 'textbox'!
const fieldData = {
  id: 'email',
  type: 'email',
  label: 'Email',
  autoComplete: 'on',
  placeholder: 'example@mail.com',
};

describe('ComboInput', () => {
  it('throws if not given the "id" and "label" props', () => {
    expect(() => render(<ComboInput />)).toThrowError();
    expect(() => render(<ComboInput {...fieldData} />)).not.toThrowError();
  });
});

describe('ComboInput content', () => {
  it('contains a single input with the given label and attributes', () => {
    render(<ComboInput {...fieldData} />);
    const name = fieldData.label;
    const input = screen.getByRole('textbox', { name });
    expect(input).toBeInTheDocument();
    expect(input.type).toBe(fieldData.type);
    expect(input.placeholder).toBe(fieldData.placeholder);
    expect(input.autocomplete).toBe(fieldData.autoComplete);
  });

  it('contains the given className', () => {
    render(<ComboInput {...fieldData} className="bg-white" />);
    const name = fieldData.label;
    expect(screen.getByRole('textbox', { name })).toHaveClass('bg-white');
  });

  it('contains the given error after the input', () => {
    const error = 'Error';
    render(<ComboInput {...{ ...fieldData, error }} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
