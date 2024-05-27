import { useRef, useEffect } from "react";

export default function useOutsideClick(
  handler?: VoidFunction,
  listenCapturing = true
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(
    function () {
      function handleClick(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) handler?.();
      }

      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
