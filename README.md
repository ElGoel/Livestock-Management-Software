# template-node-express-project-ts
Template for a full back-end project using Typescript

installed dependencies:
dotenv: me permite utilizar las variables de entorno que tenga en mi archivo .env
express: framework de node que me permite crear facilmente un servidor de node
nodemon: dependencia utilizada para escuchar cambios y servir el projecto de manera automatica
cors: crea una restruncion a las solicitudes HTTP que se originen en una secuencia de comenados en el navegador
helmet: create a setting HTTP headers to secure the server

Scripts: 

build": "npx tsc",
-crea una build compilada del projecto para ejecutar en el navegador

start": "node dist/index.js",
sirve el servidor atravez del index compilado en la carpeta dist

dev": "concurrently \"npx tsc --watch\" \"nodemon -q dist/index.js\"",
ejecuta y escucha cambios en los archivos typescript y a su vez los compila en el index.js para luego servir el projecto

test": "jest",
ejecuta los test en Jest

serve:coverage": "npm run test && cd coverage/lcov-report && npx serve"
Ejecuta los test de jest, busca la carpeta donde se encuentra el renderizado de las pruebas y luego las sirve en el navegador para ser visualizadas