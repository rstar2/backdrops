import React from "react";
import gsap from "gsap";

export default function Stars({
    densityRatio = 0.5,
    defaultAlpha = 0.5,
    sizeLimit = 10,
    scaleLimit = 12, // limit the range of how big or small a star can get
    proximityRatio = 0.1, // the proximity at which to base that on
}) {
    const canvasRef = React.useRef(null);
    const contextRef = React.useRef(null);
    const starsRef = React.useRef(null);

    const vminRef = React.useRef(null);
    const scaleMapperRef = React.useRef(null);
    const alphaMapperRef = React.useRef(null);

    React.useEffect(() => {
        contextRef.current =
            canvasRef.current.getContext("2d");

        const load = () => {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;

            vminRef.current = Math.min(
                window.innerHeight,
                window.innerWidth,
            );

            const STAR_COUNT = Math.floor(
                vminRef.current * densityRatio,
            );

            // this will be a function
            scaleMapperRef.current = gsap.utils.mapRange(
                0,
                vminRef.current * proximityRatio,
                scaleLimit,
                1,
            );
            // this will be a function
            alphaMapperRef.current = gsap.utils.mapRange(
                0,
                vminRef.current * proximityRatio,
                1,
                defaultAlpha,
            );

            starsRef.current = new Array(STAR_COUNT)
                .fill()
                .map(() => ({
                    x: gsap.utils.random(
                        0,
                        window.innerWidth,
                        1,
                    ),
                    y: gsap.utils.random(
                        0,
                        window.innerHeight,
                        1,
                    ),
                    size: gsap.utils.random(
                        1,
                        sizeLimit,
                        1,
                    ),
                    scale: 1,
                    alpha: gsap.utils.random(
                        0.1,
                        defaultAlpha,
                        0.1,
                    ),
                }));
        };

        const render = () => {
            contextRef.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );
            starsRef.current.forEach((star) => {
                contextRef.current.fillStyle = `hsla(0, 100%, 100%, ${star.alpha})`;
                contextRef.current.beginPath();
                contextRef.current.arc(
                    star.x,
                    star.y,
                    (star.size / 2) * star.scale,
                    0,
                    Math.PI * 2,
                );
                contextRef.current.fill();
            });
        };

        const update = ({ x, y }) => {
            starsRef.current.forEach((star) => {
                const DISTANCE = Math.sqrt(
                    (star.x - x) ** 2 + (star.y - y) ** 2,
                );
                gsap.to(star, {
                    scale: scaleMapperRef.current(
                        Math.min(
                            DISTANCE,
                            vminRef.current *
                                proximityRatio,
                        ),
                    ),
                    alpha: alphaMapperRef.current(
                        Math.min(
                            DISTANCE,
                            vminRef.current *
                                proximityRatio,
                        ),
                    ),
                });
            });
        };

        const exit = () => {
            gsap.to(starsRef.current, {
                scale: 1,
                alpha: defaultAlpha,
            });
        };

        load();
        gsap.ticker.add(render);
        gsap.ticker.fps(24);

        // Set up event handling
        window.addEventListener("resize", load);
        document.addEventListener("pointermove", update);
        document.addEventListener("pointerleave", exit);
        return () => {
            window.removeEventListener("resize", load);
            document.removeEventListener(
                "pointermove",
                update,
            );
            document.removeEventListener(
                "pointerleave",
                exit,
            );
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: "0",
                background: "#262626",
                zIndex: "-1",
                height: "100vh",
                width: "100vw",
            }}
        />
    );
}
