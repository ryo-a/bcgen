/*
chrome-headless-render-pdf
https://github.com/Szpadel/chrome-headless-render-pdf
Original Author: Szpadel

Released under the MIT license
https://spdx.org/licenses/MIT.html

This "chromepdf.js" is modified by ryo-a
*/

'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CDP = require('chrome-remote-interface');
var fs = require('fs');
var cp = require('child_process');
var net = require('net');
var commandExists = require('command-exists');

var RenderPDF = function () {
    function RenderPDF(options) {
        (0, _classCallCheck3.default)(this, RenderPDF);

        this.setOptions(options || {});
        this.chrome = null;
        this.port = Math.floor(Math.random() * 10000 + 1000);
    }

    (0, _createClass3.default)(RenderPDF, [{
        key: 'setOptions',
        value: function setOptions(options) {
            this.options = {
                printLogs: def('printLogs', false),
                printErrors: def('printErrors', true),
                chromeBinary: def('chromeBinary', null),
                noMargins: def('noMargins', false),
                landscape: def('landscape', undefined),
                includeBackground: def('includeBackground', undefined)
            };

            function def(key, defaultValue) {
                return options[key] === undefined ? defaultValue : options[key];
            }
        }
    }, {
        key: 'renderPdf',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(url, options) {
                var _this = this;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt('return', new _promise2.default(function (resolve) {
                                    CDP({ port: _this.port }, function () {
                                        var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(client) {
                                            var Page, Emulation, Animation, loaded, jsDone, pdf, buff;
                                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                                while (1) {
                                                    switch (_context3.prev = _context3.next) {
                                                        case 0:
                                                            _this.log('Opening ' + url);
                                                            Page = client.Page, Emulation = client.Emulation, Animation = client.Animation;
                                                            _context3.next = 4;
                                                            return Page.enable();

                                                        case 4:
                                                            _context3.next = 6;
                                                            return Animation.enable();

                                                        case 6:
                                                            _context3.next = 8;
                                                            return Page.navigate({ url: url });

                                                        case 8:
                                                            _context3.next = 10;
                                                            return Emulation.setVirtualTimePolicy({ policy: 'pauseIfNetworkFetchesPending', budget: 5000 });

                                                        case 10:
                                                            loaded = _this.cbToPromise(Page.loadEventFired);
                                                            jsDone = _this.cbToPromise(Emulation.virtualTimeBudgetExpired);
                                                            _context3.next = 14;
                                                            return _this.profileScope('Wait for load', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                                                                return _regenerator2.default.wrap(function _callee$(_context) {
                                                                    while (1) {
                                                                        switch (_context.prev = _context.next) {
                                                                            case 0:
                                                                                _context.next = 2;
                                                                                return loaded;

                                                                            case 2:
                                                                            case 'end':
                                                                                return _context.stop();
                                                                        }
                                                                    }
                                                                }, _callee, _this);
                                                            })));

                                                        case 14:
                                                            _context3.next = 16;
                                                            return _this.profileScope('Wait for js execution', (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                                                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                                                    while (1) {
                                                                        switch (_context2.prev = _context2.next) {
                                                                            case 0:
                                                                                _context2.next = 2;
                                                                                return jsDone;

                                                                            case 2:
                                                                            case 'end':
                                                                                return _context2.stop();
                                                                        }
                                                                    }
                                                                }, _callee2, _this);
                                                            })));

                                                        case 16:
                                                            _context3.next = 18;
                                                            return Page.printToPDF(options);

                                                        case 18:
                                                            pdf = _context3.sent;
                                                            buff = Buffer.from(pdf.data, 'base64');

                                                            client.close();
                                                            resolve(buff);

                                                        case 22:
                                                        case 'end':
                                                            return _context3.stop();
                                                    }
                                                }
                                            }, _callee3, _this);
                                        }));

                                        return function (_x3) {
                                            return _ref2.apply(this, arguments);
                                        };
                                    }());
                                }));

                            case 1:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function renderPdf(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return renderPdf;
        }()
    }, {
        key: 'generatePdfOptions',
        value: function generatePdfOptions() {
            var options = {};

            //DOCUMENT IS HERE
            //https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-printToPDF
            
            if (this.options.landscape !== undefined) {
                options.landscape = !!this.options.landscape;
            }
            
            //if (this.options.noMargins) {
                options.marginTop = 0;
                options.marginBottom = 0;
                options.marginLeft = 0;
                options.marginRight = 0;
            //}
            
             // SET PAPERSIZE TO A4
            options.paperWidth = 8.27;
            options.paperHeight = 11.7;
            
            /*
            if (this.options.includeBackground !== undefined) {
                options.printBackground = !!this.options.includeBackground;
            }
            */

            options.printBackground = true;

            return options;
        }
    }, {
        key: 'error',
        value: function error() {
            if (this.options.printErrors) {
                var _console;

                (_console = console).error.apply(_console, arguments);
            }
        }
    }, {
        key: 'log',
        value: function log() {
            if (this.options.printLogs) {
                var _console2;

                (_console2 = console).log.apply(_console2, arguments);
            }
        }
    }, {
        key: 'cbToPromise',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(cb) {
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                return _context5.abrupt('return', new _promise2.default(function (resolve) {
                                    cb(function (resp) {
                                        resolve(resp);
                                    });
                                }));

                            case 1:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function cbToPromise(_x4) {
                return _ref5.apply(this, arguments);
            }

            return cbToPromise;
        }()
    }, {
        key: 'getPerfTime',
        value: function getPerfTime(prev) {
            var time = process.hrtime(prev);
            return time[0] * 1e3 + time[1] / 1e6;
        }
    }, {
        key: 'profileScope',
        value: function () {
            var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(msg, cb) {
                var start;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                start = process.hrtime();
                                _context6.next = 3;
                                return cb();

                            case 3:
                                this.log(msg, 'took ' + Math.round(this.getPerfTime(start)) + 'ms');

                            case 4:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function profileScope(_x5, _x6) {
                return _ref6.apply(this, arguments);
            }

            return profileScope;
        }()
    }, {
        key: 'browserLog',
        value: function browserLog(type, msg) {
            var lines = msg.split('\n');
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(lines), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var line = _step.value;

                    this.log('(chrome) (' + type + ') ' + line);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'spawnChrome',
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7() {
                var _this2 = this;

                var chromeExec;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.t0 = this.options.chromeBinary;

                                if (_context7.t0) {
                                    _context7.next = 5;
                                    break;
                                }

                                _context7.next = 4;
                                return this.detectChrome();

                            case 4:
                                _context7.t0 = _context7.sent;

                            case 5:
                                chromeExec = _context7.t0;

                                this.log('Using', chromeExec);
                                this.chrome = cp.spawn(chromeExec, ['--headless', '--remote-debugging-port=' + this.port, '--disable-gpu']);
                                this.chrome.on('close', function (code) {
                                    _this2.log('Chrome stopped (' + code + ')');
                                    _this2.browserLog('out', _this2.chrome.stdout.toString());
                                    _this2.browserLog('err', _this2.chrome.stderr.toString());
                                });

                            case 9:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function spawnChrome() {
                return _ref7.apply(this, arguments);
            }

            return spawnChrome;
        }()
    }, {
        key: 'isCommandExists',
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(cmd) {
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                return _context8.abrupt('return', new _promise2.default(function (resolve, reject) {
                                    commandExists(cmd, function (err, exists) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(exists);
                                        }
                                    });
                                }));

                            case 1:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function isCommandExists(_x7) {
                return _ref8.apply(this, arguments);
            }

            return isCommandExists;
        }()
    }, {
        key: 'detectChrome',
        value: function () {
            var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9() {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return this.isCommandExists('google-chrome-unstable');

                            case 2:
                                if (!_context9.sent) {
                                    _context9.next = 4;
                                    break;
                                }

                                return _context9.abrupt('return', 'google-chrome-unstable');

                            case 4:
                                _context9.next = 6;
                                return this.isCommandExists('google-chrome-beta');

                            case 6:
                                if (!_context9.sent) {
                                    _context9.next = 8;
                                    break;
                                }

                                return _context9.abrupt('return', 'google-chrome-beta');

                            case 8:
                                _context9.next = 10;
                                return this.isCommandExists('google-stable');

                            case 10:
                                if (!_context9.sent) {
                                    _context9.next = 12;
                                    break;
                                }

                                return _context9.abrupt('return', 'google-stable');

                            case 12:
                                _context9.next = 14;
                                return this.isCommandExists('google-chrome');

                            case 14:
                                if (!_context9.sent) {
                                    _context9.next = 16;
                                    break;
                                }

                                return _context9.abrupt('return', 'google-chrome');

                            case 16:
                                _context9.next = 18;
                                return this.isCommandExists('chromium');

                            case 18:
                                if (!_context9.sent) {
                                    _context9.next = 20;
                                    break;
                                }

                                return _context9.abrupt('return', 'chromium');

                            case 20:
                                _context9.next = 22;
                                return this.isCommandExists('chrome');

                            case 22:
                                if (!_context9.sent) {
                                    _context9.next = 24;
                                    break;
                                }

                                return _context9.abrupt('return', 'chrome');

                            case 24:
                                _context9.next = 26;
                                return this.isCommandExists('/Applications/Google\ Chrome Canary.app/Contents/MacOS/Google\ Chrome');

                            case 26:
                                if (!_context9.sent) {
                                    _context9.next = 28;
                                    break;
                                }

                                return _context9.abrupt('return', '/Applications/Google\\ Chrome Canary.app/Contents/MacOS/Google\\ Chrome');

                            case 28:
                                _context9.next = 30;
                                return this.isCommandExists('/Applications/Google\ Chrome Dev.app/Contents/MacOS/Google\ Chrome');

                            case 30:
                                if (!_context9.sent) {
                                    _context9.next = 32;
                                    break;
                                }

                                return _context9.abrupt('return', '/Applications/Google\\ Chrome Dev.app/Contents/MacOS/Google\\ Chrome');

                            case 32:
                                _context9.next = 34;
                                return this.isCommandExists('/Applications/Google\ Chrome Beta.app/Contents/MacOS/Google\ Chrome');

                            case 34:
                                if (!_context9.sent) {
                                    _context9.next = 36;
                                    break;
                                }

                                return _context9.abrupt('return', '/Applications/Google\\ Chrome Beta.app/Contents/MacOS/Google\\ Chrome');

                            case 36:
                                _context9.next = 38;
                                return this.isCommandExists('/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome');

                            case 38:
                                if (!_context9.sent) {
                                    _context9.next = 40;
                                    break;
                                }

                                return _context9.abrupt('return', '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome');

                            case 40:
                                throw Error('Couldn\'t detect chrome version installed! use --chrome-binary to pass custom location');

                            case 41:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));

            function detectChrome() {
                return _ref9.apply(this, arguments);
            }

            return detectChrome;
        }()
    }, {
        key: 'killChrome',
        value: function killChrome() {
            this.chrome.kill(cp.SIGKILL);
        }
    }, {
        key: 'waitForDebugPort',
        value: function () {
            var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10() {
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                this.log('Waiting for chrome to became available');

                            case 1:
                                if (!true) {
                                    _context10.next = 15;
                                    break;
                                }

                                _context10.prev = 2;
                                _context10.next = 5;
                                return this.isPortOpen('localhost', this.port);

                            case 5:
                                this.log('Connected!');
                                return _context10.abrupt('return');

                            case 9:
                                _context10.prev = 9;
                                _context10.t0 = _context10['catch'](2);
                                _context10.next = 13;
                                return this.wait(10);

                            case 13:
                                _context10.next = 1;
                                break;

                            case 15:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this, [[2, 9]]);
            }));

            function waitForDebugPort() {
                return _ref10.apply(this, arguments);
            }

            return waitForDebugPort;
        }()
    }, {
        key: 'isPortOpen',
        value: function () {
            var _ref11 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee11(host, port) {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:
                                return _context11.abrupt('return', new _promise2.default(function (resolve, reject) {
                                    var connection = new net.Socket();
                                    connection.connect({ host: host, port: port });
                                    connection.on('connect', function () {
                                        connection.end();
                                        resolve();
                                    });
                                    connection.on('error', function () {
                                        reject();
                                    });
                                }));

                            case 1:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function isPortOpen(_x8, _x9) {
                return _ref11.apply(this, arguments);
            }

            return isPortOpen;
        }()
    }, {
        key: 'wait',
        value: function () {
            var _ref12 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee12(ms) {
                return _regenerator2.default.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:
                                return _context12.abrupt('return', new _promise2.default(function (resolve) {
                                    setTimeout(resolve, ms);
                                }));

                            case 1:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this);
            }));

            function wait(_x10) {
                return _ref12.apply(this, arguments);
            }

            return wait;
        }()
    }], [{
        key: 'generateSinglePdf',
        value: function () {
            var _ref13 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee13(url, filename, options) {
                var renderer, buff;
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                renderer = new RenderPDF(options);
                                _context13.next = 3;
                                return renderer.spawnChrome();

                            case 3:
                                _context13.next = 5;
                                return renderer.waitForDebugPort();

                            case 5:
                                _context13.prev = 5;
                                _context13.next = 8;
                                return renderer.renderPdf(url, renderer.generatePdfOptions());

                            case 8:
                                buff = _context13.sent;

                                fs.writeFileSync(filename, buff);
                                renderer.log('Saved ' + filename);
                                _context13.next = 16;
                                break;

                            case 13:
                                _context13.prev = 13;
                                _context13.t0 = _context13['catch'](5);

                                renderer.error('error:', _context13.t0);

                            case 16:
                                renderer.killChrome();

                            case 17:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[5, 13]]);
            }));

            function generateSinglePdf(_x11, _x12, _x13) {
                return _ref13.apply(this, arguments);
            }

            return generateSinglePdf;
        }()
    }, {
        key: 'generatePdfBuffer',
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee14(url, options) {
                var renderer;
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                renderer = new RenderPDF(options);
                                _context14.next = 3;
                                return renderer.spawnChrome();

                            case 3:
                                _context14.next = 5;
                                return renderer.waitForDebugPort();

                            case 5:
                                _context14.prev = 5;
                                return _context14.abrupt('return', renderer.renderPdf(url, renderer.generatePdfOptions()));

                            case 9:
                                _context14.prev = 9;
                                _context14.t0 = _context14['catch'](5);

                                renderer.error('error:', _context14.t0);

                            case 12:
                                _context14.prev = 12;

                                renderer.killChrome();
                                return _context14.finish(12);

                            case 15:
                            case 'end':
                                return _context14.stop();
                        }
                    }
                }, _callee14, this, [[5, 9, 12, 15]]);
            }));

            function generatePdfBuffer(_x14, _x15) {
                return _ref14.apply(this, arguments);
            }

            return generatePdfBuffer;
        }()
    }, {
        key: 'generateMultiplePdf',
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee15(pairs, options) {
                var renderer, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, job, buff;

                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                renderer = new RenderPDF(options);
                                _context15.next = 3;
                                return renderer.spawnChrome();

                            case 3:
                                _context15.next = 5;
                                return renderer.waitForDebugPort();

                            case 5:
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context15.prev = 8;
                                _iterator2 = (0, _getIterator3.default)(pairs);

                            case 10:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context15.next = 26;
                                    break;
                                }

                                job = _step2.value;
                                _context15.prev = 12;
                                _context15.next = 15;
                                return renderer.renderPdf(job.url, renderer.generatePdfOptions());

                            case 15:
                                buff = _context15.sent;

                                fs.writeFileSync(job.pdf, buff);
                                renderer.log('Saved ' + job.pdf);
                                _context15.next = 23;
                                break;

                            case 20:
                                _context15.prev = 20;
                                _context15.t0 = _context15['catch'](12);

                                renderer.error('error:', _context15.t0);

                            case 23:
                                _iteratorNormalCompletion2 = true;
                                _context15.next = 10;
                                break;

                            case 26:
                                _context15.next = 32;
                                break;

                            case 28:
                                _context15.prev = 28;
                                _context15.t1 = _context15['catch'](8);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context15.t1;

                            case 32:
                                _context15.prev = 32;
                                _context15.prev = 33;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 35:
                                _context15.prev = 35;

                                if (!_didIteratorError2) {
                                    _context15.next = 38;
                                    break;
                                }

                                throw _iteratorError2;

                            case 38:
                                return _context15.finish(35);

                            case 39:
                                return _context15.finish(32);

                            case 40:
                                renderer.killChrome();

                            case 41:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this, [[8, 28, 32, 40], [12, 20], [33,, 35, 39]]);
            }));

            function generateMultiplePdf(_x16, _x17) {
                return _ref15.apply(this, arguments);
            }

            return generateMultiplePdf;
        }()
    }]);
    return RenderPDF;
}();

module.exports = RenderPDF;
module.exports.default = RenderPDF;