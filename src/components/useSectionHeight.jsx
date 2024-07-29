import { useEffect, useRef, useState } from "react";

const useSectionHeight = (isOpen) => {
  const [sectionHeight, setSectionHeight] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const newHeight = isOpen ? sectionRef.current.clientHeight : 0;
      setSectionHeight(newHeight);
    }
  }, [isOpen, sectionRef.current?.scrollHeight]);
  return { sectionRef, sectionHeight };
};

export default useSectionHeight;
