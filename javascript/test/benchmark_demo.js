function betterLeagueName1(league) {
    return league.replaceAll("永久", "Standard")
        .replaceAll("虚空", "Void")
        .replaceAll("赛季", "")
        .replaceAll("季前赛", "Pre")
        .replaceAll("独狼", "SSF_")
        .replaceAll("专家", "HC_")
        .replaceAll("无情", "R_")
        .replaceAll("（", "(")
        .replaceAll("）", ")");
}

const replacements = {
    "永久": "Standard",
    "虚空": "Void",
    "赛季": "",
    "季前赛": "Pre",
    "独狼": "SSF_",
    "专家": "HC_",
    "无情": "R_",
    "（": "(",
    "）": ")"
};
function betterLeagueName(league) {
    return league.replace(/永久|虚空|赛季|季前赛|独狼|专家|无情|（|）/g, match => replacements[match]);
}

const testcases = [
    "永久",
    "虚空",
    "S21赛季",
    "S21季前赛",
    "S21赛季（独狼）",
    "S21赛季（专家）",
    "S21赛季（独狼专家）",
    "S21赛季（无情独狼专家）",
];

function main() {
    console.time('1');
    for (let i = 0; i < 100000; i++) {
        for (const t of testcases) {
            betterLeagueName1(t);
        }
    }
    console.timeEnd('1');
    console.time('2');
    for (let i = 0; i < 100000; i++) {
        for (const t of testcases) {
            betterLeagueName2(t);
        }
    }
    console.timeEnd('2');
}

main();