/*global QUnit */
'use strict';

// решение с промисом (нужен полифил для IE)
function asyncForeachPromise(array, fn, cb) {
  if (typeof fn !== 'function') throw 'fn is not a function';
  if (typeof cb !== 'function') throw 'cb is not a function';
  [].reduce.call(array, function(res, el, ix) {
    return res.then(function() {
      return new Promise(function(resolve) {
        fn(el, ix, resolve);
      });
    });
  }, Promise.resolve()).then(cb);
}

// решение с рекурсией
function asyncForeach(array, fn, cb) {
  if (typeof fn !== 'function') throw 'fn is not a function';
  if (typeof cb !== 'function') throw 'cb is not a function';
  var index = 0;
  (function doit(arr) {
    if (arr.length === 0) return cb();
    fn(arr[0], index++, function() {
      doit([].slice.call(arr, 1));
    });
  })(array);
}

// использование из задания
asyncForeach([1, 2, 3], function(item, index, done) {
  setTimeout(function() {
    console.log(item);
    done();
  }, 1000);
}, function() {
  console.log('end');
});

// тестирование asyncForeach
QUnit.module('asyncForeach');
QUnit.test('main test', function(assert) {

  var array,
    endtest;

  assert.expect(11);
  array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(el) {
    return {value: el, test: assert.async()};
  });
  endtest = assert.async();

  asyncForeach(array, function(item, index, done) {
    setTimeout(function() {
      assert.ok(item.value === index, 'test resumed from async operation ' + index);
      item.test();
      done();
    }, 100);
  }, function() {
    assert.ok(true, 'test resumed from end of async operations');
    endtest();
  });
});
QUnit.test('test blank array', function(assert) {

  var endtest = assert.async();
  asyncForeach([], function() {
    assert.ok(false, 'test resumed from element of blank array');
  }, function() {
    assert.ok(true, 'test resumed from end of blank array');
    endtest();
  });
});
QUnit.test('throw errors when fn and cb is not a function', function(assert) {

  assert.throws(function() {
    asyncForeach([1, 2], 'fn', function() {});
  }, 'fn is not a function');
  assert.throws(function() {
    asyncForeach([1, 2], function() {}, 'cb');
  }, 'cb is not a function');
});

// тестирование asyncForeachPromise
QUnit.module('asyncForeachPromise');
QUnit.test('main test', function(assert) {

  var array,
    endtest;

  assert.expect(11);
  array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(el) {
    return {value: el, test: assert.async()};
  });
  endtest = assert.async();

  asyncForeachPromise(array, function(item, index, done) {
    setTimeout(function() {
      assert.ok(item.value === index, 'test resumed from async operation ' + index);
      item.test();
      done();
    }, 100);
  }, function() {
    assert.ok(true, 'test resumed from end of async operations');
    endtest();
  });
});
QUnit.test('test blank array', function(assert) {

  var endtest = assert.async();
  asyncForeachPromise([], function() {
    assert.ok(false, 'test resumed from element of blank array');
  }, function() {
    assert.ok(true, 'test resumed from end of blank array');
    endtest();
  });
});
QUnit.test('throw errors when fn and cb is not a function', function(assert) {

  assert.throws(function() {
    asyncForeachPromise([1, 2], 'fn', function() {});
  }, 'fn is not a function');
  assert.throws(function() {
    asyncForeachPromise([1, 2], function() {}, 'cb');
  }, 'cb is not a function');
});
