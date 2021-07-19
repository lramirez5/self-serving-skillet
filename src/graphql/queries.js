/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      type
      category
      description
      image
      video
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        type
        category
        description
        image
        video
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const postsByDate = /* GraphQL */ `
query PostsByDate {
  postsByDate(
    type: "post"
    sortDirection: DESC
  ) {
      items {
        id
        title
        type
        category
        description
        image
        video
        createdAt
        updatedAt
      }
    }
  }
`;
export const categoryByDate = /* GraphQL */ `
  query CategoryByDate(
    $category: String
    $createdAt: ModelStringKeyConditionInput
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    categoryByDate(
      category: $category
      createdAt: $createdAt
      sortDirection: DESC
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        type
        category
        description
        image
        video
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

//export const postsByDate = /* GraphQL */ `
/*  query PostsByDate(
    $type: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByDate(
      type: "post"
      createdAt: $createdAt
      sortDirection: DESC
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        type
        category
        description
        image
        video
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
*/
//export const categoryByDate = /* GraphQL */ `
/*  query CategoryByDate(
    $category: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    categoryByDate(
      category: $category
      createdAt: $createdAt
      sortDirection: DESC
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        type
        category
        description
        image
        video
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
*/