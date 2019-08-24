# Markdown Source Import

[![Build Status](https://travis-ci.org/iamssen/markdown-source-import.svg?branch=master)](https://travis-ci.org/iamssen/markdown-source-import)
[![Coverage Status](https://coveralls.io/repos/github/iamssen/markdown-source-import/badge.svg?branch=master)](https://coveralls.io/github/iamssen/markdown-source-import?branch=master)

![Preview](http://ssen.name/markdown-source-import/preview.webp)

# Install

```sh
npm install markdown-source-import --save-dev
```

# Basic

```markdown
# Title

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

# Import Parameters

- `<!-- import **/*.test.ts -->` import multiple source files with glob pattern
- `<!-- import test.tsx --slice 40:60 -->` line slice option
- `<!-- import **/*.test.ts --title-tag h4 -->` add filename above code block

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