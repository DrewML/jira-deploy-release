# JIRA Deploy Release

[![Build Status](https://travis-ci.org/DrewML/jira-deploy-release.svg?branch=master)](https://travis-ci.org/DrewML/jira-deploy-release)

Automatically transition JIRA issues found in Git commit messages to a specified state. Can be used to easily remove a manual step in your Continuous Delivery process.

## Install

```shell
npm install --save-dev jira-deploy-release
```

## Requirements

- A version of `node.js` >= `6.0.0`
- `Git` must be installed and available on `$PATH`

## Usage

### Authorization

At this time, this package only supports using [Basic Authentication](https://developer.atlassian.com/jiradev/jira-apis/jira-rest-apis/jira-rest-api-tutorials/jira-rest-api-example-basic-authentication) when using the JIRA API.

The `JIRA_AUTH` environment variable, or the `--auth` argument expect a string that is a JIRA username and password, in the format `user:pass`, that has been base64 encoded.

### With Environment Variables

```shell
export JIRA_HOST='jira.myhost.com'
export JIRA_PROJECT='MYPROJ'
export JIRA_AUTH='UdjcldaXR3aHky=='
export JIRA_TRANSITION='4'

$ jira-deploy-release
```

### With Command Line Arguments

```shell
$ jira-deploy-release --proj=MYPROJ --host=jira.myhost.com --auth='UdjcldaXR3aHky==' --transition=4
```

## TODO:

- Allow configuration and enabling/disabling of message posted on issue
- Unit test `git` module
