import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type CoqTop = {
   __typename?: 'CoqTop',
  init?: Maybe<Scalars['Boolean']>,
  destroy?: Maybe<Scalars['Boolean']>,
  writeControl?: Maybe<Scalars['Boolean']>,
  writeMainChannel?: Maybe<Scalars['Boolean']>,
};


export type CoqTopInitArgs = {
  image?: Maybe<Scalars['String']>,
  script?: Maybe<Scalars['String']>,
  executable?: Maybe<Scalars['String']>,
  runArgs?: Maybe<Array<Maybe<Scalars['String']>>>
};

export type Mutation = {
   __typename?: 'Mutation',
  coqTop?: Maybe<CoqTop>,
};

export type Query = {
   __typename?: 'Query',
  coqTop?: Maybe<QueryCoqTop>,
};

export type QueryCoqTop = {
   __typename?: 'QueryCoqTop',
  readControl?: Maybe<Scalars['String']>,
  readMainChannel?: Maybe<Scalars['String']>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  QueryCoqTop: ResolverTypeWrapper<QueryCoqTop>,
  String: ResolverTypeWrapper<Scalars['String']>,
  Mutation: ResolverTypeWrapper<{}>,
  CoqTop: ResolverTypeWrapper<CoqTop>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  QueryCoqTop: QueryCoqTop,
  String: Scalars['String'],
  Mutation: {},
  CoqTop: CoqTop,
  Boolean: Scalars['Boolean'],
};

export type CoqTopResolvers<ContextType = any, ParentType extends ResolversParentTypes['CoqTop'] = ResolversParentTypes['CoqTop']> = {
  init?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, CoqTopInitArgs>,
  destroy?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  writeControl?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  writeMainChannel?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  coqTop?: Resolver<Maybe<ResolversTypes['CoqTop']>, ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  coqTop?: Resolver<Maybe<ResolversTypes['QueryCoqTop']>, ParentType, ContextType>,
};

export type QueryCoqTopResolvers<ContextType = any, ParentType extends ResolversParentTypes['QueryCoqTop'] = ResolversParentTypes['QueryCoqTop']> = {
  readControl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  readMainChannel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  CoqTop?: CoqTopResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  QueryCoqTop?: QueryCoqTopResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;

