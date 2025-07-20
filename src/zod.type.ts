import * as z from 'zod'

// ProjectSchema, UserSchema, UserWithProjectsSchema 及其相关类型已移除，
// 因为对应的数据库表 (projects, users) 已被删除。
// 如果将来需要新的 Zod 类型，可以在此处添加。

export const PostSchema = z.object({
    id: z.number(),
    title: z.string().nullable(),
    content: z.string().nullable(),
})

export type Post = z.infer<typeof PostSchema>

export const CommentSchema = z.object({
    id: z.number(),
    text: z.string().nullable(),
    postId: z.number(),
})

export type Comment = z.infer<typeof CommentSchema>

export const PostWithCommentsSchema = PostSchema.extend({
    comments: z.array(CommentSchema),
})

export type PostWithComments = z.infer<typeof PostWithCommentsSchema>
