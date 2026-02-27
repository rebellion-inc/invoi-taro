"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type TutorialStep = {
  id: string;
  path: string;
  selector?: string;
  title: string;
  description: string;
};

type TutorialState = {
  running: boolean;
  stepIndex: number;
  copiedToken: string | null;
  uploadDone: boolean;
};

const STATE_KEY = "invoice-tutorial-state-v1";
const COMPLETED_KEY = "invoice-tutorial-completed-v1";
const AUTO_STARTED_KEY = "invoice-tutorial-auto-started-v1";

const steps: TutorialStep[] = [
  {
    id: "vendors-create",
    path: "/dashboard/vendors",
    selector: '[data-tour-id="vendor-name-input"]',
    title: "1. 取引先を作成",
    description: "取引先名を入力し、「追加」を押して取引先を登録してください。",
  },
  {
    id: "vendors-copy",
    path: "/dashboard/vendors",
    selector: '[data-tour-id="vendor-copy-button"]',
    title: "2. アップロードURLを共有",
    description:
      "作成した取引先の「コピー」を押して、アップロードURLを取得してください。",
  },
  {
    id: "upload-invoice",
    path: "/upload/",
    selector: '[data-tour-id="upload-file-dropzone"]',
    title: "3. 請求書をアップロード",
    description:
      "ファイルを選択して「アップロード」を押してください。完了後に次へ進めます。",
  },
  {
    id: "invoices-check",
    path: "/dashboard/invoices",
    selector: '[data-tour-id="invoice-list"]',
    title: "4. 請求書を確認",
    description:
      "請求書一覧で受信内容を確認し、必要に応じてステータスを切り替えてください。",
  },
  {
    id: "completed",
    path: "/dashboard/invoices",
    title: "完了",
    description: "チュートリアルは完了です。ナビゲーションからいつでも再実行できます。",
  },
];

const defaultState: TutorialState = {
  running: false,
  stepIndex: 0,
  copiedToken: null,
  uploadDone: false,
};

const isStepPathMatched = (step: TutorialStep, pathname: string) => {
  if (step.path === "/upload/") {
    return pathname.startsWith("/upload/");
  }
  return pathname === step.path;
};

const getStepPath = (step: TutorialStep, copiedToken: string | null) => {
  if (step.path === "/upload/") {
    return copiedToken ? `/upload/${copiedToken}` : "/dashboard/vendors";
  }
  return step.path;
};

export function InvoiceFlowTutorial() {
  const pathname = usePathname();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [tutorialState, setTutorialState] = useState<TutorialState>(defaultState);
  const currentStep = steps[tutorialState.stepIndex] ?? steps[0];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        try {
          setTutorialState(JSON.parse(raw) as TutorialState);
        } catch {
          setTutorialState(defaultState);
        }
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const persistState = useCallback(
    (updater: TutorialState | ((prev: TutorialState) => TutorialState)) => {
      setTutorialState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        localStorage.setItem(STATE_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const startTutorial = useCallback(
    (autoStarted: boolean) => {
      persistState({
        running: true,
        stepIndex: 0,
        copiedToken: null,
        uploadDone: false,
      });
      localStorage.removeItem(COMPLETED_KEY);
      if (autoStarted) {
        localStorage.setItem(AUTO_STARTED_KEY, "1");
      }
      if (pathname !== "/dashboard/vendors") {
        router.push("/dashboard/vendors");
      }
    },
    [pathname, persistState, router]
  );

  const closeTutorial = useCallback(
    (completed: boolean) => {
      persistState({ ...defaultState });
      if (completed) {
        localStorage.setItem(COMPLETED_KEY, "1");
      }
    },
    [persistState]
  );

  useEffect(() => {
    if (!hydrated) return;
    const onStart = () => startTutorial(false);
    const onVendorCopied = (event: Event) => {
      const detail = (event as CustomEvent<{ token?: string }>).detail;
      const token = detail?.token;
      if (!token) return;
      persistState((prev) => ({ ...prev, copiedToken: token }));
    };
    const onUploadSuccess = () => {
      persistState((prev) => ({ ...prev, uploadDone: true }));
    };

    window.addEventListener("invoice-tutorial:start", onStart);
    window.addEventListener("invoice-tutorial:vendor-copied", onVendorCopied);
    window.addEventListener("invoice-tutorial:upload-success", onUploadSuccess);
    return () => {
      window.removeEventListener("invoice-tutorial:start", onStart);
      window.removeEventListener("invoice-tutorial:vendor-copied", onVendorCopied);
      window.removeEventListener("invoice-tutorial:upload-success", onUploadSuccess);
    };
  }, [hydrated, persistState, startTutorial]);

  useEffect(() => {
    if (!hydrated) return;
    if (tutorialState.running) return;
    const isDashboard = pathname.startsWith("/dashboard");
    if (!isDashboard) return;
    const completed = localStorage.getItem(COMPLETED_KEY) === "1";
    const autoStarted = localStorage.getItem(AUTO_STARTED_KEY) === "1";
    if (!completed && !autoStarted) {
      const timer = window.setTimeout(() => startTutorial(true), 0);
      return () => window.clearTimeout(timer);
    }
  }, [hydrated, pathname, startTutorial, tutorialState.running]);

  useEffect(() => {
    if (!hydrated) return;
    if (!tutorialState.running) {
      return;
    }
    if (!isStepPathMatched(currentStep, pathname)) return;
    if (!currentStep.selector) return;

    const element = document.querySelector(currentStep.selector);
    if (!(element instanceof HTMLElement)) return;
    element.classList.add("invoice-tutorial-highlight");
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    return () => {
      element.classList.remove("invoice-tutorial-highlight");
    };
  }, [currentStep, hydrated, pathname, tutorialState.running]);

  const canGoNext = useMemo(() => {
    if (currentStep.id === "vendors-copy") {
      return Boolean(tutorialState.copiedToken);
    }
    if (currentStep.id === "upload-invoice") {
      return tutorialState.uploadDone;
    }
    return true;
  }, [currentStep.id, tutorialState.copiedToken, tutorialState.uploadDone]);

  const moveToStepRoute = () => {
    const path = getStepPath(currentStep, tutorialState.copiedToken);
    if (path !== pathname) {
      router.push(path);
    }
  };

  const handleNext = () => {
    if (currentStep.id === "completed") {
      closeTutorial(true);
      return;
    }

    if (currentStep.id === "vendors-copy") {
      if (!tutorialState.copiedToken) return;
      persistState((prev) => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
      router.push(`/upload/${tutorialState.copiedToken}`);
      return;
    }

    if (currentStep.id === "upload-invoice") {
      persistState((prev) => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
      router.push("/dashboard/invoices");
      return;
    }

    persistState((prev) => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
  };

  if (!hydrated || !tutorialState.running) {
    return null;
  }

  const isMatched = isStepPathMatched(currentStep, pathname);
  const targetExists =
    !currentStep.selector ||
    !isMatched ||
    Boolean(document.querySelector(currentStep.selector));

  return (
    <div className="fixed inset-0 z-[1000] pointer-events-none">
      <div className="pointer-events-auto fixed right-4 bottom-4 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-indigo-100 bg-white p-4 shadow-2xl">
        <p className="text-xs font-semibold text-indigo-600 mb-2">
          チュートリアル {Math.min(tutorialState.stepIndex + 1, 4)} / 4
        </p>
        <h3 className="text-base font-bold text-gray-900">{currentStep.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{currentStep.description}</p>
        {!isMatched ? (
          <p className="mt-2 text-xs text-amber-600">
            このステップのページに移動してから進行します。
          </p>
        ) : null}
        {currentStep.selector && isMatched && !targetExists ? (
          <p className="mt-2 text-xs text-amber-600">
            対象要素の表示を待っています。表示後にハイライトされます。
          </p>
        ) : null}
        {currentStep.id === "vendors-copy" && !tutorialState.copiedToken ? (
          <p className="mt-2 text-xs text-amber-600">
            「コピー」を押すと次へ進めます。
          </p>
        ) : null}
        {currentStep.id === "upload-invoice" && !tutorialState.uploadDone ? (
          <p className="mt-2 text-xs text-amber-600">
            アップロード完了後に次へ進めます。
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => closeTutorial(false)}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            閉じる
          </button>
          <div className="flex items-center gap-2">
            {!isMatched ? (
              <button
                type="button"
                onClick={moveToStepRoute}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                ページへ移動
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentStep.id === "completed" ? "終了" : "次へ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
