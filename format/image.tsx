export function getImageFromName(name: string) {
    return name.replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9 \-]/ig, '')
        .replace(/--+/g, '-');
}