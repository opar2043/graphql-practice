import { PrismaClient } from "../src/generated/prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  const alice = await prisma.user.create({
    data: { name: "Alice Johnson", email: "alice@example.com", age: 28, role: "ADMIN", isActive: true },
  })
  const bob = await prisma.user.create({
    data: { name: "Bob Smith", email: "bob@example.com", age: 34, role: "USER", isActive: true },
  })
  const charlie = await prisma.user.create({
    data: { name: "Charlie Brown", email: "charlie@example.com", age: 22, role: "USER", isActive: false },
  })
  const diana = await prisma.user.create({
    data: { name: "Diana Prince", email: "diana@example.com", age: 30, role: "MODERATOR", isActive: true },
  })
  const eve = await prisma.user.create({
    data: { name: "Eve Davis", email: "eve@example.com", age: 26, role: "USER", isActive: true },
  })

  const post1 = await prisma.post.create({
    data: { title: "Getting Started with GraphQL", content: "GraphQL is a query language for APIs...", published: true, authorId: alice.id, tags: ["graphql", "api", "tutorial"] },
  })
  const post2 = await prisma.post.create({
    data: { title: "Express.js Best Practices", content: "When building APIs with Express...", published: true, authorId: bob.id, tags: ["express", "nodejs", "backend"] },
  })
  const post3 = await prisma.post.create({
    data: { title: "TypeScript Tips", content: "TypeScript helps catch errors early...", published: true, authorId: alice.id, tags: ["typescript", "javascript"] },
  })
  const post4 = await prisma.post.create({
    data: { title: "Draft Post", content: "This is a work in progress...", published: false, authorId: charlie.id, tags: ["draft"] },
  })
  const post5 = await prisma.post.create({
    data: { title: "Database Design Patterns", content: "When designing your database schema...", published: true, authorId: diana.id, tags: ["database", "design", "patterns"] },
  })
  const post6 = await prisma.post.create({
    data: { title: "React State Management", content: "Managing state in React can be done...", published: true, authorId: eve.id, tags: ["react", "frontend", "state"] },
  })

  await prisma.comment.createMany({
    data: [
      { text: "Great introduction!", authorId: bob.id, postId: post1.id },
      { text: "Very helpful, thanks!", authorId: charlie.id, postId: post1.id },
      { text: "I prefer Fastify over Express.", authorId: diana.id, postId: post2.id },
      { text: " generics are really powerful.", authorId: alice.id, postId: post3.id },
      { text: "Nice patterns!", authorId: eve.id, postId: post5.id },
      { text: "Could you add more examples?", authorId: bob.id, postId: post6.id },
    ],
  })

  console.log("Seed data inserted")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })