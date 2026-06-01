import crypto from "crypto";

const DEFAULT_REPLAY_WINDOW_SECONDS = 300;

export function safeCompare(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyHmacSignature(params: {
  payload: string;
  signature: string | null;
  secret: string | undefined;
  algorithm?: "sha256" | "sha1";
}) {
  if (!params.secret || !params.signature) return false;

  const algorithm = params.algorithm ?? "sha256";
  const digest = crypto
    .createHmac(algorithm, params.secret)
    .update(params.payload)
    .digest("hex");

  const normalizedSignature = params.signature.replace(/^sha256=/, "").replace(/^sha1=/, "");
  return safeCompare(digest, normalizedSignature);
}

export function isWithinReplayWindow(timestamp: string | null, windowSeconds = DEFAULT_REPLAY_WINDOW_SECONDS) {
  if (!timestamp) return false;

  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) return false;

  const timestampMs = numericTimestamp > 9999999999 ? numericTimestamp : numericTimestamp * 1000;
  const ageMs = Math.abs(Date.now() - timestampMs);

  return ageMs <= windowSeconds * 1000;
}

export function verifySharedSecret(receivedSecret: string | null, expectedSecret: string | undefined) {
  if (!receivedSecret || !expectedSecret) return false;
  return safeCompare(expectedSecret, receivedSecret);
}
