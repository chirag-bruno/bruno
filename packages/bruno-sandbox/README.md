# @usebruno/sandbox

A node js scripting engine for Bruno.

## Development

```bash
npm run build --workspace=packages/bruno-sandbox
npm run watch --workspace=packages/bruno-sandbox
npm run typecheck --workspace=packages/bruno-sandbox
npm test --workspace=packages/bruno-sandbox
```

Consumers resolve `dist/`, so rebuild (or run the watcher) after editing `src/` — `npm run dev` at
the repo root does not rebuild shared packages.

This is a purely human written package and we appretiate if it is maintained that way. We are not against
development using AI. We just want this to be an experiment to showcase the pros/cons of working with a non AI package
within a codebase written with the help of AI.

Having said that, the scaffolding of the package is done using AI.

## License

[MIT](LICENSE.md)
