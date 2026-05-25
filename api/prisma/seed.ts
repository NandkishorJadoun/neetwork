import { prisma } from "../src/libs/prisma"


const main = async () => {
    try {
        await prisma.follow.createMany({
            data: [
                {
                    toId: "cmp6ptu5f0000n1cp7d3t7jum",
                    fromId: "150302f1-4c71-49c8-a964-002c64dcdac4"
                },
                {
                    toId: "cmp6ptu5f0000n1cp7d3t7jum",
                    fromId: "201d837b-d8aa-4695-ab1a-4f61f429304b"
                }, {
                    toId: "cmp6ptu5f0000n1cp7d3t7jum",
                    fromId: "31a52e02-69f1-4470-8c7c-3c4fa3ba055c"
                }, {
                    toId: "cmp6ptu5f0000n1cp7d3t7jum",
                    fromId: "7ba7c330-2282-4957-86af-d6ea600463aa"
                },
            ]
        })
    } catch (error) {
        console.error(error)
    }
}

main()