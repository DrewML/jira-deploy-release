import test from 'ava';
import util from '../util';

test('Does not throw when no IDs match', t => {
    util.getJiraIds('FOO', ['commit 1', 'commit 2']);
    t.pass();
});

test('Returns expected JIRA ids matching prefix', t => {
    const doesMatch = {
        'FOO-123': 'FOO-123: Fix thing',
        'FOO-456': 'Fixes FOO-456',
        'FOO-789': 'FOO-789 - Fixes something',
        'FOO-101112': 'It works. Can close - FOO-101112',
        'foo-321': 'foo-321: fix something'
    };
    const doesNotMatch = {
        'foo 654': 'foo 654: fix something else',
        'foo_987': 'foo_987 a thing',
        'FOO 211101': 'FOO 211101: another thingy'
    };
    const all = { ...doesMatch, ...doesNotMatch };
    const values = Object.keys(all).reduce((acc, key) => {
        acc.push(all[key]);
        return acc;
    }, []);

    const parsedIds = util.getJiraIds('FOO', values);
    Object.keys(doesMatch).forEach(id => t.true(parsedIds.includes(id)));
    Object.keys(doesNotMatch).forEach(id => t.false(parsedIds.includes(id)));
});

test('promiseReflect resolves with expected values', async t => {
    const resolved = Promise.resolve('foo');
    const resolution = await util.promiseReflect(resolved);
    t.is(resolution.val, 'foo');
    t.true(resolution.resolved);

    const rejected = Promise.reject('bar');
    const rejection = await util.promiseReflect(rejected);
    t.is(rejection.val, 'bar');
    t.true(rejection.rejected);
});
