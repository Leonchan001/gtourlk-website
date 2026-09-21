import test from 'node:test'
import assert from 'node:assert/strict'
import { labelEdge, segmentsCross, placeCaption } from '../src/data/atlasLabelLayout.js'

test('leaders end at the box edge and do not extend through labels', () => {
  const box = {left: 20, right: 60, top: 30, bottom: 50}
  assert.deepEqual(labelEdge([0, 40], box), [20, 40])
  assert.equal(labelEdge([40, 40], box), null)
  assert.equal(segmentsCross([0,0], [10,10], [0,10], [10,0]), true)
  assert.equal(segmentsCross([0,0], [10,0], [0,5], [10,5]), false)
})

test('extension caption avoids occupied text and remains within mobile frame', () => {
  const obstacle = {left: 110, right: 190, top: 50, bottom: 95}
  const [x,y] = placeCaption({anchor:[150,100], size:[70,24], bounds:[300,600], obstacles:[obstacle]})
  assert.ok(x-35 >= 14 && x+35 <= 286 && y-12 >= 14 && y+12 <= 586)
  assert.ok(y-12 >= obstacle.bottom+5 || y+12 <= obstacle.top-5 || x-35 >= obstacle.right+5 || x+35 <= obstacle.left-5)
})
