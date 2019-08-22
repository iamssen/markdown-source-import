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
    "./**/*.md": [
      "markdown-source-import"
    ]
  }
}
```