import assert from 'node:assert/strict';
import test from 'node:test';

import { ActionButton } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { TextField } from '@keystar/ui/text-field';
import keystaticConfig from '../keystatic.config.ts';

const previewKeyField = keystaticConfig.collections.posts.schema.previewKey;

function renderField(value, onChange) {
  return previewKeyField.Input({
    value,
    onChange,
    autoFocus: false,
    forceValidation: false,
  });
}

function getPreviewKeyInput(element) {
  return element.props.children[0];
}

function getGenerateButton(element) {
  return element.props.children[1];
}

test('uses Keystar controls in the same inline layout as the slug field', () => {
  const field = renderField('', () => {});
  const input = getPreviewKeyInput(field);
  const button = getGenerateButton(field);

  assert.equal(field.type, Flex);
  assert.equal(field.props.gap, 'regular');
  assert.equal(field.props.alignItems, 'end');
  assert.equal(input.type, TextField);
  assert.equal(input.props.flex, 1);
  assert.equal(button.type, ActionButton);
});

test('generate key button fills an empty preview key', () => {
  let generated = '';
  const field = renderField('', (value) => {
    generated = value;
  });

  getGenerateButton(field).props.onPress();

  assert.match(generated, /^[A-Za-z0-9_-]{24}$/);
  assert.equal(getGenerateButton(field).props.children, 'Generate key');
});

test('regenerating a key requires confirmation', () => {
  const originalWindow = globalThis.window;
  let generated = '';
  globalThis.window = { confirm: () => false };

  try {
    const field = renderField('Q7mK2vN9xR4pT8zW', (value) => {
      generated = value;
    });

    assert.equal(getGenerateButton(field).props.children, 'Regenerate key');
    getGenerateButton(field).props.onPress();
    assert.equal(generated, '');

    globalThis.window.confirm = () => true;
    getGenerateButton(field).props.onPress();
    assert.match(generated, /^[A-Za-z0-9_-]{24}$/);
    assert.notEqual(generated, 'Q7mK2vN9xR4pT8zW');
  } finally {
    globalThis.window = originalWindow;
  }
});
