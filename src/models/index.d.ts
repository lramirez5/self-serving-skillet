import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PostMetaData = {
  readOnlyFields: 'updatedAt';
}

export declare class Post {
  readonly id: string;
  readonly title: string;
  readonly type: string;
  readonly category?: string;
  readonly description?: string;
  readonly images?: (string | null)[];
  readonly video?: string;
  readonly tags?: (string | null)[];
  readonly createdAt: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}