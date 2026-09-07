import { describe, expect, it } from 'vitest';
import { hashForSlug, slugFromHash } from './hashRoute';

describe('slugFromHash', () => {
  it('reads the slug out of an Exhibit hash', () => {
    expect(slugFromHash('#/v8-engine')).toBe('v8-engine');
  });

  it('gives nothing for an empty hash', () => {
    expect(slugFromHash('')).toBeNull();
  });

  it('gives nothing for a bare hash sign', () => {
    expect(slugFromHash('#')).toBeNull();
  });

  it('gives nothing for a slash with no slug after it', () => {
    expect(slugFromHash('#/')).toBeNull();
  });

  it('gives nothing for a hash that skips the slash', () => {
    expect(slugFromHash('#v8-engine')).toBeNull();
  });

  it('gives nothing for a hash with more than one segment', () => {
    expect(slugFromHash('#/v8-engine/intake')).toBeNull();
  });
});

describe('hashForSlug', () => {
  it('writes an Exhibit slug as a hash', () => {
    expect(hashForSlug('v8-engine')).toBe('#/v8-engine');
  });

  it('round-trips through slugFromHash', () => {
    expect(slugFromHash(hashForSlug('landing-gear'))).toBe('landing-gear');
  });
});
