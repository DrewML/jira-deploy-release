import test from 'ava';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

test.beforeEach(t => {
    const sandbox = sinon.sandbox.create();
    t.context = {
        sandbox,
        logStub: sandbox.stub(console, 'log'),
        exitStub: sandbox.stub(process, 'exit'),
        gitStub: ({
            getCurrentTag: sinon.stub().returns('v1.0.0'),
            getCommitMessagesInRelease: sinon.stub().returns([])
        })
    };
});

test.afterEach.always(t => {
    t.context.sandbox.restore();
});

test.serial('Exits with message when no JIRA issues are found', t => {
    const { logStub, exitStub } = t.context;
    const git = {
        getCurrentTag: sinon.stub().returns('v1.0.0'),
        getCommitMessagesInRelease: sinon.stub().returns(['Foo bar biz bazz'])
    };

    proxyquire('../cli', { './git': git });

    t.true(logStub.calledWith('No Jira issues found for release v1.0.0'));
    t.true(exitStub.calledOnce);
});

test.serial('Attempts to transition all JIRA ids', async t => {
    const { gitStub } = t.context;
    const jira = {
        doTransition: sinon.stub().returns(Promise.resolve({}))
    };
    const util = {
        getJiraIds: sinon.stub().returns(['FOO-123', 'FOO-456'])
    };

    await proxyquire('../cli', { './git': gitStub, './jira': jira, './util': util });

    t.true(jira.doTransition.calledTwice);
});

test.serial('Reports succeeded and failed transitions', async t => {
    const { logStub, gitStub } = t.context;
    const jira = {
        doTransition: sinon.stub()
    };
    const util = {
        getJiraIds: sinon.stub().returns(['FOO-123', 'FOO-456'])
    };

    jira.doTransition
        .onCall(0).returns(Promise.resolve())
        .onCall(1).returns(Promise.reject());
    await proxyquire('../cli', { './git': gitStub, './jira': jira, './util': util });

    t.true(logStub.calledWith('Succeeded updating 1 issue(s).'));
    t.true(logStub.calledWith('Failed updating 1 issue(s).'));
});
