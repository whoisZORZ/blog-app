import { firebase } from '../lib/Firebase';

export async function doesUsernameExist(username) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map((user) => user.data().length > 0);
}

export async function doesEmailAddressExist(emailAddress) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('emailAddress', '==', emailAddress)
        .get();

    return result.docs.map((user) => user.data().length > 0);
}

export async function getUserByUsername(username) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

export async function getUserByUserId(userId) {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', '==', userId)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}

export async function getPostByPostSlug(postSlug) {
    const result = await firebase
        .firestore()
        .collection('posts')
        .where('slug', '==', postSlug)
        .get();

    return result.docs.map((item) => ({
        ...item.data(),
        docId: item.id
    }));
}