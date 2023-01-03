export function getImageFromName(name: string) {
    return name.replaceAll(/ /g, '-')
        .replaceAll(/[^a-zA-Z0-9 \-]/ig, '')
        .replaceAll(/--+/g, '-');
}