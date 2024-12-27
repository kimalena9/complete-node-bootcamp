const fs = require('fs');
const server = require('http').createServer();

// listening for incoming HTTP requests
// server obj listens for the 'request' event, this event is triggered whenever the server receives an HTTP req from the client
// the callback function is executed for every incoming req
server.on('request', (req, res) => {
  // // the server asynchronously reads the contents of 'test-file.txt'
  // fs.readFile('test-file.txt', (err, data) => {
  //   // if error occurs, console.log error
  //   if (err) console.log(err);
  //   // if file reading completes successfully, the contents of the file are passed to the callback's 'data' parameter
  //   // the server sends the file contents back to the client as a response using res.end(data);
  //   res.end(data);
  // });
  // opens a readable stream for 'test-file.txt', the file is read in chunks
  // const readable = fs.createReadStream('test-file.txt');
  // // the 'data' event is emitted whenever a chunk of the file is read
  // // the chunk is passed to the callback as a Buffer object
  // readable.on('data', (chunk) => {
  //   // the chunk is written to the HTTP response, the browser starts rendering the content incrementally, as each chunk arrives
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   // after the entire file has been read, the 'end' event is emitted
  //   // res.end() signals that the HTTP response is complete and the browser knows it has received the complete response and finishes rendering
  //   res.end();
  // });
  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode(500);
  //   res.end('File not found');
  // });
  // server creates a readable stream for 'test-file.txt'
  const readable = fs.createReadStream('test-file.txt');
  // .pipe() method connects the readable stream to the writable stream, making it the destination for the data
  // .pipe() method automatically handles: reading chunks from the readable stream (readable), writing chunks to the writable stream (res), managing the flow and backpressure
  // chunks of data are read from the file (test-file.txt)
  // each chunk is written to the HTTP response (res) and sent to the client immediately
  // when the file is fully read: the readable stream emits an 'end' event
  // the writable stream (res) automatically finishes the response
  readable.pipe(res);
  // readableSource.pipe(writeableDestination)
});

// sets up the HTTP server to start listening for incoming connections on a specific hort and post, when the server starts successfully it executes the callback function provided
server.listen(8000, '127.0.0.1', () => {
  console.log('listening');
});
