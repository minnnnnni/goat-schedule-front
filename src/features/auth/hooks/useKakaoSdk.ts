import { useEffect, useState } from "react";

export default function useKakaoSdk(): boolean {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const K = (window as any).Kakao;
    const scriptSrc = "https://developers.kakao.com/sdk/js/kakao.js";

    function initOnce() {
      try {
        const key = "7a4fc8ba2d42d36c1b7bd272a8e5629a";
        //const key = (process.env.NEXT_PUBLIC_KAKAO_JS_KEY as string) || "";
        if (key && (window as any).Kakao && !(window as any).Kakao.isInitialized()) {
          (window as any).Kakao.init(key);
        }
        setReady(true);
      } catch (e) {
        console.error("useKakaoSdk init error", e);
      }
    }

    // 이미 초기화 되어있으면 바로 ready
    if (K && K.isInitialized && K.isInitialized()) {
      setReady(true);
      return;
    }

    // 이미 script가 추가되어 있으면 로드 이벤트 대기
    const existing = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).Kakao && (window as any).Kakao.isInitialized && (window as any).Kakao.isInitialized()) {
        setReady(true);
      } else {
        existing.addEventListener("load", initOnce);
      }
      return () => existing.removeEventListener("load", initOnce);
    }

    // 새로 추가
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = initOnce;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return ready;
}
