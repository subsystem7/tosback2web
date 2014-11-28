Web Front End
=============

This is a web front end for an [TOSBack 2 Audit API](https://docs.google.com/document/d/1IOij45-aDX7Emb1WOaWzDZGe2-NrlOYZbgk3zZ-qM8I/edit?pli=1) instance.
It is written in HTML, CSS, and Javascript, with the exception of the comparison script, which uses PHP.


Components
----------

#### index.html

Loads a list of tracked policies. Provides a form for suggesting a domain to track and allows for the download of the full audit API. 

#### detail.html

The detail page for a domain, allowing users to compare different versions of tracked policies.  An authenticated administrator can add comments, mark a 
snapshot as significant, mark a snapshot that shows no significant changes from a previous snapshot, and add [xidel](http://videlibri.sourceforge.net/xidel.html) templates that are used 
to process policy snapshots.

#### compare.php

A PHP script that uses the [HTML diff engine](http://gitorious.org/htmldiff) derived from the MediaWiki Visual Diff module http://www.mediawiki.org/wiki/Visual_Diff to
compare two files from the audit file structure 


#### suggestions.html

Admin only management of suggested policy documents.  An authenticated administrator uses this page to manage suggestions and place them
into TOSBack2 production. 


Dependencies
------------

* A [TOSBack 2 Audit API](https://docs.google.com/document/d/1IOij45-aDX7Emb1WOaWzDZGe2-NrlOYZbgk3zZ-qM8I/edit?pli=1) instance.
* An installed and running [TOSBack2 Admin](https://github.com/subsystem7/tosback2webadmin) tool.



