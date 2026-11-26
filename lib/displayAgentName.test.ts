import { test } from 'node:test';
import assert from 'node:assert/strict';
import { displayAgentName } from './agentContact';

test('displayAgentName strips emoji from Facebook names', () => {
  assert.equal(displayAgentName('Bích Ngọc🏡'), 'Bích Ngọc');
  assert.equal(displayAgentName('🔥 Phạm  Minh Tâm ❤️'), 'Phạm Minh Tâm');
  assert.equal(displayAgentName('Nguyễn Văn A 👨‍👩‍👧'), 'Nguyễn Văn A');
  assert.equal(displayAgentName('Mr.Bin_arenda'), 'Mr.Bin_arenda');
  assert.equal(displayAgentName(null), '');
});
