//a class that limits the current user to certain apis
export default class Gate {
    constructor(user) {
        this.user = user;
    }

    isAdmin() {
        return this.user.type === 'admin';
    }

    isUser() {
        return this.user.type === 'user';
    }

    isAuthor() {
        return this.user.type === 'author';
    }

    isAdminOrAuthor() {
        return this.user.type === 'admin' || this.user.type === 'author' ? true : false;
    }

    isAuthorOrUser() {
        return this.user.type === 'author' || this.user.type === 'user' ? true : false;
    }
}