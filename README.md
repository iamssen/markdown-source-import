# Markdown Source Import

[![Build Status](https://travis-ci.org/iamssen/markdown-source-import.svg?branch=master)](https://travis-ci.org/iamssen/markdown-source-import)
[![Coverage Status](https://coveralls.io/repos/github/iamssen/markdown-source-import/badge.svg?branch=master)](https://coveralls.io/github/iamssen/markdown-source-import?branch=master)

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
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.md": [
      "markdown-source-import"
    ]
  }
}
```