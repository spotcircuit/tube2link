"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUrl = testUrl;
var product_1 = require("../lib/video/analysis/templates/product");
var youtube_1 = require("../lib/youtube");
function testUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var videoId, videoInfo, metadata, contexts, _i, contexts_1, context, result, error_1;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    _w.trys.push([0, 6, , 7]);
                    videoId = (_a = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)) === null || _a === void 0 ? void 0 : _a[1];
                    if (!videoId) {
                        console.error('Could not extract video ID from URL:', url);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, youtube_1.getVideoInfo)(videoId)];
                case 1:
                    videoInfo = _w.sent();
                    if (!videoInfo) {
                        console.error('Video not found:', videoId);
                        return [2 /*return*/];
                    }
                    metadata = {
                        videoId: videoId,
                        title: ((_b = videoInfo.snippet) === null || _b === void 0 ? void 0 : _b.title) || '',
                        description: ((_c = videoInfo.snippet) === null || _c === void 0 ? void 0 : _c.description) || '',
                        channelTitle: ((_d = videoInfo.snippet) === null || _d === void 0 ? void 0 : _d.channelTitle) || '',
                        publishedAt: ((_e = videoInfo.snippet) === null || _e === void 0 ? void 0 : _e.publishedAt) || '',
                        duration: ((_f = videoInfo.contentDetails) === null || _f === void 0 ? void 0 : _f.duration) || '',
                        thumbnails: {
                            default: ((_j = (_h = (_g = videoInfo.snippet) === null || _g === void 0 ? void 0 : _g.thumbnails) === null || _h === void 0 ? void 0 : _h.default) === null || _j === void 0 ? void 0 : _j.url) || '',
                            high: ((_m = (_l = (_k = videoInfo.snippet) === null || _k === void 0 ? void 0 : _k.thumbnails) === null || _l === void 0 ? void 0 : _l.high) === null || _m === void 0 ? void 0 : _m.url) || '',
                            maxres: ((_q = (_p = (_o = videoInfo.snippet) === null || _o === void 0 ? void 0 : _o.thumbnails) === null || _p === void 0 ? void 0 : _p.maxres) === null || _q === void 0 ? void 0 : _q.url) || ''
                        },
                        tags: ((_r = videoInfo.snippet) === null || _r === void 0 ? void 0 : _r.tags) || [],
                        category: ((_s = videoInfo.snippet) === null || _s === void 0 ? void 0 : _s.categoryId) || '',
                        metrics: {
                            viewCount: Number((_t = videoInfo.statistics) === null || _t === void 0 ? void 0 : _t.viewCount) || 0,
                            likeCount: Number((_u = videoInfo.statistics) === null || _u === void 0 ? void 0 : _u.likeCount) || 0,
                            commentCount: Number((_v = videoInfo.statistics) === null || _v === void 0 ? void 0 : _v.commentCount) || 0
                        }
                    };
                    contexts = [
                        {
                            primaryType: 'product',
                            primaryConfidence: 0.9,
                            subType: 'single',
                            subConfidence: 0.9 // Should use single template
                        },
                        {
                            primaryType: 'product',
                            primaryConfidence: 0.9,
                            subType: 'comparison',
                            subConfidence: 0.9 // Should use comparison template
                        },
                        {
                            primaryType: 'product',
                            primaryConfidence: 0.9,
                            subType: 'single',
                            subConfidence: 0.5 // Should let OpenAI decide
                        }
                    ];
                    console.log('\n=== Video Info ===');
                    console.log('Title:', metadata.title);
                    console.log('Channel:', metadata.channelTitle);
                    console.log('Duration:', metadata.duration);
                    console.log('Tags:', metadata.tags.join(', '));
                    _i = 0, contexts_1 = contexts;
                    _w.label = 2;
                case 2:
                    if (!(_i < contexts_1.length)) return [3 /*break*/, 5];
                    context = contexts_1[_i];
                    console.log("\n=== Testing with confidence ".concat(context.subConfidence, " ==="));
                    return [4 /*yield*/, (0, product_1.analyzeProductContent)(metadata, context)];
                case 3:
                    result = _w.sent();
                    console.log(JSON.stringify(result, null, 2));
                    _w.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _w.sent();
                    console.error('Error analyzing video:', error_1);
                    if (error_1 instanceof Error) {
                        console.error(error_1.stack);
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// If run directly, process command line argument
if (require.main === module) {
    var url = process.argv[2];
    if (!url) {
        console.error('Please provide a YouTube URL');
        process.exit(1);
    }
    testUrl(url).catch(console.error);
}
