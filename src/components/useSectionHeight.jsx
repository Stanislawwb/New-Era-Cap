import { useEffect, useRef, useState } from "react";

const useSectionHeight = (isOpen) => {
  const [sectionHeight, setSectionHeight] = useState(0);
  const sectionRef = useRef(null);

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
