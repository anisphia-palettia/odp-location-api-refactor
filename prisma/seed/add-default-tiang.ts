import {db} from "../../src/services/db";

async function main() {
    const defaultTiangs = [
        {name: "icon"},
        {name: "pribadi"},
        {name: "lain-lain"},
    ];

    for (const tiang of defaultTiangs) {
        await db.tiang.create({
            data: tiang,
        });
    }

    const iconTiang = await db.tiang.findFirst({
        where: {name: "icon"}
    });

    if (iconTiang) {
        await db.coordinate.updateMany({
            data: {tiangId: iconTiang.id}
        });
        console.log("All coordinates updated to tiang 'icon'");
    } else {
        console.log("Tiang with name 'icon' not found");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
