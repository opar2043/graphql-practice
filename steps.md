# Steps: Convert CRUD Operations to Prisma

Your Prisma setup is already done. This guide converts the resolvers in `src/todoResolver.ts` from in-memory arrays to real database queries, in the order you should do them.

**Setup already finished (do not repeat):**
- `prisma/schema.prisma` — `User`, `Post`, `Comment` models + `Role` enum
- Migration `add_user_post_comment` applied to Neon
- Generated client in `src/generated/prisma`
- Client singleton at `src/prisma.ts`
- Seed data loaded via `npm run db:seed`

---

## Step 0 — Import Prisma in the resolver

Replace the `src/data.ts` import with the Prisma client.

Open `src/todoResolver.ts` and change the top of the file:

```ts
import prisma from "./prisma"
import { Role } from "./generated/prisma/client"
```

Keep the input interfaces you already use (`UserInput`, `PostInput`, `CommentInput`).
Delete the import of `users`, `posts`, `comments` from `./data` — those arrays won't be needed anymore.

> Run `npm run db:seed` first so the database actually has data to read.

---

## Step 1 — Convert the READ (Query) resolvers

Every resolver becomes `async`. Prisma returns a Promise, so `await` the query or just return it directly.

```ts
Query: {
    users: () => prisma.user.findMany(),
    user: (_: unknown, { id }: { id: string }) =>
      prisma.user.findUnique({ where: { id: Number(id) } }),
    posts: () => prisma.post.findMany(),
    post: (_: unknown, { id }: { id: string }) =>
      prisma.post.findUnique({ where: { id: Number(id) } }),
    comments: () => prisma.comment.findMany(),
},
```

**Why `Number(id)`?** The GraphQL `ID` arrives as a string, but the Prisma `id` field is `Int`.
`findMany()` = array (`filter`), `findUnique()` = one row or `null` (`find`).

---

## Step 2 — Convert the User field resolvers (relations & counts)

The old code filtered arrays by `authorId`. With Prisma, query the DB per field.
`parent.id` is already a number here (it came from the database).

```ts
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
```

`count()` replaces `.filter(...).length`. Do `Post.comments` / `Comment.author` the same way if your schema needs them.

---

## Step 3 — Write UPDATE mutations (do these before Create so nothing breaks)

Open `src/todoResolver.ts` and add a `Mutation` object. Update uses `prisma.X.update({ where, data })`:

```ts
Mutation: {
    updateUser: (_: unknown, { id, input }: { id: string, input: UserInput }) =>
      prisma.user.update({
        where: { id: Number(id) },
        data: {
          ...input,
          ...(input.role ? { role: input.role as Role } : {}),
        },
      }),

    updatePost: (_: unknown, { id, input }: { id: string, input: PostInput }) =>
      prisma.post.update({
        where: { id: Number(id) },
        data: {
          ...input,
          ...(input.authorId ? { authorId: Number(input.authorId) } : {}),
        },
      }),

    updateComment: (_: unknown, { id, input }: { id: string, input: CommentInput }) =>
      prisma.comment.update({
        where: { id: Number(id) },
        data: {
          ...input,
          ...(input.authorId ? { authorId: Number(input.authorId) } : {}),
          ...(input.postId ? { postId: Number(input.postId) } : {}),
        },
      }),
},
```

- `role` is a Prisma **enum**, so cast the string: `input.role as Role`.
- `authorId` / `postId` in the input are strings → `Number(...)`.

---

## Step 4 — Write CREATE mutations

Create needs every required field. `id` is auto-generated, never pass it.

```ts
createUser: (_: unknown, { input }: { input: UserInput }) =>
      prisma.user.create({
        data: {
          name: input.name ?? "",
          email: input.email ?? "",
          age: input.age ?? 0,
          ...(input.role ? { role: input.role as Role } : {}),
        },
      }),

    createPost: (_: unknown, { input }: { input: PostInput }) =>
      prisma.post.create({
        data: {
          title: input.title ?? "",
          content: input.content ?? "",
          published: input.published ?? false,
          authorId: Number(input.authorId),
          tags: input.tags ?? [],
        },
      }),

    createComment: (_: unknown, { input }: { input: CommentInput }) =>
      prisma.comment.create({
        data: {
          text: input.text ?? "",
          authorId: Number(input.authorId),
          postId: Number(input.postId),
        },
      }),
```

`?? ""` is a fallback because your `input` types mark everything optional — Prisma requires `name`, `email`, `age`, etc. If the GraphQL input had `!` on required fields you could drop the fallbacks.

---

## Step 5 — Write DELETE mutations

Delete by id. Prisma throws an error if the row doesn't exist (the old code returned `null`).

```ts
deleteUser: (_: unknown, { id }: { id: string }) =>
      prisma.user.delete({ where: { id: Number(id) } }),

    deletePost: (_: unknown, { id }: { id: string }) =>
      prisma.post.delete({ where: { id: Number(id) } }),

    deleteComment: (_: unknown, { id }: { id: string }) =>
      prisma.comment.delete({ where: { id: Number(id) } }),
```

> Deleting a `User` or `Post` also removes its comments, because the schema uses `onDelete: Cascade`.

---

## Step 6 — Run & test

```bash
npm start
```

Open `http://localhost:5000/graphql` and test:

```graphql
# Read
query {
  users {
    id
    name
    posts { id title }
    postCount
  }
}

# Create
mutation {
  createPost(input: { title: "My new post", content: "Hello", published: true, authorId: 1, tags: ["graphql"] }) {
    id
    title
  }
}

# Update
mutation {
  updateUser(id: "1", input: { age: 29 }) {
    id
    age
  }
}

# Delete
mutation {
  deletePost(id: "2") {
    id
    title
  }
}
```

To reset the data after testing: `npm run db:seed`.

---

## Rules (Prisma style to remember)
- Import `prisma` from `./prisma`; `Role` from `./generated/prisma/client`.
- Model delegate names are lowercase: `prisma.user`, `prisma.post`, `prisma.comment`.
- GraphQL `ID` → `Number(id)` for the Prisma `Int` id.
- `role` must be cast to the `Role` enum (`ADMIN` | `USER` | `MODERATOR`).
- Resolvers return Promises — no need to `await` if you return the prisma call directly.
- `findMany` = list, `findUnique` = one or `null`, `count` = number, `create`/`update`/`delete` = the row.
- `update`/`delete` throw an error (code `P2025`) when the row is missing.