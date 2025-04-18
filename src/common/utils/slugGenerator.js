import slugify from 'slugify';

export async function slugGenerator(title = "", model) {
    const slug = slugify(title, { lower: true });
    const existingSlug = await model.findOne({ slug });
    let finalSlug = slug;

    if (existingSlug) {
        const suffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        finalSlug = `${slug}-${suffix}`;
    }

    return finalSlug;
}