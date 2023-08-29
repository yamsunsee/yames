import { useCallback, useMemo } from "react";
import { LANGUAGE } from "../types";
import useStore from "../stores";

const useLanguages = () => {
  const { language } = useStore();

  const localLanguage = useMemo(() => {
    const localLanguageData = sessionStorage.getItem("yames-language");
    if (localLanguageData) {
      return JSON.parse(localLanguageData);
    }
    return LANGUAGE.ENGLISH;
  }, [language]);

  const translate = useCallback(
    (englishContent: string, vietnameseContent: string) => {
      if (localLanguage === LANGUAGE.ENGLISH) return englishContent;
      return vietnameseContent;
    },
    [localLanguage]
  );

  return translate;
};

export default useLanguages;
