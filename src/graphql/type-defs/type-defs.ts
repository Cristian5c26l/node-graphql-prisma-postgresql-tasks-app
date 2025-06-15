import { gql } from "apollo-server";

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    columnId: ID!
    userId: ID!
    columnOrder: Int!
  }

  type Query {
    allTasks(userId: ID!): [Task]!
    tasksByStatus(status: String!, userId: ID!): [Task]!
  }

  type Column {
    id: ID!
    title: String!
    userId: ID!
    isFixed: Boolean!
    order: Int!
  }

  type Mutation {
    createTask(title: String!, status: String!, userId: ID!): Task!
    updateTask(taskId: ID!, title: String, status: String): Task!
    deleteTask(taskId: ID!): Task!
    addColumn(columnName: String!, userId: ID!): Column!
    reorderColumns(newOrder: [ID!]!, userId: ID!): [Column]!
    deleteColumn(columnId: ID!, userId: ID!): Boolean!
  }
`;
