import { useEffect, useRef, useState } from "react";


interface UseSectionHeightReturn {
  sectionRef: React.RefObject<HTMLDivElement>;
  sectionHeight: number;
}

const useSectionHeight = (isOpen: boolean): UseSectionHeightReturn  => {
  const [sectionHeight, setSectionHeight] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (sectionRef.current) {
        const newHeight = isOpen ? sectionRef.current.scrollHeight : 0;
        setSectionHeight(newHeight);
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  return { sectionRef, sectionHeight };
};

export default useSectionHeight;
