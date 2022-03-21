import { getPowers, deletePower, deletePowers } from "$lib/power";

/**
 * 戦闘力の取得（SPL ID、ファイターID指定）
 */
export async function get({ params }) {
    if (isNaN(params.id)) {
        return {
            status: 404
        }
    }
    const splId = Number(params.id);
    const powers = await getPowers(
        splId,
        params.fighterId,
        10
    );

    return {
        status: 200,
        body: powers
    };
}

/**
 * 戦闘力の削除
 */
export async function del({ request, locals, params }) {
    if (locals.user.info.splId != params.id) {
        return {
            status: 403
        };
    }
    const { powerId } = await request.json();
    try {
        if (powerId) {
            await deletePower(powerId);
        } else {
            await deletePowers(
                locals.user.info.splId,
                params.fighterId
            );
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
    return {
        status: 200
    };
}