import { expectType, expectAssignable } from "tsd";
import { DeepExtractType, DeepExtractTypeSkipArrays, KeyNotFoundTypeError } from "..";

import { AllUsersWithCommentsQuery, User, Maybe, Comment } from "./fixtures/types";

const something: any = {};

/** test: extracting with empty array should return the same type (probably removing null) */
{
  expectAssignable<AllUsersWithCommentsQuery>(something as DeepExtractType<AllUsersWithCommentsQuery, []>);
  expectAssignable<AllUsersWithCommentsQuery>(something as DeepExtractTypeSkipArrays<AllUsersWithCommentsQuery, []>);

  expectType<string>(something as DeepExtractType<string | null, []>);
  expectType<string>(something as DeepExtractTypeSkipArrays<string | null, []>);
}

type ExpectedCommentsConnectionType = { __typename?: "CommentsConnection" } & {
  nodes: Array<Maybe<{ __typename?: "Comment" } & Pick<Comment, "id" | "content" | "nodeId" | "postId">>>;
};

/** test: extract Comments Connection type */
{
  expectAssignable<ExpectedCommentsConnectionType>(
    something as DeepExtractType<AllUsersWithCommentsQuery, ["allUsers", "nodes", number, "commentsByUserId"]>
  );

  expectAssignable<ExpectedCommentsConnectionType>(
    something as DeepExtractTypeSkipArrays<AllUsersWithCommentsQuery, ["allUsers", "nodes", "commentsByUserId"]>
  );
}

type ExpectedUserType = { __typename?: "User" } & Pick<User, "email" | "id" | "nodeId"> & {
    commentsByUserId: ExpectedCommentsConnectionType;
  };

/** test: extract User type */
{
  expectAssignable<Array<Maybe<ExpectedUserType>>>(
    something as DeepExtractType<AllUsersWithCommentsQuery, ["allUsers", "nodes"]>
  );

  expectAssignable<ExpectedUserType>(
    something as DeepExtractType<AllUsersWithCommentsQuery, ["allUsers", "nodes", number]>
  );

  expectAssignable<ExpectedUserType>(
    something as DeepExtractTypeSkipArrays<AllUsersWithCommentsQuery, ["allUsers", "nodes"]>
  );
}

/** test: extract nested scalar value */
{
  expectType<string>(something as DeepExtractType<AllUsersWithCommentsQuery, ["allUsers", "nodes", number, "email"]>);

  expectType<string>(something as DeepExtractTypeSkipArrays<AllUsersWithCommentsQuery, ["allUsers", "nodes", "email"]>);
}

/** test: extract deeply nested scalar value */
{
  expectType<number>(
    something as DeepExtractType<
      AllUsersWithCommentsQuery,
      ["allUsers", "nodes", number, "commentsByUserId", "nodes", number, "id"]
    >
  );

  expectType<number>(
    something as DeepExtractTypeSkipArrays<
      AllUsersWithCommentsQuery,
      ["allUsers", "nodes", "commentsByUserId", "nodes", "id"]
    >
  );
}

/** test: KeyNotFoundTypeError */
{
  type User = { firstPost?: { title: string } };
  type QueryResult = { user?: User };

  expectType<KeyNotFoundTypeError<QueryResult, "usah">>(
    something as DeepExtractType<QueryResult, ["usah", "firstPost"]>
  );
  expectType<KeyNotFoundTypeError<User, "firtPost">>(something as DeepExtractType<QueryResult, ["user", "firtPost"]>);

  expectType<KeyNotFoundTypeError<QueryResult, "usah">>(
    something as DeepExtractTypeSkipArrays<QueryResult, ["usah", "firstPost"]>
  );
  expectType<KeyNotFoundTypeError<User, "firtPost">>(
    something as DeepExtractTypeSkipArrays<QueryResult, ["user", "firtPost"]>
  );
}

/** test: examples from documentation */
{
  {
    type QueryResult = { allPosts?: Array<{ users?: Array<{ name: string }> }> };
    type User = DeepExtractTypeSkipArrays<QueryResult, ["allPosts", "users"]>;
    expectType<{ name: string }>(something as User);
  }

  {
    type QueryResult = { user?: { firstPost?: { title: string } } };
    type Post = DeepExtractType<QueryResult, ["user", "firstPost"]>;
    expectType<{ title: string }>(something as Post);
  }
}
