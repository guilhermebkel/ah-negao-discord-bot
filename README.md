# Node Workers Zip

:package: Zipping lots of files fastly with help of Node.js, Streams and Multi-threading.

## Steps
1. Init zip instance
2. Adds pipe to output stream
3. Add files
4. Wait for process to finish

## TO-DO
- [ ] Understand how the zip creation works
- [ ] Create work file to make unit process of zip
- [ ] Make **init** method to create a new zip instance
- [ ] Make **file** method to add file to the processing queue
- [ ] Make **pipe** method to send zipped data to write stream
- [ ] Make **finalize** method to wait for the zip to finish
- [ ] Create **Utils** to get threads count