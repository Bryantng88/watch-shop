'use client';
import { useEffect, useRef, useState } from 'react';

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};
export default function BenPwaRuntime() {
  const [offline, setOffline] = useState(false),
    [installed, setInstalled] = useState(true),
    [help, setHelp] = useState(false);
  const [installable, setInstallable] = useState(false),
    [installing, setInstalling] = useState(false);
  const [workerError, setWorkerError] = useState(false),
    [updateReady, setUpdateReady] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const prompt = useRef<InstallEvent | null>(null);
  useEffect(() => {
    const display = window.matchMedia('(display-mode: standalone)');
    const sync = () => {
      setOffline(!navigator.onLine);
      setInstalled(
        display.matches ||
          Boolean(
            (navigator as Navigator & { standalone?: boolean }).standalone
          )
      );
    };
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      prompt.current = event as InstallEvent;
      setInstallable(true);
    };
    const didInstall = () => {
      prompt.current = null;
      setInstallable(false);
      setInstalled(true);
      setHelp(false);
    };
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    display.addEventListener('change', sync);
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', didInstall);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
      display.removeEventListener('change', sync);
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', didInstall);
    };
  }, []);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const root = document.documentElement;
    const resize = () => {
      root.style.setProperty('--ben-viewport-height', `${viewport.height}px`);
      root.style.setProperty('--ben-viewport-top', `${viewport.offsetTop}px`);
    };
    resize();
    viewport.addEventListener('resize', resize);
    viewport.addEventListener('scroll', resize);
    return () => {
      viewport.removeEventListener('resize', resize);
      viewport.removeEventListener('scroll', resize);
      root.style.removeProperty('--ben-viewport-height');
      root.style.removeProperty('--ben-viewport-top');
    };
  }, []);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator) || !window.isSecureContext) {
      setWorkerError(true);
      return;
    }
    let disposed = false,
      registration: ServiceWorkerRegistration | undefined;
    const changed = () => {
      const worker = registration?.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (
          !disposed &&
          worker.state === 'installed' &&
          navigator.serviceWorker.controller
        )
          setUpdateReady(true);
      });
    };
    const check = () => {
      if (document.visibilityState === 'visible' && navigator.onLine)
        void registration?.update().catch(() => {});
    };
    void navigator.serviceWorker
      .register('/ben-sw.js', { scope: '/admin/ben', updateViaCache: 'none' })
      .then((value) => {
        if (disposed) return;
        registration = value;
        setWorkerError(false);
        value.addEventListener('updatefound', changed);
        changed();
        if (value.waiting) setUpdateReady(true);
      })
      .catch(() => {
        if (!disposed) setWorkerError(true);
      });
    document.addEventListener('visibilitychange', check);
    return () => {
      disposed = true;
      registration?.removeEventListener('updatefound', changed);
      document.removeEventListener('visibilitychange', check);
    };
  }, [attempt]);
  async function install() {
    const event = prompt.current;
    if (!event) {
      setHelp((value) => !value);
      return;
    }
    prompt.current = null;
    setInstallable(false);
    setInstalling(true);
    try {
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome !== 'accepted') setHelp(true);
    } catch {
      setHelp(true);
    } finally {
      setInstalling(false);
    }
  }
  if (installed && !offline && !workerError && !updateReady) return null;
  return (
    <section
      aria-label="Cài đặt và kết nối Ben"
      className="mx-3 shrink-0 px-1 text-xs text-slate-600 sm:mx-4 sm:mb-2 sm:rounded-xl sm:border sm:border-blue-100 sm:bg-white sm:px-3 sm:py-1"
    >
      {offline && (
        <p role="status" className="py-2 text-amber-800">
          Đang mất kết nối. Tin nhắn chưa gửi vẫn ở đây; kết nối lại để tiếp
          tục.
        </p>
      )}
      {!installed && (
        <button
          type="button"
          disabled={installing}
          onClick={() => void install()}
          className="min-h-11 font-medium text-blue-700"
        >
          {installing
            ? 'Đang mở cài đặt…'
            : installable
              ? 'Cài Ben trên thiết bị'
              : 'Cài Ben'}
        </button>
      )}
      {help && !installed && (
        <p className="pb-2 leading-5">
          iPhone/iPad: mở Ben bằng Safari → Chia sẻ → Thêm vào Màn hình chính.
          Android: mở bằng Chrome → menu ⋮ → Cài đặt ứng dụng hoặc Thêm vào màn
          hình chính.
        </p>
      )}
      {workerError && (
        <p role="status" className="py-2">
          Chưa chuẩn bị được bản cài. Bạn vẫn có thể dùng chat khi có mạng.{' '}
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="min-h-11 text-blue-700 underline"
          >
            Thử lại
          </button>
        </p>
      )}
      {updateReady && (
        <p role="status">
          Có bản cập nhật.{' '}
          <button
            type="button"
            className="min-h-11 text-blue-700 underline"
            onClick={() => {
              if (window.confirm('Tải lại Ben? Tin nhắn chưa gửi sẽ mất.'))
                window.location.reload();
            }}
          >
            Tải lại Ben
          </button>
        </p>
      )}
    </section>
  );
}
