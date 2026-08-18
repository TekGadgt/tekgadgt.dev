import assert from 'node:assert/strict';
import test from 'node:test';

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

function getGenerateButton(element) {
  return element.props.children[1];
}

test('generate key button fills an empty preview key', () => {
  let generated = '';
  const field = renderField('', (value) => {
    generated = value;
  });

  getGenerateButton(field).props.onClick();

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

    assert.equal(getGenerateButton(field).props.children, 'Generate new key');
    getGenerateButton(field).props.onClick();
    assert.equal(generated, '');

    globalThis.window.confirm = () => true;
    getGenerateButton(field).props.onClick();
    assert.match(generated, /^[A-Za-z0-9_-]{24}$/);
    assert.notEqual(generated, 'Q7mK2vN9xR4pT8zW');
  } finally {
    globalThis.window = originalWindow;
  }
});
