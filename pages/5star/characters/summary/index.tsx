export async function getStaticProps() {
    return {
        props: {
            banners: require('@/data/bannersSummary.json').characters['5']
        },
    };
}

export default function FiveStarBannerSummary() {

}