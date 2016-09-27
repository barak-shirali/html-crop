# html-crop

This library helps you crop html pages into image(jpeg, gif), compress, and submit to server.

## Options
- `key` -  Option for hot key to start cropping
  It accepts following parameters. These options will be used as key combinations.
  * ctrlKey: bool
  * shiftKey: bool
  * key: string

  For example, to set hot key as shift+F7, you can set as
  ```
  key: {
    ctrlKey: false,
    shiftKey: true,
    key: 'F7'
  }
  ```
- `serverURL` (string) - url of server to submit image
- `startButton` (bool) - indicates if you want to add start cropping button at the bottom of the screen
- `debug` (bool) - turn debug mode on/off for console logs

## Making build
- `npm run build`

This command will generate minified library into `./lib` folder.

## Working on the library
- `npm run dev`

If you run this command, it will generate unminified library in `./lib` folder and start watching the source files with webpack dev server.
Any changes made on the library source file will be automatically reflected to the dist file.

## Running demo on the repo
You can run the demo html file anywhere. Simply you can use `http-server` if you don't have servers like apache or tomcat.

- `npm install -g http-server`
- Go to project directory
- `http-server -p 5000`
- Navigate to `http://localhost:5000/demo/demo1.html` on your browser.

## Dependencies
- [html2canvas](https://github.com/niklasvh/html2canvas)
