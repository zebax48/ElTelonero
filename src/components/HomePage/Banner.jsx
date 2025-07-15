import Image from "next/image";

export default function Banner() {
    return (
        <section className="banner">
            <Image src="/banner.jpg" alt="banner" className="banner-image" width={900} height={500} priority/>
        </section>
    );
}