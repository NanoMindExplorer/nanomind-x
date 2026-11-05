/**
 * Compare two exports
 *
 * @param {string} dirA - Older export directory
 * @param {string} dirB - Newer export directory
 * @returns {object} { summary, followers, following, tweets, report }
 */
export function diffExports(dirA: string, dirB: string): object;
/**
 * Generate a readable Markdown diff report
 */
export function generateReport(diff: any): string;
/**
 * Run diff and write report files
 */
export function diffAndReport(dirA: any, dirB: any, outputDir: any): Promise<{
    diff: any;
    report: string;
    files: string[];
}>;
export default diffExports;
