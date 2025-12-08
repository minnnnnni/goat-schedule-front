import { useEffect, useState } from "react";

// window 객체 타입 확장
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

export default function useKakaoSdk(): boolean {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scriptSrc = "https://developers.kakao.com/sdk/js/kakao.js";

    function initOnce() {
      try {
        // [중요] 실제로는 환경변수 process.env.NEXT_PUBLIC_KAKAO_JS_KEY를 사용하는 것이 좋습니다.
        // 백엔드 분과 동일한 키를 사용해야 하므로, 일단 공유해주신 키를 사용하거나 환경변수로 설정하세요.
        const key = "7a4fc8ba2d42d36c1b7bd272a8e5629a"; 
        
        if (key && window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(key);
        }
        setReady(true);
      } catch (e) {
        console.error("useKakaoSdk init error", e);
      }
    }

    // 이미 초기화 되어있으면 바로 ready
    if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
      // [수정] setTimeout으로 감싸서 비동기 처리 -> 에러 해결
      setTimeout(() => setReady(true), 0);
      return;
    }

    // 이미 script가 추가되어 있으면 로드 이벤트 대기
    const existing = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
         // [수정] setTimeout으로 감싸서 비동기 처리
        setTimeout(() => setReady(true), 0);
      } else {
        existing.addEventListener("load", initOnce);
      }
      return () => existing.removeEventListener("load", initOnce);
    }

    // 새로 추가
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => initOnce();
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, []);

  return ready;
}