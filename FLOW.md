Lets configure the project to use React + Vite + Typescript just run:
`npm create vite@latest`

This will run the configuration tool ask the following questions:
Project name:  sample
Select a framework: React
Select a variant: Typescript

Now lets configure the storybook just run:
`npx storybook@latest init`

This will only ask if the user wants to configure the ESLint, just says yes(Y).

Now we have a sample project.

A nice configuration is the ability to use alias within the project so add the following configuration to the 
tsconfig.json under the compilerOptions:
~~~
"baseUrl": "./src",
"paths": {
  "@components/*": ["components/*"],
}
~~~

and withing vite.config.ts add the following configuration under configuration object:
~~~
resolve: {
  alias: [
    {
      find: '@components',
      replacement: path.join(__dirname, './src/components'),
    },
  ],
},
~~~
to work with `path` and `__dirname` is required to run:
`npm i -D @types/node`

this will make it possible to just use `import`  with `'@component/...'` to reference some component instead of use the 
dot dot notation (`../`) to navigate until get the `/src/component` folder.

storybook initialization will create a folder `stories` with sample of how to use storybook if you already used to it, 
it could be cleaned without a problem and start to use with your custom components.



For more information:
* https://storybook.js.org/docs/react
