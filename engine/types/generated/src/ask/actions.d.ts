/**
 * Index a catalog once so repeated questions are cheap.
 *
 * @param {{ actions: Array<object> }} catalog  parsed ask-actions.json
 */
export function createActionMatcher(catalog: {
    actions: Array<object>;
}): {
    match: (question: string, sources?: Array<{
        p: string;
        t: string;
    }>, opts?: {
        limit?: number;
        perKind?: number;
    }) => Array<object>;
    size: number;
    isCommon: (term: any) => boolean;
};
/**
 * Public shape for the API and the UI: no scores, no internals, and a single
 * `run` field describing exactly what to do with it.
 */
export function publicActions(actions: any): any;
