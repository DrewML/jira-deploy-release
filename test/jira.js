import test from 'ava';
import url from 'url';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

function jiraWithGotStub(method, implementation) {
    return proxyquire('../jira', {
        got: { [method]: implementation }
    });
}

test('Should send auth header with provided auth string', t => {
    const stub = sinon.stub();
    const jira = jiraWithGotStub('post', stub);

    jira.doTransition({
        basicAuthString: 'abc123'
    });

    const postOpts = stub.getCall(0).args[1];
    t.is(postOpts.headers.Authorization, 'Basic abc123');
});

// JIRA API will fail on numeric transition id *sigh*
test('TransitionId should be a string, *not* a number', t => {
    const stub = sinon.stub();
    const jira = jiraWithGotStub('post', stub);

    jira.doTransition({
        transitionId: 4
    });

    const [, postOpts] = stub.getCall(0).args;
    const body = JSON.parse(postOpts.body);
    t.true(typeof body.transition === 'string');
});

test('Includes provided host and issueID in url', t => {
    const stub = sinon.stub();
    const jira = jiraWithGotStub('post', stub);

    jira.doTransition({ host: 'foo.com', issueId: 14 });

    const [uri] = stub.getCall(0).args;
    const { hostname, pathname } = url.parse(uri);
    t.is(hostname, 'foo.com');
    t.true(pathname.includes('14'));
});
