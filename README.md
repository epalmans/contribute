# helpwanted
Want to contribute to opensource, then you may want to start with helping out the maintainers of the packages you actually use!

`helpwanted` will scan the current directory (your project) for the dependencies specified in package.json and composer.json.
It checks their Github repositories for open issues for which community help is requested.

# Install globally

Installation via `npm`:

    npm install @epalmans/helpwanted -g

This will install `helpwanted` globally so that it may be run from the command line.

## Usage:

Simply run:

    helpwanted

For each package, it will show all the open issues since the past 4 months with label 'help wanted' assigned.

See all available options by running `helpwanted --help`.