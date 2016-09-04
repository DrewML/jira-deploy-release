import test from 'ava';
import proxyquire from 'proxyquire';

test.afterEach(() => {
    delete process.env.JIRA_PROJECT;
    delete process.env.JIRA_HOST;
    delete process.env.JIRA_AUTH;
    delete process.env.JIRA_TRANSITION;
});

test('Respects environment vars', t => {
    const optsFn = require('../opts');
    const proj = process.env.JIRA_PROJECT = 'foo';
    const host = process.env.JIRA_HOST = 'bar';
    const auth = process.env.JIRA_AUTH = 'bizz';
    const transition = process.env.JIRA_TRANSITION = 'buzz';

    const opts = optsFn();
    t.is(opts.proj, proj);
    t.is(opts.host, host);
    t.is(opts.auth, auth);
    t.is(opts.transition, transition);
});

test('Respects CLI opts', t => {
    const proj = 'lol';
    const host = 'wee';
    const auth = 'something';
    const transition = 'outofideas';

    const optsFn = proxyquire('../opts', {
        minimist: () => ({ proj, host, auth, transition })
    });

    const opts = optsFn();
    t.is(opts.proj, proj);
    t.is(opts.host, host);
    t.is(opts.auth, auth);
    t.is(opts.transition, transition);
});

test('Favors CLI over env vars', t => {
    const projArg = 'lol';
    process.env.JIRA_PROJECT = 'notlol';

    const optsFn = proxyquire('../opts', {
        minimist: () => ({ proj: projArg })
    });

    t.is(optsFn().proj, projArg);
});
