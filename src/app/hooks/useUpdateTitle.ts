import { useEffect } from "react";

export default function useUpdateTitle(title?: string) {
  useEffect(() => {
    if (title && document.title !== title) {
      document.title = title;
    }
  }, [title]);
}
