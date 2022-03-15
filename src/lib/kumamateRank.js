export function getRanks() {
    const rankCoefficcients = [
        0,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.011,
        1.039,
        1.046,
        1.054,
        1.076,
        1.081,
        1.084,
        1.087,
        1.09,
        1.093,
        1.095,
        1.097,
        1.099,
        1.101,
        1.105
    ];
    return rankCoefficcients;
}

export function getRankData(rank) {
    const rankStr = rank.toString();
    const rankData = {
        "0": {
            "rank": "0",
            "label": "未VIP発射台",
            "color": "#e9f2fd"
        },
        "0.1": {
            "rank": "1",
            "label": "未VIPカオス（下）",
            "color": "#d2e4fb"
        },
        "0.2": {
            "rank": "2",
            "label": "未VIPカオス（中）",
            "color": "#bbd7f9"
        },
        "0.3": {
            "rank": "3",
            "label": "未VIPカオス（上）",
            "color": "#a4caf7"
        },
        "0.4": {
            "rank": "4",
            "label": "VIPに向けた発射台",
            "color": "#8dbcf5"
        },
        "0.5": {
            "rank": "5",
            "label": "未VIP修行ゾーン（下）",
            "color": "#76aff3"
        },
        "0.6": {
            "rank": "6",
            "label": "未VIP修行ゾーン（中）",
            "color": "#5fa2f1"
        },
        "0.7": {
            "rank": "7",
            "label": "未VIP修行ゾーン（上）",
            "color": "#4cc9f0"
        },
        "0.8": {
            "rank": "8",
            "label": "VIPの階段登る",
            "color": "#4abaef"
        },
        "0.9": {
            "rank": "9",
            "label": "VIPまでラストスパート",
            "color": "#49abef"
        },
        "1": {
            "rank": "10",
            "label": "VIP到達！",
            "color": "#4895ef"
        },
        "1.011": {
            "rank": "11",
            "label": "VIP入りたて",
            "color": "#4686ee"
        },
        "1.039": {
            "rank": "12",
            "label": "VIP不安定層",
            "color": "#4473ee"
        },
        "1.046": {
            "rank": "13",
            "label": "一人前VIP",
            "color": "#4361ee"
        },
        "1.054": {
            "rank": "14",
            "label": "VIP街道爆進",
            "color": "#404ad9"
        },
        "1.076": {
            "rank": "15",
            "label": "魔境まであと2-3勝",
            "color": "#3f37c9"
        },
        "1.081": {
            "rank": "16",
            "label": "魔境Lv.1（魔境到達！）",
            "color": "#3b1cb1"
        },
        "1.084": {
            "rank": "17",
            "label": "魔境Lv.2",
            "color": "#3a0ca3"
        },
        "1.087": {
            "rank": "18",
            "label": "魔境Lv.3（魔境街道）",
            "color": "#480ca8"
        },
        "1.09": {
            "rank": "19",
            "label": "魔境Lv.4",
            "color": "#560bad"
        },
        "1.093": {
            "rank": "20",
            "label": "魔境Lv.5（トップオブザ魔境）",
            "color": "#5e0aaf"
        },
        "1.095": {
            "rank": "21",
            "label": "魔境卒業",
            "color": "#7209b7"
        },
        "1.097": {
            "rank": "22",
            "label": "地元最強",
            "color": "#9410aa"
        },
        "1.099": {
            "rank": "23",
            "label": "宇宙最強",
            "color": "#b5179e"
        },
        "1.101": {
            "rank": "24",
            "label": "神",
            "color": "#d61e91"
        },
        "1.105": {
            "rank": "25",
            "label": "桜井",
            "color": "#f72585"
        }
    }
    return rankData[rankStr];
}