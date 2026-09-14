import prisma from "./prisma";
const resolvers = {
    Query: {
        users: () => {
            return prisma.user.findMany();
        },
        user: (_, { id }) => {
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
        post: (_, { id }) => prisma.post.findUnique({
            where: {
                id: Number(id),
            },
        }),
        comments: () => prisma.comment.findMany(),
    },
    User: {
        posts: (parent) => prisma.post.findMany({ where: { authorId: parent.id } }),
        postCount: (parent) => prisma.post.count({ where: { authorId: parent.id } }),
        comments: (parent) => prisma.comment.findMany({ where: { authorId: parent.id } }),
        commentCount: (parent) => prisma.comment.count({ where: { authorId: parent.id } }),
    },
    //? CRUD OPERATION
    Mutation: {
        // users crud
        createUser: (_, { input }) => {
            return prisma.user.create({
                data: {
                    name: input.name ?? "",
                    email: input.email ?? "",
                    age: input.age ?? 0,
                    ...(input.role ? { role: input.role } : {}),
                },
            });
        },
        updateUser: (_, { id, input }) => {
            const { role, ...rest } = input;
            return prisma.user.update({
                where: { id: Number(id) },
                data: {
                    ...rest,
                    ...(role ? { role: role } : {}),
                },
            });
        },
        deleteUser: (_, { id }) => {
            return prisma.user.delete({
                where: {
                    id: Number(id),
                },
            });
        },
        // post crud
        createPost: (_, { input }) => {
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
        updatePost: (_, { id, input }) => {
            const { authorId, ...rest } = input;
            return prisma.post.update({
                where: { id: Number(id) },
                data: {
                    ...rest,
                    ...(authorId ? { authorId: Number(authorId) } : {}),
                },
            });
        },
        deletePost: (_, { id }) => {
            return prisma.post.delete({
                where: {
                    id: Number(id),
                },
            });
        },
        // Comment crud
        createComment: (_, { input }) => {
            return prisma.comment.create({
                data: {
                    text: input.text ?? "",
                    authorId: Number(input.authorId),
                    postId: Number(input.postId),
                },
            });
        },
        updateComment: (_, { id, input }) => {
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
        deleteComment: (_, { id }) => {
            return prisma.comment.delete({
                where: {
                    id: Number(id),
                },
            });
        },
    },
};
export default resolvers;
