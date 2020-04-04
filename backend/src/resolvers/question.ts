
export default {
    Query: {
        sendResponse: async (parent, args, context, info) => {
            const questionId = args.data.questionId
            const playerId = args.data.playerId
            const answerIndex = args.data.answerIndex
            const question = await context.prisma.question({ id: questionId })
            const answer = question.answer === answerIndex
            const player = await context.prisma.player({ id: playerId })
            await context.prisma.updatePlayer({
                where: {
                    id: playerId
                },
                data:{
                    questionsAnswered: { connect: { id: questionId } },
                    points: answer ? player.points + 10 : player.points
                }
            })
            console.log(question.id)
            return {
                answer: answer
            }
        }
    },
    Mutation: {

    }
}
