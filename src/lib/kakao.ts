// 1. 카카오 SDK가 로드되었는지 확인하고 대기하는 함수 (안전장치)
const waitForKakaoSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드되어 있으면 바로 성공
    if (typeof window !== "undefined" && window.Kakao) {
      resolve();
      return;
    }

    // 아직 로드 안 됐으면 0.1초마다 체크 (최대 5초 대기)
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (window.Kakao) {
        clearInterval(interval);
        resolve();
      } else if (count >= 50) { // 5초 지남
        clearInterval(interval);
        reject(new Error("Kakao SDK loading timeout"));
      }
    }, 100);
  });
};

// 2. 초기화 함수
export const initKakao = () => {
  if (typeof window !== "undefined" && window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      if (!process.env.NEXT_PUBLIC_KAKAO_JS_KEY) {
        console.error("환경 변수 NEXT_PUBLIC_KAKAO_JS_KEY가 없습니다.");
        return;
      }
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
  }
};

// 3. 로그인 함수
export const loginWithKakao = async () => {
  try {
    // layout.tsx에서 스크립트를 불러올 때까지 잠시 기다림
    await waitForKakaoSDK();

    // 초기화 안 되어 있으면 초기화
    if (!window.Kakao.isInitialized()) {
      initKakao();
    }

    // 로그인 페이지로 이동
    window.Kakao.Auth.authorize({
      redirectUri: 'http://localhost:3000/oauth/kakao',
    });
    
  } catch (error) {
    console.error("카카오 로그인 에러:", error);
    alert("카카오 SDK를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
  }
};