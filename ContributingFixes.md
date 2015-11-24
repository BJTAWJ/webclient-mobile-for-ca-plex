# Introduction #

We encourage submission of any fixes you have to the project code.


# Details #

In many cases, the hard work of fixing bugs is understanding them well enough to determine what the system is doing and what it should be doing. If you've reached this point in the process of filing a bug report, you may find it just as easy to fix the bug as to report it. So how do you get your fix merged back into the WebClient mobile?

The easiest way to submit patches to the toolkit is to create diffs and attach them to existing issues. This is a straightforward process.

Once your patch has been received, project committers can review and (potentially) merge your changes to fix the bug. To increase the odds that your patch will be merged, remember the following:
•your patch must conform to standard JavaScript Style Guidelines
•your patch should be created against the latest version of the tool, which you can get from a Subversion checkout of the toolkit
•All changes should be submitted in "unified diff" format. The output of subversion's diff command is usually sufficient.
•A test case should accompany any patches in order to verify that the change actually fixes the issue in question