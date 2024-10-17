export type Key = number;
export type Keyed<T> = T & { id: Key };

export type CommitId = number;
export type CommitNode = {
  commitId: CommitId;
  effort: number;
  timestamp: number;
  parent?: CommitId;
  message: string;
};
