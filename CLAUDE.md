# Working on this repo

- Commit and push straight to `main`. No pull requests and no feature branches:
  the owner wants every change on the preview right away, and asks for an undo
  (`git revert`, then push) when something is wrong.
- Preview: GitHub Pages builds `main` to https://dolevifr.github.io/future-gen/
  about a minute after each push. It runs Jekyll, which skips everything that
  starts with `_`; `_config.yml` leaves out the other internal files.
- The real site (future-gen.co.il) is on Netlify, and the owner uploads it by
  hand. A push does not change it.
- README.md (Hebrew) documents the site, its tools and its conventions. Read the
  relevant section before editing.
- A new internal file at the root needs a line in `_redirects` (hidden on
  Netlify) and in `_config.yml` (left out of Pages).
