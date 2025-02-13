"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_TEMPLATES = exports.BASE_PRODUCT_TEMPLATE = void 0;
// Base template for when we can't confidently determine specific type
exports.BASE_PRODUCT_TEMPLATE = {
    type: 'product_mention',
    signals: [
        'mentions product',
        'discusses service',
        'references brand',
        'talks about item'
    ],
    template: "{\n    \"type\": \"product_mention\",\n    \"products\": [\n      {\n        \"name\": \"Product/service name\",\n        \"context\": \"How it's mentioned\",\n        \"sentiment\": \"positive|negative|neutral\",\n        \"details\": {\n          \"price\": \"If mentioned\",\n          \"category\": \"Type of product/service\",\n          \"notes\": \"Additional context\"\n        }\n      }\n    ],\n    \"mainPoints\": [\n      \"Key points about the product/service\"\n    ]\n  }"
};
// Specific templates with stricter criteria
exports.PRODUCT_TEMPLATES = {
    single: {
        type: 'single_review',
        signals: [
            'dedicated review video',
            'in-depth product analysis',
            'clear review structure',
            'testing/evaluation focus',
            'specific product deep-dive'
        ],
        template: "{\n      \"type\": \"single_review\",\n      \"productDetails\": {\n        \"name\": \"Full product name\",\n        \"category\": \"Category\",\n        \"price\": \"Price if mentioned\",\n        \"specs\": {}\n      },\n      \"keyFeatures\": [\n        {\n          \"feature\": \"Feature name\",\n          \"rating\": 0.0 to 5.0,\n          \"comments\": \"Analysis\"\n        }\n      ],\n      \"prosAndCons\": {\n        \"pros\": [\"advantages\"],\n        \"cons\": [\"disadvantages\"]\n      },\n      \"verdict\": {\n        \"rating\": 0.0 to 5.0,\n        \"summary\": \"Overall assessment\",\n        \"recommendedFor\": [\"use cases\"]\n      }\n    }"
    },
    comparison: {
        type: 'product_comparison',
        signals: [
            'explicit comparison video',
            'multiple products compared directly',
            'structured comparison criteria',
            'clear comparison purpose',
            'comparative analysis focus'
        ],
        template: "{\n      \"type\": \"product_comparison\",\n      \"comparisonContext\": {\n        \"category\": \"Category\",\n        \"products\": [\"Product names\"],\n        \"criteria\": [\"Comparison points\"]\n      },\n      \"headToHead\": [\n        {\n          \"criterion\": \"What's being compared\",\n          \"winner\": \"Better product\",\n          \"explanation\": \"Why\"\n        }\n      ],\n      \"verdict\": {\n        \"bestOverall\": \"Best product\",\n        \"bestValue\": \"Best value option\",\n        \"recommendations\": [\n          {\n            \"scenario\": \"Use case\",\n            \"choice\": \"Recommended product\"\n          }\n        ]\n      }\n    }"
    }
};
