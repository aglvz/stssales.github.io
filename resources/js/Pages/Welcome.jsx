import { Head, Link } from '@inertiajs/react';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image'


var sectionStyle = {
    backgroundImage: `url(${window.location.origin}/fondo5.jpg)`,
    width: "100%",
    height: "100vh"
 }
export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div  className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                {/* <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-auto min-w-full min-h-full"
                    src={`${window.location.origin}/fondo2.jpg`}
                /> */}
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-right gap-2 py-10 lg:grid-cols-3">
                            <nav className="-mx-3 flex flex-1 justify-end fixed-top py-4 px-6 bg-white dark:bg-black/80">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        {/* <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link> */}
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 text-center">
                                <Carousel data-bs-theme="dark" className="position-absolute top-50 start-50 translate-middle">
                                    <Carousel.Item>
                                        <Image src={`${window.location.origin}/computo.jpg`} width={900} height={500}/>
                                        <Carousel.Caption>
                                        <h3>COMPUTO</h3>
                                        <p>SSD, Memoria RAM, Teclados, Discos duros, Mouse, Impresoras, PC Emsabladas, Tablets, Laptops</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={`${window.location.origin}/vigilancia.jpg`} width={900} height={500}/>
                                        <Carousel.Caption>
                                        <h3>SEGURIDAD</h3>
                                        <p>Grabadores, Camaras analogicas, Camaras IP, Camaras Wifi, Alarmas</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                    <Carousel.Item>
                                        <Image src={`${window.location.origin}/software.jpg`} width={900} height={500}/>
                                        <Carousel.Caption>
                                        <h3>SOFTWARE</h3>
                                        <p>
                                            Antivirus, Licencias Office, Licencias Windows, Programas de diseño, Programas de contabilidad, Desarrollo a medida.
                                        </p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                </Carousel>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70 fixed-bottom">
                           Soluciones Tecnologicas y Software
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
