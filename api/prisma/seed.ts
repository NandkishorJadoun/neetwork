import { prisma } from "../src/libs/prisma"


const main = async () => {
    try {
        await prisma.follow.deleteMany({})
        await prisma.follow.createMany({
            data: [
                {
                    fromId: "cmp6ptu5f0000n1cp7d3t7jum",
                    toId: "150302f1-4c71-49c8-a964-002c64dcdac4",
                    status: "ACCEPTED"
                },
                {
                    fromId: "cmp6ptu5f0000n1cp7d3t7jum",
                    toId: "201d837b-d8aa-4695-ab1a-4f61f429304b",
                    status: "ACCEPTED"
                }, {
                    fromId: "cmp6ptu5f0000n1cp7d3t7jum",
                    toId: "31a52e02-69f1-4470-8c7c-3c4fa3ba055c",
                    status: "ACCEPTED"
                }, {
                    fromId: "cmp6ptu5f0000n1cp7d3t7jum",
                    toId: "7ba7c330-2282-4957-86af-d6ea600463aa",
                    status: "ACCEPTED"
                },
            ]
        })
    } catch (error) {
        console.error(error)
    }
}

main()