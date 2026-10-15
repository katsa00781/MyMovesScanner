// Böngészés rendezési módok; az első az alapértelmezett (a design „Newest first”).
export type BrowseSort = 'newest' | 'popular' | 'rating';

export const browseSorts: readonly BrowseSort[] = ['newest', 'popular', 'rating'];
