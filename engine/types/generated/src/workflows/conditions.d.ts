/**
 * Evaluate a condition step against the workflow context
 *
 * Supported formats:
 * 1. Simple expression string: { "condition": "profile.followers > 1000" }
 * 2. Structured condition: { "condition": { "left": "profile.followers", "operator": ">", "right": 1000 } }
 * 3. AND conditions: { "condition": { "all": ["expr1", "expr2"] } }
 * 4. OR conditions: { "condition": { "any": ["expr1", "expr2"] } }
 *
 * @param {string|object} condition - The condition to evaluate
 * @param {object} context - The workflow variable context
 * @returns {{ passed: boolean, details: string }}
 */
export function evaluateCondition(condition: string | object, context: object): {
    passed: boolean;
    details: string;
};
/**
 * Get list of available operators
 */
export function getAvailableOperators(): string[];
/**
 * Resolve a dot-notated path from the context
 * Supports: "profile.followers", "profile.tweets[0].text", "profile.tweets.length"
 */
export function resolveValue(path: any, context: any): any;
/**
 * Parse a simple condition expression string
 * Formats:
 *   "profile.followers > 1000"
 *   "profile.tweets[0].text contains 'keyword'"
 *   "profile.tweets[0].age < 30m"
 *   "results.length > 0"
 */
export function parseExpression(expression: any): {
    left: any;
    operator: string;
    right: any;
};
