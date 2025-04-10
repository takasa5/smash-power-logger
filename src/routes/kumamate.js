import prisma from "$lib/prisma";
import * as cheerio from 'cheerio';
import dotenv from "dotenv";
dotenv.config();

export async function post({ request }) {
    const authorization = request.headers.get("authorization");
    if (authorization && authorization === `Bearer ${process.env.KUMAMATE_API_KEY}`) {
        const response = await fetch("https://kumamate.net/vip/");
        const body = await response.text();
        const $ = cheerio.load(body);
        const borderPowerString = $(".vipborder").text();
        if (!borderPowerString) {
            return {
                status: 500,
                body: "border element not found"
            };
        }
        const borderPower = parseInt(borderPowerString.replace(/,/g, ""));
        try {
            console.log(borderPower);
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
                status: 500,
                body: "prisma error"
            };
        }
    }
    return {
        status: 403
    };
}
