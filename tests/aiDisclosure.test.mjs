import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldShowAiAssistedMessage } from '../src/lib/aiDisclosure.ts';

test('shows the AI-assisted message for posts created before the toggle existed', () => {
  assert.equal(shouldShowAiAssistedMessage(undefined), true);
});

test('shows the AI-assisted message when explicitly enabled', () => {
  assert.equal(shouldShowAiAssistedMessage(true), true);
});

test('hides the AI-assisted message when explicitly disabled', () => {
  assert.equal(shouldShowAiAssistedMessage(false), false);
});
