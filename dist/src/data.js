export const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", age: 28, role: "ADMIN", isActive: true },
    { id: 2, name: "Bob Smith", email: "bob@example.com", age: 34, role: "USER", isActive: true },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", age: 22, role: "USER", isActive: false },
    { id: 4, name: "Diana Prince", email: "diana@example.com", age: 30, role: "MODERATOR", isActive: true },
    { id: 5, name: "Eve Davis", email: "eve@example.com", age: 26, role: "USER", isActive: true },
];
export const posts = [
    { id: 1, title: "Getting Started with GraphQL", content: "GraphQL is a query language for APIs...", published: true, authorId: 1, tags: ["graphql", "api", "tutorial"] },
    { id: 2, title: "Express.js Best Practices", content: "When building APIs with Express...", published: true, authorId: 2, tags: ["express", "nodejs", "backend"] },
    { id: 3, title: "TypeScript Tips", content: "TypeScript helps catch errors early...", published: true, authorId: 1, tags: ["typescript", "javascript"] },
    { id: 4, title: "Draft Post", content: "This is a work in progress...", published: false, authorId: 3, tags: ["draft"] },
    { id: 5, title: "Database Design Patterns", content: "When designing your database schema...", published: true, authorId: 4, tags: ["database", "design", "patterns"] },
    { id: 6, title: "React State Management", content: "Managing state in React can be done...", published: true, authorId: 5, tags: ["react", "frontend", "state"] },
];
export const comments = [
    { id: 1, text: "Great introduction!", authorId: 2, postId: 1 },
    { id: 2, text: "Very helpful, thanks!", authorId: 3, postId: 1 },
    { id: 3, text: "I prefer Fastify over Express.", authorId: 4, postId: 2 },
    { id: 4, text: " generics are really powerful.", authorId: 1, postId: 3 },
    { id: 5, text: "Nice patterns!", authorId: 5, postId: 5 },
    { id: 6, text: "Could you add more examples?", authorId: 2, postId: 6 },
];
