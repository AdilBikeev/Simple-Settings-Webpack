export default class Post {
    constructor(title, img)
    {
        this.title = title;
        this.date = new Date();
        this.img = img;
    }

    toString() {
        return JSON.stringify({
            title: this.date,
            date: this.date.toJSON(),
            img: this.img
        })
    }
}