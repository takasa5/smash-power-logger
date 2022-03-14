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
            "color": "#FFFFFF"
        },
        "0.1": {
            "rank": "1",
            "label": "未VIPカオス（下）",
            "color": "#FFFFFF"
        },
        "0.2": {
            "rank": "2",
            "label": "未VIPカオス（中）",
            "color": "#FFFFFF"
        },
        "0.3": {
            "rank": "3",
            "label": "未VIPカオス（上）",
            "color": "#EBF4FB"
        },
        "0.4": {
            "rank": "4",
            "label": "VIPに向けた発射台",
            "color": "#D8E9FD"
        },
        "0.5": {
            "rank": "5",
            "label": "未VIP修行ゾーン（下）",
            "color": "#C4DFFD"
        },
        "0.6": {
            "rank": "6",
            "label": "未VIP修行ゾーン（中）",
            "color": "#B1D4FC"
        },
        "0.7": {
            "rank": "7",
            "label": "未VIP修行ゾーン（上）",
            "color": "#9DC9FB"
        },
        "0.8": {
            "rank": "8",
            "label": "VIPの階段登る",
            "color": "#89BEFA"
        },
        "0.9": {
            "rank": "9",
            "label": "VIPまでラストスパート",
            "color": "#76B3F9"
        },
        "1": {
            "rank": "10",
            "label": "VIP到達！",
            "color": "#62A8F8"
        },
        "1.011": {
            "rank": "11",
            "label": "VIP入りたて",
            "color": "#4F9EF8"
        },
        "1.039": {
            "rank": "12",
            "label": "VIP不安定層",
            "color": "#3B93F7"
        },
        "1.046": {
            "rank": "13",
            "label": "一人前VIP",
            "color": "#2888F6"
        },
        "1.054": {
            "rank": "14",
            "label": "VIP街道爆進",
            "color": "#147DF5"
        },
        "1.076": {
            "rank": "15",
            "label": "魔境まであと2-3勝",
            "color": "#0969DA"
        },
        "1.081": {
            "rank": "16",
            "label": "魔境Lv.1（魔境到達！）",
            "color": "#0860C4"
        },
        "1.084": {
            "rank": "17",
            "label": "魔境Lv.2",
            "color": "#0756B0"
        },
        "1.087": {
            "rank": "18",
            "label": "魔境Lv.3（魔境街道）",
            "color": "#074D9D"
        },
        "1.09": {
            "rank": "19",
            "label": "魔境Lv.4",
            "color": "#064389"
        },
        "1.093": {
            "rank": "20",
            "label": "魔境Lv.5（トップオブザ魔境）",
            "color": "#053976"
        },
        "1.095": {
            "rank": "21",
            "label": "魔境卒業",
            "color": "#043062"
        },
        "1.097": {
            "rank": "22",
            "label": "地元最強",
            "color": "#03264E"
        },
        "1.099": {
            "rank": "23",
            "label": "宇宙最強",
            "color": "#021D3B"
        },
        "1.101": {
            "rank": "24",
            "label": "神",
            "color": "#021327"
        },
        "1.105": {
            "rank": "25",
            "label": "桜井",
            "color": "#010A14"
        }
    }
    return rankData[rankStr];
}