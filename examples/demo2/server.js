const Koa = require('koa');
const path = require('path');
const chokidar = require('chokidar');
const app = new Koa();
const mockMiddleware = require('../../lib');

// app.get('/', function (req, res) {
//   res.send('test with curl example: curl -vs http://127.0.0.1:3000/api/user ');
// });

const mockFile = path.resolve(__dirname, './entry.js');
app.use(
  mockMiddleware(require(mockFile), function (type, msg) {
    console.log(type, msg);
  }),
);

chokidar.watch(mockFile).on('all', (event, path) => {
  try {
    delete require.cache[require.resolve(mockFile)];
    mockMiddleware.refresh(require(mockFile));
    console.log('refresh...');
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000);
console.log('server listen on http://127.0.0.1:3000/');
