We need a cross-plaform way to get the openpgp.js library.  Here, we are taking
advantage of the fact that webpack will read the `package.json`'s `browser`
field to determine which module to include.  When this directory is imported
from Node.js, it will read the `package.json`'s `main` field to determine which
module to include.

In order for this to work with the same import, then both the `browser.js` and
`node.js` modules need to export the same interface.
