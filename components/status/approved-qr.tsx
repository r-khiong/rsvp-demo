"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const QR_SIZE = 200;

interface ApprovedQrProps {
  token: string;
}

/**
 * Renders a QR code encoding this status page's full URL.
 *
 * The URL is built on the client (origin + token) to avoid an SSR
 * hydration mismatch, since the parent status page is a Server Component.
 * `token` is accepted as a prop so a future check-in scanner has a clear
 * interface to resolve the registration from the encoded URL.
 */
export function ApprovedQr({ token }: ApprovedQrProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/status/${token}`);
  }, [token]);

  return (
    <div className="rounded-lg border bg-white p-4">
      {url ? (
        <QRCodeSVG value={url} size={QR_SIZE} />
      ) : (
        <div style={{ width: QR_SIZE, height: QR_SIZE }} aria-hidden />
      )}
    </div>
  );
}
