import prisma from "./prisma";
import { Role } from "./generated/prisma/client";

interface UserInput {
  name?: string;
  email?: string;
  age?: number;
  role?: string;
}

interface PostInput {
  title?: string;
  content?: string;
  published?: boolean;
  authorId?: string;
  tags?: string[];
}

interface CommentInput {
  text?: string;
  authorId?: string;
  postId?: string;
}

const resolvers = {
  Query: {
    users: () => {
      return prisma.user.findMany();
    },

    user: (_: unknown, { id }: { id: string }) => {
      const singleUser = prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      return singleUser;
    },

    posts: () => {
      return prisma.post.findMany();
    },

    post: (_: unknown, { id }: { id: string }) =>
      prisma.post.findUnique({
        where: {
          id: Number(id),
        },
      }),

    comments: () => prisma.comment.findMany(),
  },

  User: {
    posts: (parent: { id: number }) =>
      prisma.post.findMany({ where: { authorId: parent.id } }),
    postCount: (parent: { id: number }) =>
      prisma.post.count({ where: { authorId: parent.id } }),
    comments: (parent: { id: number }) =>
      prisma.comment.findMany({ where: { authorId: parent.id } }),
    commentCount: (parent: { id: number }) =>
      prisma.comment.count({ where: { authorId: parent.id } }),
  },

  //? CRUD OPERATION

  Mutation: {
    // users crud
    createUser: (_: unknown, { input }: { input: UserInput }) => {
      return prisma.user.create({
        data: {
          name: input.name ?? "",
          email: input.email ?? "",
          age: input.age ?? 0,
          ...(input.role ? { role: input.role as Role } : {}),
        },
      });
    },
    updateUser: (_: unknown, { id, input }: { id: string; input: UserInput }) => {
      const { role, ...rest } = input;
      return prisma.user.update({
        where: { id: Number(id) },
        data: {
          ...rest,
          ...(role ? { role: role as Role } : {}),
        },
      });
    },
    deleteUser: (_: unknown, { id }: { id: string }) => {
      return prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
    },

    // post crud
    createPost: (_: unknown, { input }: { input: PostInput }) => {
      return prisma.post.create({
        data: {
          title: input.title ?? "",
          content: input.content ?? "",
          published: input.published ?? false,
          authorId: Number(input.authorId),
          tags: input.tags ?? [],
        },
      });
    },
    updatePost: (_: unknown, { id, input }: { id: string; input: PostInput }) => {
      const { authorId, ...rest } = input;
      return prisma.post.update({
        where: { id: Number(id) },
        data: {
          ...rest,
          ...(authorId ? { authorId: Number(authorId) } : {}),
        },
      });
    },
    deletePost: (_: unknown, { id }: { id: string }) => {
      return prisma.post.delete({
        where: {
          id: Number(id),
        },
      });
    },

    // Comment crud
    createComment: (_: unknown, { input }: { input: CommentInput }) => {
      return prisma.comment.create({
        data: {
          text: input.text ?? "",
          authorId: Number(input.authorId),
          postId: Number(input.postId),
        },
      });
    },
    updateComment: (_: unknown, { id, input }: { id: string; input: CommentInput }) => {
      const { authorId, postId, ...rest } = input;
      return prisma.comment.update({
        where: { id: Number(id) },
        data: {
          ...rest,
          ...(authorId ? { authorId: Number(authorId) } : {}),
          ...(postId ? { postId: Number(postId) } : {}),
        },
      });
    },
    deleteComment: (_: unknown, { id }: { id: string }) => {
      return prisma.comment.delete({
        where: {
          id: Number(id),
        },
      });
    },
  },
};

export default resolvers;