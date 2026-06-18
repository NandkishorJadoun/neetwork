import { prisma } from "../libs/prisma.js"

const toId = "cmp6ptu5f0000n1cp7d3t7jum";

async function main() {
    await prisma.follow.deleteMany({})
    await prisma.follow.createMany({
        data:
            [
                { fromId: "150302f1-4c71-49c8-a964-002c64dcdac4", toId },
                { fromId: "201d837b-d8aa-4695-ab1a-4f61f429304b", toId },
                { fromId: "31a52e02-69f1-4470-8c7c-3c4fa3ba055c", toId },
                { fromId: "7ba7c330-2282-4957-86af-d6ea600463aa", toId },
                { fromId: "88d72da8-a95d-4cab-98d8-ab9abeb0e97a", toId },
                { fromId: "a81ce7f9-7069-41a2-9650-7310eb4a5b5a", toId },
            ]
    })
}

main()

/* "c27fc126-8739-4c50-9e7e-141ad4935dbd"
"cbaf54b0-963c-48c0-adcc-992bcd81e93f"
"cmptqlcvi00007mcp48i0e841"
"edb5b1be-7c3d-464f-95a9-ec1ab05c99ae"
"f0f1d833-99f5-483f-8e4f-b6ed377227e7" */