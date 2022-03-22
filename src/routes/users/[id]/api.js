import { deleteUserPowers } from "$lib/power";
import { deleteUser } from "$lib/user";

export async function del({ locals, params }) {
    if (!locals.user) {
        return {
            status: 500
        }
    }
    if (locals.user.info.splId != params.id) {
        return {
            status: 403
        };
    }
    try {
        await deleteUserPowers(locals.user.info.splId);
        await deleteUser(locals.user.info.splId);
    } catch (err) {
        return {
            status: 500
        };
    }
    return {
        status: 200
    }
}