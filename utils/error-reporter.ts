// tamanho máximo do payload (por segurança)
const MAX_PAYLOAD_SIZE = 5_000; // 5kb já é bem razoável

function safeStringify(obj: any) {
  try {
    let json = JSON.stringify(obj);
    if (json.length > MAX_PAYLOAD_SIZE) {
      json = json.slice(0, MAX_PAYLOAD_SIZE) + '...TRUNCATED';
    }
    return json;
  } catch {
    return 'stringify_failed';
  }
}

function sendError(rawPayload: any) {
  try {
    const payload = {
      ...rawPayload,
      url: location.href // coletar a URL atual
    };

    const body = safeStringify(payload);

    fetch('/api/front-to-back-logger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });
  } catch {
    // evitar loop
  }
}

export function setupGlobalErrorLogger() {
  // Erros JS não capturados
  window.onerror = function(message, source, lineno, colno, error) {
    sendError({
      type: 'window.onerror',
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
      userAgent: navigator.userAgent,
      screen: { w: window.innerWidth, h: window.innerHeight }
    });
  };

  // Promises sem catch
  window.onunhandledrejection = function(event) {
    sendError({
      type: 'promise.rejection',
      reason: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
      userAgent: navigator.userAgent,
      screen: { w: window.innerWidth, h: window.innerHeight }
    });
  };

  // console.error
  const originalConsoleError = console.error;
  console.error = (...args) => {
    sendError({
      type: 'console.error',
      args: args.map(a =>
        a instanceof Error
          ? a.message
          : typeof a === 'object'
            ? safeStringify(a)
            : String(a)
      ),
      stack: args[0] instanceof Error ? args[0].stack : new Error().stack,
      userAgent: navigator.userAgent,
      screen: { w: window.innerWidth, h: window.innerHeight }
    });
    originalConsoleError.apply(console, args);
  };

  // Erros de recursos: imagens, scripts etc
  window.addEventListener('error', (event) => {
    // Isso captura erros de recursos, mas precisamos filtrar erros JS,
    // porque onerror acima já cuida deles.
    const target = event.target as HTMLElement;
    const isResource =
      target &&
      (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK');

    if (isResource) {
      sendError({
        type: 'resource.error',
        targetTag: target.tagName,
        src: (target as any).src || (target as any).href,
        userAgent: navigator.userAgent,
        screen: { w: window.innerWidth, h: window.innerHeight }
      });
    }
  }, true);
}
