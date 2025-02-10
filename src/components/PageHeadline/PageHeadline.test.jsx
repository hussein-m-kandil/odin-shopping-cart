import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import PageHeadline from './PageHeadline';
import { render, screen } from '@testing-library/react';

describe('PageHeadline', () => {
  it('has the given text in `h2` if `TagName` is not given', () => {
    const name = 'Test Text';
    render(<PageHeadline>{name}</PageHeadline>);
    const headline = screen.getByRole('heading', { name });
    expect(headline).toBeInTheDocument();
    expect(headline.tagName.toLowerCase()).toBe('h2');
  });

  it('has the given `TagName`', () => {
    const TagName = 'h3';
    render(<PageHeadline TagName={TagName}>Test</PageHeadline>);
    expect(screen.getByRole('heading').tagName.toLowerCase()).toBe(TagName);
  });

  it('has the given className', () => {
    const className = 'test class name';
    render(<PageHeadline className={className}>Test</PageHeadline>);
    const headline = screen.getByRole('heading');
    expect(headline.className).toBe(className);
  });
});
