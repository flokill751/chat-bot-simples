"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { FloatingDock } from "./floating-dock";
import { IconAlarm, IconBadgeAr, IconCpu, IconHome } from "@tabler/icons-react";
// import { Icon } from "@iconify/react";
// import { motion as framerMotion, AnimatePresence as FramerAnimatePresence } from "framer-motion"
// import { HoverBorderGradient } from "./hover-border-gradient";


export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSend,
  maxLength = 10000,
  maxRows = 8,
}: {
  placeholders: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSend: (value: string) => void;
  maxLength?: number;
  maxRows?: number;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("")
  const [animating, setAnimating] = useState(false)
  const [rows, setRows] = useState(1);


  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);



  const calculateRows = useCallback((text: string) => {
    if (!textareaRef.current) return 1;

    const textarea = textareaRef.current;
    const previousRows = textarea.rows;
    textarea.rows = 1;

    const content = text || "";
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const padding = parseInt(getComputedStyle(textarea).paddingTop) +
      parseInt(getComputedStyle(textarea).paddingBottom);
    const scrollHeight = textarea.scrollHeight - padding;

    const calculatedRows = Math.floor(scrollHeight / lineHeight);
    const newRows = Math.min(Math.max(1, calculatedRows), maxRows);


    textarea.rows = newRows;
    return newRows;
  }, [maxRows]);


  useEffect(() => {
    const newRows = calculateRows(value || "")
    setRows(newRows ?? 1)
  }, [value, calculateRows]
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (animating) return;

    const newValue = e.target.value.slice(0, maxLength);
    setValue(newValue);

    const newRows = calculateRows(newValue);
    setRows(newRows ?? 1);
    onChange?.(e)

  };


  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 5000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };


  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);

  const draw = useCallback(() => {
    if (!textareaRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const computedStyles = getComputedStyle(textareaRef.current);
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    const fontFamily = computedStyles.fontFamily;

    const lines = value.split('\n');
    const lineHeight = fontSize * 2 * 1.2;


    ctx.font = `${fontSize * 2}px ${fontFamily}`;
    const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

    canvas.width = Math.ceil(maxLineWidth) + 32;
    canvas.height = Math.ceil(lineHeight * lines.length) + 40;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize * 2}px ${fontFamily}`;
    ctx.fillStyle = "#971E06";

    lines.forEach((line, index) => {
      ctx.fillText(line, 16, 40 + index * lineHeight);
    });


    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < canvas.height; t++) {
      let i = 4 * t * canvas.width;
      for (let n = 0; n < canvas.width; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[0]}, ${color[0]}, ${color[0]})`,
    }));
  }, [value]);



  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color: color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
          setRows(1);
        }
      });
    };
    animateFrame(start);
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !animating) {
        vanishAndSubmit();
      }
      return
    }
  };


  const vanishAndSubmit = () => {
    if (!value.trim()) return;

    setAnimating(true);
    draw();

    onSend(value);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const maxChars = 63;
    const textToMeasure = value.slice(0, maxChars);

    const width63 = ctx.measureText(textToMeasure).width;

    // Ajuste para margem esquerda do canvas (se houver)
    const marginLeft = 16;
    const limitX = width63 + marginLeft;

    newDataRef.current = newDataRef.current.filter(pixel => pixel.x <= limitX);

    const maxX = newDataRef.current.reduce(
      (prev, current) => (current.x > prev ? current.x : prev),
      0
    );

    animate(maxX);
  };






  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!value.trim() || animating) return;
    vanishAndSubmit();

  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
         "w-full relative max-w-160 mx-auto rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),_0px_1px_0px_0px_rgba(25,28,33,0.02),_0px_0px_0px_1px_rgba(25,28,33,0.08)] transition duration-200",
        "bg-gradient-to-r from-blue-700  via-gray-500 to-green-900"
      )}
      style={{
        padding: "1px" 
      }}
    >
      <div
        className={cn(
          "rounded-xl bg-[#1C2433] relative",
          value && "bg-[#1C2433]"
        )}
        style={{
          position: 'relative',
          inset: 0,
          margin: '2px', 
          height: 'calc(100% - 4px)',
          width: 'calc(100% - 4px)'
        }}
      >
        <canvas
          className={cn(
            "absolute pointer-events-none text-base transform scale-50 top-2 left-2 sm:left-4 origin-top-left filter invert dark:invert-0 pr-20",
            !animating ? "opacity-0" : "opacity-100"
          )}
          ref={canvasRef}
        />

        <div className="ralative flex flex-col">
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            maxLength={maxLength}
            className={cn(
              "w-full  right-0 relative text-sm sm:text-base z-50 border-none dark:text-white bg-transparent text-white resize-none focus:outline-none focus:ring-0 py-3 px-4 sm:px-8 pr-16 transition-all duration-200",
              animating && "text-transparent dark:text-transparent",
              " [&::-webkit-scrollbar]:w-2",
              "[&::-webkit-scrollbar-track]:bg-gray-800",
              "[&::-webkit-scrollbar-track]:rounded-full",
              " [&::-webkit-scrollbar-track]:m-1",
              "[&::-webkit-scrollbar-thumb]:bg-gray-600",
              "[&::-webkit-scrollbar-thumb]:rounded-full",
              " [&::-webkit-scrollbar-thumb]:hover:bg-gray-500",
              " [&::-webkit-scrollbar-thumb]:active:bg-gray-400"


            )}
            style={{
              minHeight: "3rem",
              maxHeight: `${maxRows * 1.5}rem`,
            }}
          />


          <div className="flex items-center justify-between backdrop-blur-sm px-4 py-3 rounded-b-2xl ">

            {/* Contador de caracteres
          {maxLength && (
            <div className="absolute bottom-4 right-20 z-50 text-xs text-gray-400">
              {value.length}/{maxLength}
            </div>
          )} */}

            <div>
              <FloatingDock
                items={[
                  { title: "Fixar", icon: <IconHome />, href: "/fixar" },
                  { title: "PC", icon: <IconCpu />, href: "/cpu" },
                  { title: "Anexar", icon: <IconBadgeAr />, href: "/anexar" },
                  { title: "Outro", icon: <IconAlarm />, href: "/outro" },

                ]}
              ></FloatingDock> </div>

            {/* <Icon icon="lucide:pin" className="w-5 h-5 text-blue-600 mr-2 " />

          <Icon icon="lucide:cpu" className="w-5 h-5 text-blue-600 mr-2 " />

          <Icon icon="lucide:paperclip" className="w-5 h-5 text-blue-600 mr-2 " /> */}


            <button
            />

            <button
              disabled={!value.trim() || animating}
              type="submit"
              className="absolute right-3 z-50 h-8 w-8 rounded-full disabled:bg-indigo-600 bg-blue-600 dark:bg-zinc-900 dark:disabled:bg-zinc-800 transition duration-200 flex items-center justify-center"
            >

              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-300 h-4 w-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <motion.path
                  d="M5 12l14 0"
                  initial={{
                    strokeDasharray: "50%",
                    strokeDashoffset: "50%",
                  }}
                  animate={{
                    strokeDashoffset: value ? 0 : "50%",
                  }}
                  transition={{
                    duration: 1,
                    ease: "linear",
                  }}
                />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </motion.svg>
            </button>
          </div>
        </div>


        <div className="absolute inset-0 flex items-start rounded-2xl pointer-events-none pt-3">
          <AnimatePresence mode="wait">
            {!value && (
              <motion.p
                initial={{
                  y: 5,
                  opacity: 0,
                }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "linear",
                }}
                className="dark:text-zinc-500 text-sm sm:text-base font-normal text-neutral-500 pl-4 sm:pl-8 text-left w-[calc(100%-2rem)] truncate"
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form >
  );
}