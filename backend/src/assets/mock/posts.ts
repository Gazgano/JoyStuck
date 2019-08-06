export let lastId = 13;

export const posts = [
    {
        id: 11,
        timestamp: Date.now(),
        type: 'gameDiscover',
        authorName: 'Imbibed',
        title: 'Imbibed veut nous faire découvrir un jeu',
        likesCount: 3,
        commentsCount: 1,
        content: 'Duis sunt tempor culpa est duis qui aliquip tempor mollit. Esse ad minim dolor ea ex culpa laborum. Anim sit sunt in incididunt mollit et culpa ex velit. Fugiat excepteur quis nisi ea occaecat incididunt. Magna excepteur eiusmod sunt dolore ut elit ea dolor Lorem quis anim.'
    },
    {
        id: 12,
        timestamp: Date.now(),
        type: 'newMember',
        authorName: 'system',
        title: 'ClemDOT vient de rejoindre le serveur. Bienvenue à lui !',
        likesCount: 3,
        commentsCount: 0,
    },
    {
        id: 13,
        timestamp: Date.now(),
        type: 'screenshotShare',
        authorName: 'Nini',
        title: 'Nini a partagé une capture d\'écran',
        likesCount: 0,
        commentsCount: 2,
        content: 'Amet minim do dolor sit. Ut non incididunt quis culpa id officia velit. Esse est proident aute excepteur minim nulla laboris. Esse veniam fugiat nostrud adipisicing. Aute occaecat eu labore laboris est enim dolor ex adipisicing aliqua esse.'
    }
];

export function generateNewId() {
    return ++lastId;
}