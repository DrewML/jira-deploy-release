import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

test.beforeEach(t => {
    const sandbox = sinon.sandbox.create();
    t.context = {
        sandbox,
        logStub: sandbox.stub(console, 'log'),
        exitStub: sandbox.stub(process, 'exit')
    };
});

test.afterEach.always(t => {
    t.context.sandbox.restore();
});

test('Exits with message when no JIRA issues are found', t => {
    const { logStub, exitStub } = t.context;
    const git = {
        getCurrentTag: sinon.stub().returns('v1.0.0'),
        getCommitMessagesInRelease: sinon.stub().returns(['Foo bar biz bazz'])
    };

    proxyquire('../cli', { './git': git });

    t.true(logStub.calledWith('No Jira issues found for release v1.0.0'));
    t.true(exitStub.calledOnce);
});

test('Attempts to transition all JIRA ids', async t => {
    const git = {
        getCurrentTag: sinon.stub().returns('v1.0.0'),
        getCommitMessagesInRelease: sinon.stub().returns([])
    };
    const jira = {
        doTransition: sinon.stub().returns(Promise.resolve({}))
    };
    const util = {
        getJiraIds: sinon.stub().returns(['FOO-123', 'FOO-456'])
    };

    await proxyquire('../cli', { './git': git, './jira': jira, './util': util });

    t.true(jira.doTransition.calledTwice);
});
