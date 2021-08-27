# Angular Dynamic Settings Example

This is an example project show how to use dynamic settings in an Angular project.

Instead of having `environment.staging.ts` and `environment.prod.ts` and rebuilding for every environment, you can just inject the a javascript file that will set `window.$environment` at page load, and then export that object at `environment.ts`:

```typescript
export const environment = (window as any).$environment;
```

This is done by first creating the directory `src/config` and adding the javascript file `environment.js` that will set the `window.$environment` object:

```javascript
window.$environment = {
    production: false,
};
```

Changing `angular.json` to copy the `src/config` directory to the output directory and removing the file replacement directive:

```json
...
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
    // "outputPath" is just "dist"
    "outputPath": "dist",
    "index": "src/index.html",
    "main": "src/main.ts",
    "polyfills": "src/polyfills.ts",
    "tsConfig": "tsconfig.app.json",
    "assets": [
      "src/favicon.ico",
      "src/assets",
      // add the following
      "src/config"
    ],
    "styles": [
      "src/styles.css"
    ],
    "scripts": []
  },
    "configurations": {
      "production": {
        "budgets": [
          {
            "type": "initial",
            "maximumWarning": "500kb",
            "maximumError": "1mb"
          },
          {
            "type": "anyComponentStyle",
            "maximumWarning": "2kb",
            "maximumError": "4kb"
          }
        ],
        // "fileReplacements" is removed
        "outputHashing": "all"
      },
...
```

Removing `src/environemnts/environment.prod.ts`:

```sh
rm src/environemnts/environment.prod.ts
```

And loading `environment.js` in `index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MyApp</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <script src="config/environment.js"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

Now you can just mount another `environment.js` into `${app root}/config/environment.js` using `docker run -v ...` or, with kubernetes, mount a configmap into `${app root}/config`.