import axios from "axios";

export async function getUser(uid: string) {
    return await axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
        params: {
            endpoint: 'users/show',
            param: {
                user_id: uid
            }
        }
    });
}
