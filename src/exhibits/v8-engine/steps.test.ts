import { describe, expect, it } from 'vitest';
import { STEPS } from './steps';

const sentenceCount = (text: string) => text.split(/[.!?](?:\s|$)/).filter((s) => s.trim()).length;

describe('the V8 Steps', () => {
  it('tell the story in order: parts, then the four strokes', () => {
    expect(STEPS.map((step) => step.id)).toEqual(['parts', 'intake', 'compression', 'power', 'exhaust']);
  });

  it.each(STEPS.map((step) => [step.id, step]))('%s has a caption of at most two sentences', (_, step) => {
    expect(sentenceCount(step.caption)).toBeLessThanOrEqual(2);
  });

  it.each(STEPS.map((step) => [step.id, step]))('%s plays for a short fixed time', (_, step) => {
    expect(step.duration).toBeGreaterThan(0);
    expect(step.duration).toBeLessThanOrEqual(10);
  });

  it('gives every Step its own camera pose', () => {
    const poses = new Set(STEPS.map((step) => JSON.stringify(step.camera)));
    expect(poses.size).toBe(STEPS.length);
  });

  it('says on the power Step that it is the only stroke that makes power', () => {
    const power = STEPS.find((step) => step.id === 'power');
    expect(power?.caption).toMatch(/only (one|stroke)[^.]*power/);
  });
});
