import prisma from "$lib/prisma";
import { JSDOM } from "jsdom";
import dotenv from "dotenv";
dotenv.config();

export async function post({ request }) {
    const authorization = request.headers.get("authorization");
    if (authorization && authorization === `Bearer ${process.env.KUMAMATE_API_KEY}`) {
        const response = await fetch("https://kumamate.net/vip/");
        const body = await response.text();
        const dom = new JSDOM(body);
        const borderPowerString = dom.window.document.querySelector(".vipborder").textContent;
        if (!borderPowerString) {
            return {
                status: 500
            };
        }
        const borderPower = parseInt(borderPowerString.replaceAll(",", ""));
        try {
            await prisma.border.create({
                data: {
                    border: borderPower
                }
            });
            return {
                status: 200
            };
        } catch (err) {
            console.log(err);
            return {
                status: 500
            };
        }
    }
    return {
        status: 403
    };
}
