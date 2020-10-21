import Image from '../models/Image';
export default {
    render(image: Image) {
        return {
            id: image.id,
            url: `http://199.198.0.130:3333/uploads/${image.path}`,
        };
    },

    renderMany(images: Image[]) {
        return images.map(image => this.render(image));
    }
};