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
exports.analyzeProductContent = analyzeProductContent;
var openai_1 = require("@/lib/openai");
var templates_1 = require("./templates");
var openai = (0, openai_1.getOpenAIClient)();
function analyzeProductContent(metadata, context) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // If we're very confident about the sub-type, use just that template
            if (context.subConfidence >= 0.8) {
                return [2 /*return*/, analyzeSingleTemplate(metadata, context.subType)];
            }
            // If we're somewhat confident it's a review/comparison (but not which one)
            // let OpenAI decide between those two
            if (context.subConfidence >= 0.4) {
                return [2 /*return*/, analyzeDualTemplates(metadata)];
            }
            // If we're not confident it's either type, use base template
            return [2 /*return*/, analyzeBaseTemplate(metadata)];
        });
    });
}
function analyzeBaseTemplate(metadata) {
    return __awaiter(this, void 0, void 0, function () {
        var systemPrompt, userPrompt, completion, analysisContent, analysisResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    systemPrompt = "You are analyzing a YouTube video that mentions a product or service.\nExtract basic information about any products/services mentioned and their context.";
                    userPrompt = "Analyze this video:\nTitle: ".concat(metadata.title, "\nDescription: ").concat(metadata.description, "\nDuration: ").concat(metadata.duration, "\nTags: ").concat(((_a = metadata.tags) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'None', "\n\nProvide analysis in this format:\n").concat(templates_1.BASE_PRODUCT_TEMPLATE.template);
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: 'gpt-4-turbo-preview',
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: userPrompt }
                            ],
                            temperature: 0.7,
                            response_format: { type: 'json_object' }
                        })];
                case 1:
                    completion = _b.sent();
                    analysisContent = completion.choices[0].message.content;
                    if (typeof analysisContent !== 'string') {
                        throw new Error('Failed to get valid analysis content');
                    }
                    analysisResult = JSON.parse(analysisContent);
                    return [2 /*return*/, {
                            type: templates_1.BASE_PRODUCT_TEMPLATE.type,
                            confidence: 1.0,
                            data: analysisResult,
                            reasoning: 'Using base template due to low confidence in specific type'
                        }];
            }
        });
    });
}
function analyzeSingleTemplate(metadata, type) {
    return __awaiter(this, void 0, void 0, function () {
        var template, systemPrompt, userPrompt, completion, content, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    template = templates_1.PRODUCT_TEMPLATES[type];
                    systemPrompt = "You are analyzing a YouTube ".concat(type === 'single' ? 'product review' : 'comparison', " video.\nFocus on extracting detailed, structured information about the ").concat(type === 'single' ? 'product' : 'products', ".\nOnly use this format if the video is clearly a ").concat(type === 'single' ? 'dedicated review' : 'structured comparison', ".");
                    userPrompt = "Analyze this video:\nTitle: ".concat(metadata.title, "\nDescription: ").concat(metadata.description, "\nDuration: ").concat(metadata.duration, "\nTags: ").concat(((_a = metadata.tags) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'None', "\n\nProvide analysis in this format:\n").concat(template.template);
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: 'gpt-4-turbo-preview',
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: userPrompt }
                            ],
                            temperature: 0.7,
                            response_format: { type: 'json_object' }
                        })];
                case 1:
                    completion = _b.sent();
                    content = completion.choices[0].message.content;
                    if (typeof content !== 'string') {
                        throw new Error('AI response missing valid content');
                    }
                    result = JSON.parse(content);
                    return [2 /*return*/, {
                            type: template.type,
                            confidence: 1.0,
                            data: result,
                            reasoning: "Analyzed as ".concat(type, " based on high confidence detection")
                        }];
            }
        });
    });
}
function analyzeDualTemplates(metadata) {
    return __awaiter(this, void 0, void 0, function () {
        var systemPrompt, userPrompt, completion, comparisonContent, comparisonResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    systemPrompt = "You are analyzing a YouTube video that appears to be either a product review or comparison.\nChoose the most appropriate format ONLY if the video clearly fits one of these types.\nIf the video doesn't clearly fit either type, use the base product mention format instead.";
                    userPrompt = "Analyze this video:\nTitle: ".concat(metadata.title, "\nDescription: ").concat(metadata.description, "\nDuration: ").concat(metadata.duration, "\nTags: ").concat(((_a = metadata.tags) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'None', "\n\nReturn data in one of these formats:\n\nSINGLE REVIEW:\n").concat(templates_1.PRODUCT_TEMPLATES.single.template, "\n\nPRODUCT COMPARISON:\n").concat(templates_1.PRODUCT_TEMPLATES.comparison.template, "\n\nOR if neither format fits well:\n\nBASE FORMAT:\n").concat(templates_1.BASE_PRODUCT_TEMPLATE.template);
                    return [4 /*yield*/, openai.chat.completions.create({
                            model: 'gpt-4-turbo-preview',
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: userPrompt }
                            ],
                            temperature: 0.7,
                            response_format: { type: 'json_object' }
                        })];
                case 1:
                    completion = _b.sent();
                    comparisonContent = completion.choices[0].message.content;
                    if (typeof comparisonContent !== 'string') {
                        throw new Error('Comparison analysis content invalid');
                    }
                    comparisonResult = JSON.parse(comparisonContent);
                    return [2 /*return*/, {
                            type: comparisonResult.type,
                            confidence: 1.0,
                            data: comparisonResult,
                            reasoning: 'Type determined by content analysis'
                        }];
            }
        });
    });
}
