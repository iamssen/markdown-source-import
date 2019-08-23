# Markdown Source Import

[![Build Status](https://travis-ci.org/iamssen/markdown-source-import.svg?branch=master)](https://travis-ci.org/iamssen/markdown-source-import)
[![Coverage Status](https://coveralls.io/repos/github/iamssen/markdown-source-import/badge.svg?branch=master)](https://coveralls.io/github/iamssen/markdown-source-import?branch=master)

![Preview](https://raw.githubusercontent.com/iamssen/markdown-source-import/master/preview.webp)

# Install

```sh
npm install markdown-source-import --save-dev
```

# Basic

```markdown
<!-- import __stories__/test.stories.tsx -->
<!-- importend -->
```

Add comment to markdown documents.

```sh
npx markdown-source-import file.md
npx markdown-source-import file1.md file2.md file3.md 
npx markdown-source-import ./**/*.md
```

Execute `markdown-source-import [file]` command.

# Git Hook

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "markdown-source-import \"{,!(node_modules)/**/}*.md\" --git-add"
    }
  }
}
```

Add `markdown-source-import \"{,!(node_modules)/**/}*.md\" --git-add` command in `pre-commit` hook.

> The `"{,!(node_modules)/**/}*.md"` glob pattern will process all `*.md` files except `node_modules` directory.
> (eg. `"{,!(dir1|dir2|dir3)/**/}*.md"`)