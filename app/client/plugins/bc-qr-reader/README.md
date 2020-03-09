# bc-qr-reader

QR Code reader directive for AngularJS.

It uses [webcam-directive](https://github.com/jonashartmann/webcam-directive) to access the camera and [Lazarsoft QR reader](https://github.com/LazarSoft/jsqrcode) to process the QR code.

## Install

```sh
bower install --save blockchain/bc-qr-reader
```

## Demo

See it live in this [Plunker](https://embed.plnkr.co/m9dtF9llcAw7eYE94b5k/preview).

Your browser won't permit using the camera when looking at a local file, so the following won't work:
clone this repository, run `bower install` and open demo/index.html in a browser. Also note that HTTPS is required, so [this](http://embed.plnkr.co/m9dtF9llcAw7eYE94b5k/preview) won't work.

## Usage

Include `dist/bc-qr-reader.js` as well as `bower_components/webcam-directive/app/scripts/webcam.js`. Add the `webcam` and `bcQrReader` module to your application.

```html
<bc-qr-reader
  active="cameraRequested"  
  on-result="processURLfromQR"
  on-error="onError"
  camera-status="cameraIsOn"
></bc-qr-reader>
```

## Development

```sh
npm install
cd src && git clone https://github.com/blockchain/jsqrcode
```

## Update bower package

```sh
npm install
grunt dist
```
