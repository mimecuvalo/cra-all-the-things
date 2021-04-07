/* @flow */

import { type GraphQLResolveInfo } from 'graphql';
export type $RequireFields<Origin, Keys> = $Diff<Origin, Keys> &
  $ObjMapi<Keys, <Key>(k: Key) => $NonMaybeType<$ElementType<Origin, Key>>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {|
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
|};

export type Echo = {|
  __typename?: 'Echo',
  exampleField: $ElementType<Scalars, 'String'>,
|};

export type Query = {|
  __typename?: 'Query',
  _?: ?$ElementType<Scalars, 'Boolean'>,
  allUsers?: ?Array<?User>,
  echoExample?: ?Echo,
  fetchUser?: ?User,
  hello?: ?$ElementType<Scalars, 'String'>,
|};

export type QueryEchoExampleArgs = {|
  str: $ElementType<Scalars, 'String'>,
|};

export type QueryFetchUserArgs = {|
  id: $ElementType<Scalars, 'Int'>,
|};

export type Mutation = {|
  __typename?: 'Mutation',
  _?: ?$ElementType<Scalars, 'Boolean'>,
  createUser?: ?User,
  login?: ?$ElementType<Scalars, 'String'>,
|};

export type MutationCreateUserArgs = {|
  username: $ElementType<Scalars, 'String'>,
  email: $ElementType<Scalars, 'String'>,
|};

export type MutationLoginArgs = {|
  email: $ElementType<Scalars, 'String'>,
|};

export type Subscription = {|
  __typename?: 'Subscription',
  _?: ?$ElementType<Scalars, 'Boolean'>,
|};

export type User = {|
  __typename?: 'User',
  username: $ElementType<Scalars, 'String'>,
  email: $ElementType<Scalars, 'String'>,
|};

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionSubscribeFn<Result, Parent, Context, Args> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => AsyncIterator<Result> | Promise<AsyncIterator<Result>>;

export type SubscriptionResolveFn<Result, Parent, Context, Args> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Result | Promise<Result>;

export interface SubscriptionSubscriberObject<Result, Key: string, Parent, Context, Args> {
  subscribe: SubscriptionSubscribeFn<{ [key: Key]: Result }, Parent, Context, Args>;
  resolve?: SubscriptionResolveFn<Result, { [key: Key]: Result }, Context, Args>;
}

export interface SubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe: SubscriptionSubscribeFn<mixed, Parent, Context, Args>;
  resolve: SubscriptionResolveFn<Result, mixed, Context, Args>;
}

export type SubscriptionObject<Result, Key: string, Parent, Context, Args> =
  | SubscriptionSubscriberObject<Result, Key, Parent, Context, Args>
  | SubscriptionResolverObject<Result, Parent, Context, Args>;

export type SubscriptionResolver<Result, Key: string, Parent = {}, Context = {}, Args = {}> =
  | ((...args: Array<any>) => SubscriptionObject<Result, Key, Parent, Context, Args>)
  | SubscriptionObject<Result, Key, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => ?Types | Promise<?Types>;

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<Result = {}, Parent = {}, Args = {}, Context = {}> = (
  next: NextResolverFn<Result>,
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Result | Promise<Result>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Echo: ResolverTypeWrapper<Echo>,
  String: ResolverTypeWrapper<$ElementType<Scalars, 'String'>>,
  Query: ResolverTypeWrapper<{}>,
  Boolean: ResolverTypeWrapper<$ElementType<Scalars, 'Boolean'>>,
  Int: ResolverTypeWrapper<$ElementType<Scalars, 'Int'>>,
  Mutation: ResolverTypeWrapper<{}>,
  Subscription: ResolverTypeWrapper<{}>,
  Date: ResolverTypeWrapper<$ElementType<Scalars, 'Date'>>,
  User: ResolverTypeWrapper<User>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Echo: Echo,
  String: $ElementType<Scalars, 'String'>,
  Query: {},
  Boolean: $ElementType<Scalars, 'Boolean'>,
  Int: $ElementType<Scalars, 'Int'>,
  Mutation: {},
  Subscription: {},
  Date: $ElementType<Scalars, 'Date'>,
  User: User,
};

export type EchoResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Echo'>> = {
  exampleField?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type QueryResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Query'>> = {
  _?: Resolver<?$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  allUsers?: Resolver<?Array<?$ElementType<ResolversTypes, 'User'>>, ParentType, ContextType>,
  echoExample?: Resolver<
    ?$ElementType<ResolversTypes, 'Echo'>,
    ParentType,
    ContextType,
    $RequireFields<QueryEchoExampleArgs, { str: * }>
  >,
  fetchUser?: Resolver<
    ?$ElementType<ResolversTypes, 'User'>,
    ParentType,
    ContextType,
    $RequireFields<QueryFetchUserArgs, { id: * }>
  >,
  hello?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Mutation'>> = {
  _?: Resolver<?$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  createUser?: Resolver<
    ?$ElementType<ResolversTypes, 'User'>,
    ParentType,
    ContextType,
    $RequireFields<MutationCreateUserArgs, { username: *, email: * }>
  >,
  login?: Resolver<
    ?$ElementType<ResolversTypes, 'String'>,
    ParentType,
    ContextType,
    $RequireFields<MutationLoginArgs, { email: * }>
  >,
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType = $ElementType<ResolversParentTypes, 'Subscription'>
> = {
  _?: SubscriptionResolver<?$ElementType<ResolversTypes, 'Boolean'>, '_', ParentType, ContextType>,
};

export type DateScalarConfig = {
  ...GraphQLScalarTypeConfig<$ElementType<ResolversTypes, 'Date'>, any>,
  name: 'Date',
};

export type UserResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'User'>> = {
  username?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  email?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: isTypeOfResolverFn<ParentType>,
};

export type Resolvers<ContextType = any> = {
  Echo?: EchoResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  Subscription?: SubscriptionResolvers<ContextType>,
  Date?: GraphQLScalarType<>,
  User?: UserResolvers<ContextType>,
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
