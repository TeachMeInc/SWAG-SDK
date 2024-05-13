# SWAG SDK

## For Game Developers

Please refer to the [documentation](https://teachmeinc.github.io/SWAG-SDK/) for more details.

## For Project Maintainers

SWAG SDK's documentation is powered by [VitePress](https://vitepress.dev/). The documentation project can be found at `/platforms/docs`.

### Running the documentation project locally

From the project root, run:
```
npm run docs:dev
```

### Building the documentation project

From the project root, run:
```
npm run docs:build
```

### Deploying the project

1. Make sure you are on the `main` branch
2. Run the build command from the project root; `npm run docs:build`
3. Commit your changes and push to `main`. The updated page will automatically be deployed via GitHub Actions.

Please see https://vitepress.dev/guide/deploy for more information on deployments.
